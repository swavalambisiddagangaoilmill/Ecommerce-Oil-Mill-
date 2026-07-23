// Verifies Cloudflare Turnstile tokens before sensitive public submissions.
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { logExternalFailure } from "./serviceStatusService.js";

export async function verifyTurnstile(token, req) {
  if (!env.turnstile.secretKey) return { skipped: true };
  if (!token) throw new ApiError("Human verification is required.", 400, [{ code: "TURNSTILE_REQUIRED" }]);
  const body = new URLSearchParams({ secret: env.turnstile.secretKey, response: token, remoteip: req.ip });
  let response;
  try {
    response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  } catch (error) {
    logExternalFailure("turnstile", error, { action: "verify" });
    throw new ApiError("Human verification is temporarily unavailable.", 503);
  }
  const payload = await response.json().catch(() => ({}));
  if (!payload.success) throw new ApiError("Human verification failed.", 400, [{ code: "TURNSTILE_FAILED" }]);
  return payload;
}

export function requireTurnstile(req) {
  return verifyTurnstile(req.body.turnstileToken || req.body.cfTurnstileToken, req);
}


