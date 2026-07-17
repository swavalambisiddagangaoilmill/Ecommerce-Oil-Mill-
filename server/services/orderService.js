// Order business logic.
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { createAdminNotification, createInventoryNotifications } from "./adminNotificationService.js";

export async function createOrder(userId, payload) {
  const productIds = payload.products.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const orderItems = payload.products.map((item) => {
    const product = productMap.get(item.product.toString());
    if (!product) throw new ApiError("One or more products are unavailable.", 400);
    if (product.stock < item.quantity) throw new ApiError(`${product.title} does not have enough stock.`, 400);
    const price = product.discountPrice || product.price;
    return { product: product._id, title: product.title, image: product.images?.[0]?.url, quantity: item.quantity, price };
  });

  const stockUpdates = await Promise.all(
    orderItems.map((item) =>
      Product.updateOne({ _id: item.product, stock: { $gte: item.quantity }, isActive: true }, { $inc: { stock: -item.quantity } })
    )
  );
  if (stockUpdates.some((result) => result.modifiedCount !== 1)) {
    throw new ApiError("One or more products do not have enough stock.", 400);
  }

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = await Order.create({ user: userId, products: orderItems, shippingAddress: payload.shippingAddress, paymentMethod: payload.paymentMethod || "cod", totalAmount });
  await createAdminNotification({ category: "orders", type: "new_order", title: "New Order", description: `Order ${order._id} was placed for Rs. ${totalAmount}.`, related: { kind: "Order", id: order._id, label: `Order ${order._id}`, path: "/admin/orders" } });
  await Promise.all(productIds.map((id) => Product.findById(id).then((product) => product && createInventoryNotifications(product))));
  return order;
}

export function getMyOrders(userId) {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
}

export async function getOrderForUser(orderId, user) {
  const order = await Order.findById(orderId).populate("user", "name email");
  if (!order) throw new ApiError("Order not found.", 404);
  if (user.role !== "admin" && order.user._id.toString() !== user._id.toString()) {
    throw new ApiError("You cannot access this order.", 403);
  }
  return order;
}

export function getAllOrders() {
  return Order.find().populate("user", "name email").sort({ createdAt: -1 });
}

export async function updateOrderStatus(orderId, payload) {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError("Order not found.", 404);
  order.set(payload);
  await order.save();
  if (payload.orderStatus === "cancelled") await createAdminNotification({ category: "orders", type: "order_cancelled", title: "Order Cancelled", description: `Order ${order._id} was cancelled.`, related: { kind: "Order", id: order._id, label: `Order ${order._id}`, path: "/admin/orders" } });
  if (payload.orderStatus === "delivered") await createAdminNotification({ category: "orders", type: "order_delivered", title: "Order Delivered", description: `Order ${order._id} was delivered.`, related: { kind: "Order", id: order._id, label: `Order ${order._id}`, path: "/admin/orders" } });
  return order;
}
