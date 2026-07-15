// Admin authentication controller using the existing user/session architecture.
import rateLimit from "express-rate-limit";
import User from "../../models/User.js";
import { logSecurityEvent } from "../../services/securityEventService.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { clearAuthCookies, setAuthCookie, setRefreshCookie } from "../../utils/jwt.js";
import { signRefreshToken, signToken } from "../../utils/jwt.js";

export const adminLoginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: true, legacyHeaders: false, message: { success: false, message: "Too many admin sign-in attempts. Please wait and try again.", errors: [] } });

function safeAdmin(user) {
  return { _id: user._id, name: user.name, email: user.email, role: user.role, adminRole: user.adminRole || "OWNER" };
}

export const adminLogin = asyncHandler(async (req, res) => {
  const generic = "Unable to sign in with those credentials.";
  const user = await User.findOne({ email: req.body.email }).select("+password +refreshToken");
  if (!user || !(await user.comparePassword(req.body.password)) || user.role !== "admin" || user.isDisabled) {
    await logSecurityEvent(req, "failed_admin_login", { email: req.body.email }, "medium");
    throw new ApiError(generic, 401);
  }
  const token = signToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  setAuthCookie(res, token);
  setRefreshCookie(res, refreshToken);
  sendSuccess(res, 200, "Signed in successfully", { user: safeAdmin(user), token, refreshToken });
});

export const adminProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin" || req.user.isDisabled) throw new ApiError("Admin access required.", 403);
  sendSuccess(res, 200, "Admin profile fetched", { user: safeAdmin(req.user) });
});

export const adminLogout = asyncHandler(async (req, res) => {
  if (req.user?._id) await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: "" } });
  clearAuthCookies(res);
  sendSuccess(res, 200, "Signed out successfully");
});
