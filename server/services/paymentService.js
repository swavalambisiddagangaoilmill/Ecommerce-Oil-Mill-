// Payment business logic for Razorpay-compatible flows.
import crypto from "crypto";
import { env } from "../config/env.js";
import Order from "../models/Order.js";
import { createOrder as createStoreOrder } from "./orderService.js";
import { ApiError } from "../utils/ApiError.js";

export async function createPaymentOrder(payload) {
  const amount = Math.round(Number(payload.amount) * 100);
  if (!amount || amount < 100) throw new ApiError("Valid amount is required.", 400);
  if (!env.razorpay.keyId || !env.razorpay.keySecret) {
    return { id: `order_local_${Date.now()}`, amount, currency: "INR", provider: "local", key: env.razorpay.keyId };
  }
  const auth = Buffer.from(`${env.razorpay.keyId}:${env.razorpay.keySecret}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency: "INR", receipt: payload.receipt || `receipt_${Date.now()}` }),
  });
  if (!response.ok) throw new ApiError("Unable to create Razorpay order.", 502);
  const data = await response.json();
  return { ...data, key: env.razorpay.keyId };
}

export async function verifyPaymentAndCreateOrder(userId, payload) {
  if (payload.razorpayOrderId && payload.razorpayPaymentId && payload.razorpaySignature && env.razorpay.keySecret) {
    const expected = crypto.createHmac("sha256", env.razorpay.keySecret).update(`${payload.razorpayOrderId}|${payload.razorpayPaymentId}`).digest("hex");
    if (expected !== payload.razorpaySignature) throw new ApiError("Payment verification failed.", 400);
  }
  const order = await createStoreOrder(userId, { ...payload.order, paymentMethod: "razorpay" });
  order.paymentStatus = "paid";
  order.razorpayOrderId = payload.razorpayOrderId;
  order.razorpayPaymentId = payload.razorpayPaymentId;
  order.razorpaySignature = payload.razorpaySignature;
  await order.save();
  return order;
}

export async function markOrderPayment(orderId, payload) {
  const order = await Order.findByIdAndUpdate(orderId, payload, { new: true, runValidators: true });
  if (!order) throw new ApiError("Order not found.", 404);
  return order;
}
