// Cart business logic stored on the authenticated user.
import User from "../models/User.js";
import Product from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";

async function populatedCart(userId) {
  const user = await User.findById(userId).populate("cart.product");
  if (!user) throw new ApiError("User not found.", 404);
  return user.cart.filter((item) => item.product).map((item) => ({ product: item.product, quantity: item.quantity }));
}

export async function getCart(userId) {
  return populatedCart(userId);
}

export async function syncCart(userId, items = []) {
  const productIds = items.map((item) => item.productId || item.product || item.id);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });
  const valid = new Set(products.map((product) => product._id.toString()));
  const cart = items
    .map((item) => ({ product: item.productId || item.product || item.id, quantity: Math.max(1, Number(item.quantity) || 1) }))
    .filter((item) => valid.has(item.product.toString()));
  await User.findByIdAndUpdate(userId, { cart }, { new: true, runValidators: true });
  return populatedCart(userId);
}

export async function addCartItem(userId, productId, quantity = 1) {
  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) throw new ApiError("Product not found.", 404);
  const user = await User.findById(userId);
  if (!user) throw new ApiError("User not found.", 404);
  const existing = user.cart.find((item) => item.product.toString() === productId.toString());
  if (existing) existing.quantity += Math.max(1, Number(quantity) || 1);
  else user.cart.push({ product: productId, quantity: Math.max(1, Number(quantity) || 1) });
  await user.save();
  return populatedCart(userId);
}

export async function updateCartItem(userId, productId, quantity) {
  const user = await User.findById(userId);
  const existing = user?.cart.find((item) => item.product.toString() === productId.toString());
  if (!existing) throw new ApiError("Cart item not found.", 404);
  existing.quantity = Math.max(1, Number(quantity) || 1);
  await user.save();
  return populatedCart(userId);
}

export async function removeCartItem(userId, productId) {
  await User.findByIdAndUpdate(userId, { $pull: { cart: { product: productId } } });
  return populatedCart(userId);
}

export async function clearCart(userId) {
  await User.findByIdAndUpdate(userId, { cart: [] });
  return [];
}
