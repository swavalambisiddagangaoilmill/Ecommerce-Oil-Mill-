// Authentication business logic.
import crypto from "crypto";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { signRefreshToken, signToken, verifyToken } from "../utils/jwt.js";
import { assertAdminSessionCapacity, attachRefreshToken, createAdminSession } from "./adminSessionService.js";
import { createAdminNotification } from "./adminNotificationService.js";

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function issueSession(user, sessionId) {
  const token = signToken(user._id, sessionId);
  const refreshToken = signRefreshToken(user._id, sessionId);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  user.refreshToken = undefined;
  return { user, token, refreshToken };
}

export async function registerUser(payload) {
  const exists = await User.findOne({ email: payload.email });
  if (exists) throw new ApiError("Email is already registered.", 409);
  const user = await User.create({ ...payload, emailVerificationToken: createToken(), emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000 });
  await createAdminNotification({ category: "customers", type: "new_user_registration", title: "New User Registration", description: `${user.name} created an account.`, related: { kind: "User", id: user._id, label: user.email, path: "/admin/customers" } });
  return issueSession(user);
}

export async function loginUser(email, password, req) {
  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user || !(await user.comparePassword(password))) throw new ApiError("Invalid email or password.", 401);
  if (user.isDisabled) throw new ApiError("This account is disabled.", 403);
  if (req && user.role === "admin") await assertAdminSessionCapacity(req, user);
  const adminSession = req && user.role === "admin" ? await createAdminSession(req, user) : null;
  const issued = await issueSession(user, adminSession?.sessionId);
  if (adminSession) await attachRefreshToken(adminSession.sessionId, issued.refreshToken);
  return { ...issued, adminSession };
}

export async function refreshUserSession(refreshToken) {
  if (!refreshToken) throw new ApiError("Refresh token is required.", 401);
  const decoded = verifyToken(refreshToken);
  if (decoded.type !== "refresh") throw new ApiError("Invalid refresh token.", 401);
  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== refreshToken) throw new ApiError("Invalid refresh token.", 401);
  if (user.isDisabled) throw new ApiError("This account is disabled.", 403);
  return issueSession(user, decoded.sessionId);
}

export async function logoutUser(userId) {
  if (userId) await User.findByIdAndUpdate(userId, { $unset: { refreshToken: "" } });
}

export async function updateUserProfile(userId, payload) {
  const allowed = ["name", "phone"];
  const updates = Object.fromEntries(Object.entries(payload).filter(([key]) => allowed.includes(key)));
  return User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
}

export async function changeUserPassword(user, currentPassword, nextPassword) {
  const account = await User.findById(user._id).select("+password +refreshToken");
  if (!(await account.comparePassword(currentPassword))) throw new ApiError("Current password is incorrect.", 400);
  account.password = nextPassword;
  account.refreshToken = undefined;
  await account.save();
  if (user.role === "admin") await createAdminNotification({ category: "security", type: "password_changed", title: "Admin Password Changed", description: `${user.email} changed their password.`, related: { kind: "User", id: user._id, label: user.email, path: "/admin/settings" } });
  return true;
}

export async function requestPasswordReset(email) {
  const user = await User.findOne({ email }).select("+passwordResetToken +passwordResetExpires");
  if (!user) return null;
  const resetToken = createToken();
  user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });
  return resetToken;
}

export async function resetPassword(resetToken, password) {
  const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");
  const user = await User.findOne({ passwordResetToken: hashed, passwordResetExpires: { $gt: Date.now() } }).select("+passwordResetToken +passwordResetExpires");
  if (!user) throw new ApiError("Reset token is invalid or expired.", 400);
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return issueSession(user);
}

export async function verifyEmail(token) {
  const user = await User.findOne({ emailVerificationToken: token, emailVerificationExpires: { $gt: Date.now() } }).select("+emailVerificationToken +emailVerificationExpires");
  if (!user) throw new ApiError("Verification token is invalid or expired.", 400);
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });
  return user;
}

export async function addAddress(userId, address) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError("User not found.", 404);
  if (address.isDefault) user.addresses.forEach((item) => { item.isDefault = false; });
  user.addresses.push(address);
  await user.save();
  return user.addresses;
}

export async function updateAddress(userId, addressId, address) {
  const user = await User.findById(userId);
  const existing = user?.addresses.id(addressId);
  if (!existing) throw new ApiError("Address not found.", 404);
  if (address.isDefault) user.addresses.forEach((item) => { item.isDefault = item._id.toString() === addressId; });
  existing.set(address);
  await user.save();
  return user.addresses;
}

export async function deleteAddress(userId, addressId) {
  const user = await User.findById(userId);
  const existing = user?.addresses.id(addressId);
  if (!existing) throw new ApiError("Address not found.", 404);
  existing.deleteOne();
  await user.save();
  return user.addresses;
}
