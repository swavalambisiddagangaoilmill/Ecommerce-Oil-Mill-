// Verifies Google identity tokens for OAuth login.
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { isServiceAvailable, logExternalFailure } from "./serviceStatusService.js";

function debugGoogle(stage, details = {}) {
  // DEBUG: Remove after Google OAuth issue is resolved
  console.log("[Google OAuth Debug]", stage, details);
}

function attachDebug(error, stage, details) {
  error.debugStage = stage;
  error.debugDetails = details;
  return error;
}

function safePayload(payload) {
  return {
    aud: payload?.aud,
    iss: payload?.iss,
    azp: payload?.azp,
    emailPresent: Boolean(payload?.email),
    emailVerified: payload?.email_verified,
    namePresent: Boolean(payload?.name),
    subPresent: Boolean(payload?.sub),
    exp: payload?.exp,
    error: payload?.error,
    errorDescription: payload?.error_description,
  };
}

export async function verifyGoogleIdToken(idToken) {
  debugGoogle("verifyGoogleIdToken:start", {
    credentialReceived: Boolean(idToken),
    googleClientIdLoaded: Boolean(env.oauth.googleClientId),
  });

  if (!isServiceAvailable("googleOAuth")) {
    throw attachDebug(new ApiError("Google sign-in is temporarily unavailable.", 503), "verifyGoogleIdToken", "Google OAuth is unavailable");
  }
  if (!env.oauth.googleClientId) {
    debugGoogle("verifyGoogleIdToken:validation", { decision: "missing_google_client_id" });
    throw attachDebug(new ApiError("Google Sign In is not configured.", 503), "verifyGoogleIdToken", "Google client ID is missing");
  }
  if (!idToken) {
    debugGoogle("verifyGoogleIdToken:validation", { decision: "missing_credential" });
    throw attachDebug(new ApiError("Google credential is required.", 400), "verifyGoogleIdToken", "Google credential is missing");
  }

  let response;
  try {
    debugGoogle("fetch:start", { url: "https://oauth2.googleapis.com/tokeninfo", credentialReceived: true });
    response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
    debugGoogle("fetch:completed", { status: response.status, ok: response.ok });
  } catch (error) {
    logExternalFailure("googleOAuth", error, { action: "verify_token" });
    console.error("// DEBUG: Remove after Google OAuth issue is resolved", "Google token verification request failed", { name: error.name, message: error.message, stack: error.stack });
    throw attachDebug(new ApiError("Google sign-in is temporarily unavailable.", 503), "fetch", error.message);
  }

  const payload = await response.json().catch((error) => {
    console.error("// DEBUG: Remove after Google OAuth issue is resolved", "Google tokeninfo JSON parse failed", { name: error.name, message: error.message });
    return {};
  });
  const sanitizedPayload = safePayload(payload);
  debugGoogle("tokeninfo:payload", { responseStatus: response.status, payload: sanitizedPayload });
  debugGoogle("tokeninfo:validation", {
    expectedClientIdLoaded: Boolean(env.oauth.googleClientId),
    receivedAudPresent: Boolean(payload.aud),
    audienceMatches: payload.aud === env.oauth.googleClientId,
    emailPresent: Boolean(payload.email),
  });

  if (!response.ok) {
    throw attachDebug(new ApiError("Google authentication failed.", 401), "tokeninfo", `Google tokeninfo returned ${response.status}`);
  }
  if (payload.aud !== env.oauth.googleClientId) {
    console.error("// DEBUG: Remove after Google OAuth issue is resolved", "Google OAuth audience mismatch", { expectedClientId: env.oauth.googleClientId, receivedAud: payload.aud });
    throw attachDebug(new ApiError("Google authentication failed.", 401), "verifyGoogleIdToken", "Audience mismatch");
  }
  if (!payload.email) {
    throw attachDebug(new ApiError("Google authentication failed.", 401), "verifyGoogleIdToken", "Email missing from Google payload");
  }

  debugGoogle("verifyGoogleIdToken:success", { emailPresent: true, providerIdPresent: Boolean(payload.sub) });
  return { providerId: payload.sub, email: payload.email, name: payload.name || payload.email.split("@")[0], emailVerified: payload.email_verified === "true" || payload.email_verified === true };
}

