// Security controller records suspicious frontend activity signals.
import SecurityEvent from "../models/SecurityEvent.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { logSecurityEvent } from "../services/securityEventService.js";

const lookbackMs = 72 * 60 * 60 * 1000;
const warningThreshold = 6;
const restrictionThreshold = 12;
const baseRestrictionMs = 30 * 60 * 1000;
const highConfidenceSignals = ["context_menu_repeated", "key_F12", "key_I", "key_J", "key_C", "key_U"];

export const reportSuspiciousActivity = asyncHandler(async (req, res) => {
  const deviceId = req.body.deviceId;
  const signal = String(req.body.signal || "").trim();
  const highConfidence = highConfidenceSignals.includes(signal);

  await logSecurityEvent(req, "suspicious_client_activity", { signal, deviceId }, highConfidence ? "high" : "low");

  if (!highConfidence) {
    return sendSuccess(res, 200, "Security event recorded", { warning: false, restricted: false, restrictedUntil: null, count: 0 });
  }

  const since = new Date(Date.now() - lookbackMs);
  const identity = [];
  if (req.user?._id) identity.push({ user: req.user._id });
  if (deviceId) identity.push({ "metadata.deviceId": deviceId });
  identity.push({ ip: req.ip });

  const query = {
    type: "suspicious_client_activity",
    createdAt: { $gte: since },
    "metadata.signal": { $in: highConfidenceSignals },
    $or: identity,
  };
  const count = await SecurityEvent.countDocuments(query);
  const restrictionLevel = Math.max(0, Math.floor((count - restrictionThreshold) / 6));
  const restrictedUntil = count >= restrictionThreshold ? new Date(Date.now() + baseRestrictionMs * (restrictionLevel + 1)).toISOString() : null;
  sendSuccess(res, 200, "Security event recorded", { warning: count >= warningThreshold, restricted: Boolean(restrictedUntil), restrictedUntil, count });
});
