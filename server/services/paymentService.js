// Payment business logic for Razorpay-compatible flows.
import crypto from "crypto";
import { env } from "../config/env.js";
import Order from "../models/Order.js";
import PaymentCheckout from "../models/PaymentCheckout.js";
import Product from "../models/Product.js";
import { createOrder as createStoreOrder } from "./orderService.js";
import { ApiError } from "../utils/ApiError.js";

async function calculateOrderAmount(productsPayload = []) {
  const productIds = productsPayload.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  return productsPayload.reduce((total, item) => {
    const product = productMap.get(item.product.toString());
    if (!product) throw new ApiError("One or more products are unavailable.", 400);
    if (product.stock < item.quantity) throw new ApiError(`${product.title} does not have enough stock.`, 400);
    return total + (product.discountPrice || product.price) * item.quantity;
  }, 0);
}

export async function createPaymentOrder(payload) {
  const amountSource = payload.order?.products || payload.products;
  const calculatedAmount = amountSource?.length ? await calculateOrderAmount(amountSource) : 0;
  const amount = Math.round(calculatedAmount * 100);
  if (!amount || amount < 100) throw new ApiError("Valid order products are required.", 400);
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
  if (payload.razorpayPaymentId) {
    const existing = await Order.findOne({ razorpayPaymentId: payload.razorpayPaymentId });
    if (existing) throw new ApiError("Payment has already been processed.", 409);
  }
  if (env.isProduction && (!payload.razorpayOrderId || !payload.razorpayPaymentId || !payload.razorpaySignature)) {
    throw new ApiError("Complete payment verification data is required.", 400);
  }
  if (payload.razorpayOrderId && payload.razorpayPaymentId && payload.razorpaySignature && env.razorpay.keySecret) {
    const expected = crypto.createHmac("sha256", env.razorpay.keySecret).update(`${payload.razorpayOrderId}|${payload.razorpayPaymentId}`).digest("hex");
    const received = Buffer.from(payload.razorpaySignature);
    const expectedBuffer = Buffer.from(expected);
    if (received.length !== expectedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, received)) throw new ApiError("Payment verification failed.", 400);
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

function razorpayAuthHeader() {
  return `Basic ${Buffer.from(`${env.razorpay.keyId}:${env.razorpay.keySecret}`).toString("base64")}`;
}

function normalizeRazorpayError(payload, status) {
  const message = payload?.error?.description || payload?.error?.reason || payload?.error?.code || payload?.message || "Unable to create Razorpay UPI QR.";
  if (status === 404 || /requested url was not found/i.test(message)) {
    return `Razorpay UPI QR is not available for this account or key mode. Razorpay returned: ${message}. Please enable the QR Codes / upi_qr feature for this Razorpay account. Standard Checkout remains available.`;
  }
  return message;
}

export async function createUpiQrCheckout(userId, payload) {
  if (!env.razorpay.keyId || !env.razorpay.keySecret) throw new ApiError("Razorpay credentials are not configured for UPI QR.", 400);
  const amount = Math.round(await calculateOrderAmount(payload.order?.products || []) * 100);
  if (!amount || amount < 100) throw new ApiError("Valid order products are required.", 400);
  const closeBy = Math.ceil((Date.now() + 15 * 60 * 1000) / 1000);
  const response = await fetch("https://api.razorpay.com/v1/payments/qr_codes", {
    method: "POST",
    headers: { Authorization: razorpayAuthHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "upi_qr",
      name: `Velora checkout ${Date.now()}`,
      usage: "single_use",
      fixed_amount: true,
      payment_amount: amount,
      description: "Velora UPI QR checkout",
      close_by: closeBy,
      notes: { userId: String(userId) },
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(normalizeRazorpayError(data, response.status), response.status === 404 ? 400 : response.status === 400 ? 400 : 502);
  const checkout = await PaymentCheckout.create({
    user: userId,
    type: "upi_qr",
    amount,
    currency: data.currency || "INR",
    razorpayQrId: data.id,
    imageUrl: data.image_url,
    orderPayload: payload.order,
    expiresAt: new Date(closeBy * 1000),
  });
  return { id: checkout._id, qrId: checkout.razorpayQrId, imageUrl: checkout.imageUrl, amount: checkout.amount, currency: checkout.currency, expiresAt: checkout.expiresAt };
}

async function fetchQrPayments(qrId) {
  const response = await fetch(`https://api.razorpay.com/v1/payments/qr_codes/${qrId}/payments`, { headers: { Authorization: razorpayAuthHeader() } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(normalizeRazorpayError(data, response.status) || "Unable to verify QR payment.", response.status === 404 ? 400 : response.status === 400 ? 400 : 502);
  return data.items || [];
}

export async function verifyUpiQrCheckout(userId, checkoutId) {
  const checkout = await PaymentCheckout.findOne({ _id: checkoutId, user: userId });
  if (!checkout) throw new ApiError("QR checkout not found.", 404);
  if (checkout.status === "paid") {
    const order = await Order.findById(checkout.order);
    return { status: "paid", order, checkout };
  }
  if (checkout.expiresAt <= new Date()) {
    checkout.status = "expired";
    await checkout.save();
    return { status: "expired", checkout };
  }
  const payments = await fetchQrPayments(checkout.razorpayQrId);
  const captured = payments.find((payment) => payment.status === "captured" && Number(payment.amount) === checkout.amount);
  if (!captured) return { status: "created", checkout };
  const existing = await PaymentCheckout.findOne({ razorpayPaymentId: captured.id, status: "paid" });
  if (existing?.order) {
    checkout.status = "paid";
    checkout.razorpayPaymentId = captured.id;
    checkout.order = existing.order;
    await checkout.save();
    const order = await Order.findById(existing.order);
    return { status: "paid", order, checkout };
  }
  const order = await createStoreOrder(userId, { ...checkout.orderPayload, paymentMethod: "razorpay" });
  order.paymentStatus = "paid";
  order.razorpayPaymentId = captured.id;
  await order.save();
  checkout.status = "paid";
  checkout.razorpayPaymentId = captured.id;
  checkout.order = order._id;
  await checkout.save();
  return { status: "paid", order, checkout };
}


