// Request hardening middleware for injection and malformed payload defenses.
import crypto from "crypto";
import { ApiError } from "../utils/ApiError.js";
import { logSecurityEvent } from "../services/securityEventService.js";

function sanitizeValue(value) {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === "object") {
    return Object.entries(value).reduce((safe, [key, child]) => {
      if (key.startsWith("$") || key.includes(".")) return safe;
      safe[key] = sanitizeValue(child);
      return safe;
    }, {});
  }
  if (typeof value === "string") {
    return value
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "");
  }
  return value;
}

export function assignRequestId(req, res, next) {
  req.id = crypto.randomUUID();
  res.setHeader("X-Request-Id", req.id);
  next();
}

export function sanitizeRequest(req, _res, next) {
  req.body = sanitizeValue(req.body);
  req.params = sanitizeValue(req.params);
  req.query = sanitizeValue(req.query);
  next();
}

export function preventParameterPollution(req, _res, next) {
  for (const [key, value] of Object.entries(req.query || {})) {
    if (Array.isArray(value)) return next(new ApiError(`Duplicate query parameter is not allowed: ${key}`, 400));
  }
  next();
}

export function logAdminMutation(req, res, next) {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    res.on("finish", () => {
      if (res.statusCode < 400) logSecurityEvent(req, "admin_action", { statusCode: res.statusCode }, "medium");
    });
  }
  next();
}
