// Admin audit logging helpers.
import AdminAuditLog from "../../models/AdminAuditLog.js";

const sensitiveKeys = new Set(["password", "token", "refreshToken", "jwt", "secret", "apiKey", "apiSecret", "keySecret"]);

function redact(value) {
  if (!value || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(redact);
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sensitiveKeys.has(key) ? "[REDACTED]" : redact(item)]));
}

export async function writeAuditLog(req, { action, resourceType, resourceId, summary, before, after }) {
  await AdminAuditLog.create({
    admin: req.user?._id,
    adminEmail: req.user?.email,
    action,
    resourceType,
    resourceId: resourceId?.toString?.() || resourceId,
    summary,
    before: redact(before),
    after: redact(after),
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
}
