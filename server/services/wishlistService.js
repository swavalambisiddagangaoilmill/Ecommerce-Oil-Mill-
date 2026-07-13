// Wishlist business logic.
import Product from "../models/Product.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export async function getWishlist(userId) {
  const user = await User.findById(userId).populate("wishlist");
  if (!user) throw new ApiError("User not found.", 404);
  return user.wishlist;
}

export async function addToWishlist(userId, productId) {
  const exists = await Product.exists({ _id: productId, isActive: true });
  if (!exists) throw new ApiError("Product not found.", 404);
  const user = await User.findByIdAndUpdate(userId, { $addToSet: { wishlist: productId } }, { new: true }).populate("wishlist");
  if (!user) throw new ApiError("User not found.", 404);
  return user.wishlist;
}

export async function removeFromWishlist(userId, productId) {
  const user = await User.findByIdAndUpdate(userId, { $pull: { wishlist: productId } }, { new: true }).populate("wishlist");
  if (!user) throw new ApiError("User not found.", 404);
  return user.wishlist;
}
