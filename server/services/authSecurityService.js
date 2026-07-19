// Centralizes user security, sessions, devices, OTPs, and login history.
import crypto from "crypto";
import { ApiError } from "../utils/ApiError.js";
import { sendOtpEmail } from "./emailService.js";

const otpTtlMs = 10 * 60 * 1000;
const lockMs = 15 * 60 * 1000;

export function createPlainToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashValue(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

export function getDeviceFingerprint(req) {
  return req.body?.deviceFingerprint || req.get("x-device-fingerprint") || hashValue(`${req.ip}:${req.get("user-agent") || "unknown"}`);
}

export function getDeviceDetails(req) {
  const userAgent = req.get("user-agent") || "";
  const browser = /Edg\//.test(userAgent) ? "Edge" : /Chrome\//.test(userAgent) ? "Chrome" : /Firefox\//.test(userAgent) ? "Firefox" : /Safari\//.test(userAgent) ? "Safari" : "Unknown browser";
  const os = /Windows/.test(userAgent) ? "Windows" : /Android/.test(userAgent) ? "Android" : /iPhone|iPad/.test(userAgent) ? "iOS" : /Mac OS/.test(userAgent) ? "macOS" : /Linux/.test(userAgent) ? "Linux" : "Unknown OS";
  return { fingerprint: getDeviceFingerprint(req), ip: req.ip, userAgent, browser, os, device: /Mobile|Android|iPhone|iPad/.test(userAgent) ? "Mobile" : "Desktop", location: "Approximate location unavailable" };
}

export function pushLoginHistory(user, req, type, metadata = {}) {
  const details = getDeviceDetails(req);
  user.loginHistory = user.loginHistory || [];
  user.loginHistory.unshift({ type, ...details, metadata, createdAt: new Date() });
  user.loginHistory = user.loginHistory.slice(0, 50);
}

export function isKnownDevice(user, req) {
  const fingerprint = getDeviceFingerprint(req);
  return (user.trustedDevices || []).some((item) => item.fingerprint === fingerprint);
}

export function trustDevice(user, req) {
  const details = getDeviceDetails(req);
  user.trustedDevices = user.trustedDevices || [];
  const existing = user.trustedDevices.find((item) => item.fingerprint === details.fingerprint);
  if (existing) Object.assign(existing, details, { lastActive: new Date() });
  else user.trustedDevices.push({ ...details, trustedAt: new Date(), lastActive: new Date() });
}

export function upsertSession(user, req, refreshToken, sessionId, remember = false) {
  const details = getDeviceDetails(req);
  user.sessions = user.sessions || [];
  const refreshTokenHash = hashValue(refreshToken);
  const expiresAt = new Date(Date.now() + (remember ? 30 : 7) * 24 * 60 * 60 * 1000);
  const existing = user.sessions.find((item) => item.sessionId === sessionId);
  if (existing) Object.assign(existing, details, { refreshTokenHash, lastActive: new Date(), expiresAt, revokedAt: undefined });
  else user.sessions.push({ sessionId, refreshTokenHash, ...details, loginAt: new Date(), lastActive: new Date(), expiresAt });
  user.sessions = user.sessions.filter((item) => !item.revokedAt && item.expiresAt > new Date()).slice(-12);
}

export function findSessionByRefresh(user, refreshToken) {
  const hash = hashValue(refreshToken);
  return (user.sessions || []).find((item) => item.refreshTokenHash === hash && !item.revokedAt && item.expiresAt > new Date());
}

export function revokeSession(user, sessionId) {
  (user.sessions || []).forEach((item) => { if (!sessionId || item.sessionId === sessionId) item.revokedAt = new Date(); });
}

export function recordFailedLogin(user) {
  user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
  if (user.failedLoginAttempts >= 5) user.turnstileRequiredUntil = new Date(Date.now() + lockMs);
  if (user.failedLoginAttempts >= 12) user.loginLockUntil = new Date(Date.now() + lockMs * Math.ceil(user.failedLoginAttempts / 12));
}

export function assertLoginAllowed(user) {
  if (user.loginLockUntil && user.loginLockUntil > new Date()) throw new ApiError("Authentication is temporarily unavailable. Please try again later.", 423, [{ code: "LOGIN_LOCKED" }]);
}

export function loginNeedsTurnstile(user) {
  return Boolean(user?.turnstileRequiredUntil && user.turnstileRequiredUntil > new Date());
}

export function resetLoginProtection(user) {
  user.failedLoginAttempts = 0;
  user.loginLockUntil = undefined;
  user.turnstileRequiredUntil = undefined;
}

export async function createOtp(user, purpose) {
  const code = String(crypto.randomInt(100000, 999999));
  user.otpRecords = user.otpRecords || [];
  user.otpRecords = user.otpRecords.filter((item) => item.expiresAt > new Date() && !item.verified).slice(-5);
  user.otpRecords.push({ purpose, codeHash: hashValue(code), expiresAt: new Date(Date.now() + otpTtlMs), attempts: 0, maxAttempts: 5, verified: false, createdAt: new Date() });
  await sendOtpEmail(user, code, purpose);
}

export function verifyOtp(user, purpose, code) {
  const record = [...(user.otpRecords || [])].reverse().find((item) => item.purpose === purpose && !item.verified && item.expiresAt > new Date());
  if (!record) throw new ApiError("Security code is expired. Request a new code.", 400, [{ code: "OTP_EXPIRED" }]);
  record.attempts += 1;
  if (record.attempts > record.maxAttempts) throw new ApiError("Too many security code attempts.", 429, [{ code: "OTP_RATE_LIMIT" }]);
  if (record.codeHash !== hashValue(code)) throw new ApiError("Invalid security code.", 400, [{ code: "OTP_INVALID" }]);
  record.verified = true;
  return true;
}
