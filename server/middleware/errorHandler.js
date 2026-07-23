// Centralized error response middleware.
import { sendError } from "../utils/apiResponse.js";

export function errorHandler(error, req, res, next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Server error";
  let errors = error.errors || [];

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier.";
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = "Duplicate resource value.";
    errors = Object.keys(error.keyValue || {}).map((field) => ({ field, message: `${field} already exists.` }));
  }

  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token.";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token expired.";
  }

  // DEBUG: Remove after Google OAuth issue is resolved
  console.error("[Express Error Debug]", { name: error.name, message: error.message, stack: error.stack, statusCode, route: req.originalUrl });
  if (error.isOperational) {
    // DEBUG: Remove after Google OAuth issue is resolved
    console.error("[Express Error Debug] ApiError", { status: statusCode, message, errors });
  }

  if (req.originalUrl === "/api/auth/google") {
    return res.status(statusCode).json({
      success: false,
      stage: error.debugStage || "controller",
      error: message,
      details: error.debugDetails || message,
      errors,
    });
  }

  if (statusCode >= 500 && !error.isOperational) {
    message = "Service is temporarily unavailable. Please try again shortly.";
    errors = [];
  }

  if (process.env.NODE_ENV !== "production" && statusCode >= 500) {
    console.error(error);
  }

  return sendError(res, statusCode, message, errors);
}

