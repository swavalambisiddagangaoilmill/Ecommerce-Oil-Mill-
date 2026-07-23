// Coupon validation shared by storefront checkout and order creation.
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";

export function normalizeCouponCode(code = "") {
  return String(code || "").trim().toUpperCase();
}

function itemProductId(item) {
  return item.product?._id?.toString?.() || item.product?.toString?.() || item._id?.toString?.() || item.id?.toString?.();
}

function itemCategoryId(item) {
  const product = item.product?._id ? item.product : item;
  return product.category?._id?.toString?.() || product.category?.toString?.();
}

function lineTotal(item) {
  return Number(item.price || 0) * Number(item.quantity || 1);
}

export async function validateCouponForItems({ code, userId, items = [], subtotal }) {
  const couponCode = normalizeCouponCode(code);
  if (!couponCode) return { coupon: null, discountAmount: 0 };

  const coupon = await Coupon.findOne({ code: couponCode });
  const now = new Date();
  if (!coupon || !coupon.isActive || coupon.startDate > now || coupon.expiryDate < now) throw new ApiError("Coupon is invalid or expired.", 400);
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) throw new ApiError("Coupon usage limit has been reached.", 400);

  const orderSubtotal = Number(subtotal ?? items.reduce((sum, item) => sum + lineTotal(item), 0));
  if (orderSubtotal < coupon.minimumOrderAmount) throw new ApiError(`Minimum order for this coupon is Rs. ${coupon.minimumOrderAmount}.`, 400);

  if (coupon.firstOrderOnly && userId) {
    const existingOrders = await Order.countDocuments({ user: userId });
    if (existingOrders > 0) throw new ApiError("This coupon is valid only on the first order.", 400);
  }

  const productIds = new Set((coupon.products || []).map((id) => id.toString()));
  const categoryIds = new Set((coupon.categories || []).map((id) => id.toString()));
  const eligibleItems = items.filter((item) => {
    if (coupon.scope === "PRODUCTS") return productIds.has(itemProductId(item));
    if (coupon.scope === "CATEGORY") return categoryIds.has(itemCategoryId(item));
    return true;
  });
  if (!eligibleItems.length) throw new ApiError("Coupon does not apply to the selected products.", 400);

  const discountBase = eligibleItems.reduce((sum, item) => sum + lineTotal(item), 0);
  const rawDiscount = coupon.discountType === "PERCENTAGE" ? Math.round(discountBase * (coupon.discountValue / 100)) : coupon.discountValue;
  const cappedDiscount = coupon.maximumDiscountAmount > 0 ? Math.min(rawDiscount, coupon.maximumDiscountAmount) : rawDiscount;
  return { coupon, discountAmount: Math.max(0, Math.min(orderSubtotal, Math.round(cappedDiscount))) };
}

export async function validateCouponPayload({ code, userId, products = [] }) {
  const requested = products.map((item) => ({ product: item.product || item.id || item._id, quantity: Math.max(1, Number(item.quantity) || 1) })).filter((item) => item.product);
  if (!requested.length) throw new ApiError("Add products before applying a coupon.", 400);
  const productDocs = await Product.find({ _id: { $in: requested.map((item) => item.product) }, isActive: true });
  const productMap = new Map(productDocs.map((product) => [product._id.toString(), product]));
  const items = requested.map((item) => {
    const product = productMap.get(item.product.toString());
    if (!product) throw new ApiError("One or more products are unavailable.", 400);
    return { product, quantity: item.quantity, price: product.discountPrice || product.price };
  });
  const result = await validateCouponForItems({ code, userId, items });
  return { code: result.coupon.code, discountAmount: result.discountAmount, description: result.coupon.description || "Coupon applied successfully." };
}
