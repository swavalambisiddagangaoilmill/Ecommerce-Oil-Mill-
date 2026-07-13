// Order controller exposes customer and admin order operations.
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { createOrder, getAllOrders, getMyOrders, getOrderForUser, updateOrderStatus } from "../services/orderService.js";

export const createOrderHandler = asyncHandler(async (req, res) => {
  const order = await createOrder(req.user._id, req.body);
  sendSuccess(res, 201, "Order created successfully", { order });
});

export const getMyOrdersHandler = asyncHandler(async (req, res) => {
  const orders = await getMyOrders(req.user._id);
  sendSuccess(res, 200, "Orders fetched successfully", { orders });
});

export const getOrderHandler = asyncHandler(async (req, res) => {
  const order = await getOrderForUser(req.params.id, req.user);
  sendSuccess(res, 200, "Order fetched successfully", { order });
});

export const getAllOrdersHandler = asyncHandler(async (_req, res) => {
  const orders = await getAllOrders();
  sendSuccess(res, 200, "Orders fetched successfully", { orders });
});

export const updateOrderStatusHandler = asyncHandler(async (req, res) => {
  const order = await updateOrderStatus(req.params.id, req.body);
  sendSuccess(res, 200, "Order status updated successfully", { order });
});
