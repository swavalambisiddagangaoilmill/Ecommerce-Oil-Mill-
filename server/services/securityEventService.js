// Security event service keeps audit logging away from request handlers.
import SecurityEvent from "../models/SecurityEvent.js";

export async function logSecurityEvent(req, type, metadata = {}, severity = "low") {
  try {
    await SecurityEvent.create({
      type,
      severity,
      user: req.user?._id,
      ip: req.ip,
      userAgent: req.get("user-agent") || "",
      path: req.originalUrl,
      method: req.method,
      metadata,
    });
  } catch {
    // Avoid blocking security-sensitive flows if telemetry storage is unavailable.
  }
}
