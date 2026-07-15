// Authenticates requests using bearer token or auth cookie.
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/jwt.js";

export const protect = asyncHandler(async (req, res, next) => {
  const bearer = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null;
  const token = bearer || req.cookies?.token;
  if (!token) throw new ApiError("Authentication required.", 401);
  if (!bearer && ["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const csrfHeader = req.get("x-csrf-token");
    if (!csrfHeader || csrfHeader !== req.cookies?.csrfToken) throw new ApiError("CSRF validation failed.", 403);
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError("User no longer exists.", 401);
  if (user.isDisabled) throw new ApiError("This account is disabled.", 403);

  req.user = user;
  next();
});

export const optionalProtect = asyncHandler(async (req, _res, next) => {
  const bearer = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null;
  const token = bearer || req.cookies?.token;
  if (!token) return next();
  try {
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.id);
  } catch {
    req.user = null;
  }
  next();
});

