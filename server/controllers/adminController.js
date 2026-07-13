// Admin controller exposes dashboard and management endpoints.
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { deleteUser, getDashboardStats, listUsers, updateUserRole } from "../services/adminService.js";

export const getStats = asyncHandler(async (_req, res) => {
  const stats = await getDashboardStats();
  sendSuccess(res, 200, "Dashboard stats fetched successfully", { stats });
});

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await listUsers();
  sendSuccess(res, 200, "Users fetched successfully", { users });
});

export const updateRole = asyncHandler(async (req, res) => {
  const user = await updateUserRole(req.params.id, req.body.role);
  sendSuccess(res, 200, "User role updated successfully", { user });
});

export const removeUser = asyncHandler(async (req, res) => {
  const user = await deleteUser(req.params.id);
  sendSuccess(res, 200, "User deleted successfully", { user });
});
