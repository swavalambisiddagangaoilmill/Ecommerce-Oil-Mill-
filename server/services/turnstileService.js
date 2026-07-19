// Verifies Cloudflare Turnstile tokens before sensitive public submissions.
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export async function verifyTurnstile(token, req) {
  if (!env.turnstile.secretKey) return { skipped: true };
  if (!token) throw new ApiError("Human verification is required.", 400, [{ code: "TURNSTILE_REQUIRED" }]);
  const body = new URLSearchParams({ secret: env.turnstile.secretKey, response: token, remoteip: req.ip });
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const payload = await response.json().catch(() => ({}));
  if (!payload.success) throw new ApiError("Human verification failed.", 400, [{ code: "TURNSTILE_FAILED" }]);
  return payload;
}

export function requireTurnstile(req) {
  return verifyTurnstile(req.body.turnstileToken || req.body.cfTurnstileToken, req);
}
