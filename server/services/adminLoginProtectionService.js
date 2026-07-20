// Progressive automated protection for admin login attempts.
import crypto from "node:crypto";
import AdminLoginProtection from "../models/AdminLoginProtection.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { logSecurityEvent } from "./securityEventService.js";

const GENERIC = "Unable to sign in with those credentials.";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function hash(value) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex");
}

function getFingerprint(req) {
  return req.get("x-browser-fingerprint") || req.body.fingerprint || "";
}

function protectionKey(req) {
  return hash([req.ip, getFingerprint(req), req.get("user-agent") || ""].join("|"));
}

function makeCaptcha() {
  const a = crypto.randomInt(2, 10);
  const b = crypto.randomInt(2, 10);
  return { question: `${a} + ${b}`, answer: String(a + b) };
}

function publicState(record) {
  return record?.captchaQuestion ? { required: true, question: record.captchaQuestion } : { required: false };
}

async function getRecord(req) {
  const key = protectionKey(req);
  const record = await AdminLoginProtection.findOne({ key }).select("+captchaAnswer");
  return record || new AdminLoginProtection({ key, ip: req.ip, fingerprint: getFingerprint(req), userAgent: req.get("user-agent") || "" });
}

async function shouldUseAdminProtection(req) {
  if (req.body.adminMode === true) return true;
  const user = await User.findOne({ email: req.body.email }).select("role").lean();
  return user?.role === "admin";
}

export async function precheckAdminLogin(req) {
  if (!(await shouldUseAdminProtection(req))) return { protected: false };
  const record = await getRecord(req);
  const now = new Date();
  if (record.lockedUntil && record.lockedUntil > now) {
    await logSecurityEvent(req, "admin_login_temp_lock", { fingerprint: getFingerprint(req), lockedUntil: record.lockedUntil }, "high");
    throw new ApiError(GENERIC, 429, [{ code: "ADMIN_LOGIN_LOCKED", captcha: publicState(record) }]);
  }
  if (record.failedAttempts >= 6) {
    if (!record.captchaQuestion || !record.captchaExpires || record.captchaExpires < now) {
      const captcha = makeCaptcha();
      record.captchaQuestion = captcha.question;
      record.captchaAnswer = captcha.answer;
      record.captchaExpires = new Date(Date.now() + 10 * 60 * 1000);
      await record.save();
    }
    if (String(req.body.captchaAnswer || "").trim() !== record.captchaAnswer) {
      await logSecurityEvent(req, "admin_login_captcha_required", { fingerprint: getFingerprint(req) }, "medium");
      throw new ApiError(GENERIC, 401, [{ code: "CAPTCHA_REQUIRED", captcha: publicState(record) }]);
    }
  }
  const delay = record.failedAttempts >= 11 ? 1800 : record.failedAttempts >= 6 ? 650 : 0;
  if (delay) await sleep(delay);
  return { protected: true, record };
}

export async function recordAdminLoginFailure(req, existingRecord) {
  const record = existingRecord || await getRecord(req);
  const now = new Date();
  const last = record.lastAttemptAt ? record.lastAttemptAt.getTime() : 0;
  const veryFast = last && now.getTime() - last < 1500;
  const email = String(req.body.email || "").toLowerCase();
  record.failedAttempts += 1;
  record.lastAttemptAt = now;
  record.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  if (email && !record.attemptedEmails.includes(email)) record.attemptedEmails.push(email);
  const multiUser = record.attemptedEmails.length >= 3;
  if (record.failedAttempts >= 16 || (record.failedAttempts >= 10 && (veryFast || multiUser))) {
    record.lockCount += 1;
    const minutes = Math.min(60, 5 * Math.max(1, record.lockCount));
    record.lockedUntil = new Date(Date.now() + minutes * 60 * 1000);
    await logSecurityEvent(req, "admin_login_temporary_lock", { fingerprint: getFingerprint(req), attempts: record.failedAttempts, lockMinutes: minutes }, "high");
  } else if (veryFast || multiUser) {
    await logSecurityEvent(req, "admin_login_suspicious", { fingerprint: getFingerprint(req), attempts: record.failedAttempts, multiUser, veryFast }, "high");
  } else {
    await logSecurityEvent(req, "admin_login_failed", { fingerprint: getFingerprint(req), attempts: record.failedAttempts }, "medium");
  }
  if (record.failedAttempts >= 6 && !record.captchaQuestion) {
    const captcha = makeCaptcha();
    record.captchaQuestion = captcha.question;
    record.captchaAnswer = captcha.answer;
    record.captchaExpires = new Date(Date.now() + 10 * 60 * 1000);
  }
  await record.save();
  return publicState(record);
}

export async function recordAdminLoginSuccess(req, existingRecord, user) {
  const record = existingRecord || await getRecord(req);
  await AdminLoginProtection.deleteOne({ key: record.key });
  await logSecurityEvent(req, "admin_login_success", { fingerprint: getFingerprint(req), admin: user._id }, "low");
}
