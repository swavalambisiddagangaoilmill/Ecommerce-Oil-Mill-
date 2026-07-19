// Enforces active restrictions before protected actions continue.
import Restriction from "../models/Restriction.js";
import { ApiError } from "../utils/ApiError.js";

function identifiers(req) {
  return {
    ip: req.ip,
    deviceId: req.get("x-device-id") || req.body?.deviceId,
    fingerprint: req.get("x-device-fingerprint") || req.body?.deviceFingerprint,
    account: req.user?._id,
  };
}

export async function findActiveRestriction(req) {
  const now = new Date();
  const ids = identifiers(req);
  const or = [];
  if (ids.ip) or.push({ type: "IP", ip: ids.ip });
  if (ids.deviceId) or.push({ type: "DEVICE", deviceId: ids.deviceId });
  if (ids.fingerprint) or.push({ type: "BROWSER_FINGERPRINT", fingerprint: ids.fingerprint });
  if (ids.account) or.push({ type: "ACCOUNT", account: ids.account });
  if (!or.length) return null;
  const restriction = await Restriction.findOne({ status: "ACTIVE", expiresAt: { $gt: now }, $or: or });
  if (restriction) {
    restriction.lastActivityAt = new Date();
    await restriction.save({ validateBeforeSave: false });
  }
  return restriction;
}

export async function enforceRestriction(req) {
  const restriction = await findActiveRestriction(req);
  if (restriction) throw new ApiError("Access temporarily restricted. Please contact support if this is a mistake.", 403, [{ code: "RESTRICTED", restrictionId: restriction._id }]);
}
