// Verifies Google identity tokens for OAuth login.
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export async function verifyGoogleIdToken(idToken) {
  console.log("Backend GOOGLE_CLIENT_ID:", env.oauth.googleClientId);
  console.log("Token received:", !!idToken);

  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
  );

  const payload = await response.json().catch(() => ({}));

  console.log("Google payload:", payload);
  if (!env.oauth.googleClientId) throw new ApiError("Google Sign In is not configured.", 503);
  if (!idToken) throw new ApiError("Google credential is required.", 400);
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.aud !== env.oauth.googleClientId || !payload.email) throw new ApiError("Google authentication failed.", 401);
  return { providerId: payload.sub, email: payload.email, name: payload.name || payload.email.split("@")[0], emailVerified: payload.email_verified === "true" || payload.email_verified === true };
}
