// Payment controller handles Razorpay-compatible payment operations.
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { createPaymentOrder, markOrderPayment, verifyPaymentAndCreateOrder } from "../services/paymentService.js";

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const payment = await createPaymentOrder(req.body);
  sendSuccess(res, 200, "Payment order created successfully", { payment });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const order = await verifyPaymentAndCreateOrder(req.user._id, req.body);
  sendSuccess(res, 201, "Payment verified and order created successfully", { order });
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const order = await markOrderPayment(req.params.orderId, req.body);
  sendSuccess(res, 200, "Payment status updated successfully", { order });
});
