// Admin dashboard business logic.
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export async function getDashboardStats() {
  const [users, products, categories, orders, revenue] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Category.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $match: { paymentStatus: { $in: ["paid", "pending"] } } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
  ]);
  return { users, products, categories, orders, revenue: revenue[0]?.total || 0 };
}

export function listUsers() {
  return User.find().sort({ createdAt: -1 });
}

export async function updateUserRole(userId, role) {
  const user = await User.findByIdAndUpdate(userId, { role }, { new: true, runValidators: true });
  if (!user) throw new ApiError("User not found.", 404);
  return user;
}

export async function deleteUser(userId) {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new ApiError("User not found.", 404);
  return user;
}
