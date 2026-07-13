// Auth controller exposes account and session endpoints.
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { clearAuthCookies, setAuthCookie, setRefreshCookie } from "../utils/jwt.js";
import { logSecurityEvent } from "../services/securityEventService.js";
import {
  addAddress,
  changeUserPassword,
  deleteAddress,
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
  requestPasswordReset,
  resetPassword,
  updateAddress,
  updateUserProfile,
  verifyEmail,
} from "../services/authService.js";

function setSession(res, token, refreshToken) {
  setAuthCookie(res, token);
  setRefreshCookie(res, refreshToken);
}

export const register = asyncHandler(async (req, res) => {
  const { user, token, refreshToken } = await registerUser(req.body);
  setSession(res, token, refreshToken);
  sendSuccess(res, 201, "Registered successfully", { user, token, refreshToken });
});

export const login = asyncHandler(async (req, res) => {
  try {
    const { user, token, refreshToken } = await loginUser(req.body.email, req.body.password);
    setSession(res, token, refreshToken);
    sendSuccess(res, 200, "Logged in successfully", { user, token, refreshToken });
  } catch (error) {
    await logSecurityEvent(req, "failed_login", { email: req.body.email }, "medium");
    throw error;
  }
});

export const refresh = asyncHandler(async (req, res) => {
  const { user, token, refreshToken } = await refreshUserSession(req.cookies?.refreshToken || req.body.refreshToken);
  setSession(res, token, refreshToken);
  sendSuccess(res, 200, "Session refreshed successfully", { user, token, refreshToken });
});

export const logout = asyncHandler(async (req, res) => {
  await logoutUser(req.user?._id);
  clearAuthCookies(res);
  sendSuccess(res, 200, "Logged out successfully");
});

export const getProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Profile fetched successfully", { user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await updateUserProfile(req.user._id, req.body);
  sendSuccess(res, 200, "Profile updated successfully", { user });
});

export const changePassword = asyncHandler(async (req, res) => {
  await changeUserPassword(req.user, req.body.currentPassword, req.body.password);
  sendSuccess(res, 200, "Password changed successfully");
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const resetToken = await requestPasswordReset(req.body.email);
  sendSuccess(res, 200, "Password reset request accepted", { resetToken: process.env.NODE_ENV === "production" ? undefined : resetToken });
});

export const resetPasswordHandler = asyncHandler(async (req, res) => {
  const { user, token, refreshToken } = await resetPassword(req.params.token, req.body.password);
  setSession(res, token, refreshToken);
  sendSuccess(res, 200, "Password reset successfully", { user, token, refreshToken });
});

export const verifyEmailHandler = asyncHandler(async (req, res) => {
  const user = await verifyEmail(req.params.token);
  sendSuccess(res, 200, "Email verified successfully", { user });
});

export const addAddressHandler = asyncHandler(async (req, res) => {
  const addresses = await addAddress(req.user._id, req.body);
  sendSuccess(res, 201, "Address added successfully", { addresses });
});

export const updateAddressHandler = asyncHandler(async (req, res) => {
  const addresses = await updateAddress(req.user._id, req.params.addressId, req.body);
  sendSuccess(res, 200, "Address updated successfully", { addresses });
});

export const deleteAddressHandler = asyncHandler(async (req, res) => {
  const addresses = await deleteAddress(req.user._id, req.params.addressId);
  sendSuccess(res, 200, "Address deleted successfully", { addresses });
});
