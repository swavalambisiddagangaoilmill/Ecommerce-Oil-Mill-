// JWT utility functions.
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";

export function signToken(userId) {
  return jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function signRefreshToken(userId) {
  return jwt.sign({ id: userId, type: "refresh" }, env.jwtSecret, { expiresIn: env.refreshExpiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

export function setAuthCookie(res, token) {
  const csrfToken = crypto.randomBytes(24).toString("hex");
  res.cookie("token", token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie("csrfToken", csrfToken, {
    httpOnly: false,
    secure: env.isProduction,
    sameSite: env.isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function setRefreshCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookies(res) {
  res.clearCookie("token", { httpOnly: true, sameSite: env.isProduction ? "none" : "lax", secure: env.isProduction });
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: env.isProduction ? "none" : "lax", secure: env.isProduction });
  res.clearCookie("csrfToken", { sameSite: env.isProduction ? "none" : "lax", secure: env.isProduction });
}
