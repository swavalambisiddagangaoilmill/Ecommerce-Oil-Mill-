// Validation chains for payment routes.
import { body, param } from "express-validator";

export const paymentIntentValidator = [
  body("products").optional().isArray({ min: 1 }).withMessage("At least one product is required."),
  body("products.*.product").optional().isMongoId().withMessage("Valid product id is required."),
  body("products.*.quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1."),
  body("order.products").optional().isArray({ min: 1 }).withMessage("At least one product is required."),
  body("order.products.*.product").optional().isMongoId().withMessage("Valid product id is required."),
  body("order.products.*.quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1."),
  body("receipt").optional().trim(),
];

export const paymentVerifyValidator = [
  body("order.products").isArray({ min: 1 }).withMessage("At least one product is required."),
  body("order.products.*.product").isMongoId().withMessage("Valid product id is required."),
  body("order.products.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1."),
  body("order.shippingAddress.fullName").trim().notEmpty().withMessage("Full name is required."),
  body("order.shippingAddress.phone").trim().notEmpty().withMessage("Phone is required."),
  body("order.shippingAddress.street").trim().notEmpty().withMessage("Street is required."),
  body("order.shippingAddress.city").trim().notEmpty().withMessage("City is required."),
  body("order.shippingAddress.state").trim().notEmpty().withMessage("State is required."),
  body("order.shippingAddress.postalCode").trim().notEmpty().withMessage("Postal code is required."),
  body("razorpayOrderId").optional().trim(),
  body("razorpayPaymentId").optional().trim(),
  body("razorpaySignature").optional().trim(),
];

export const paymentStatusValidator = [
  param("orderId").isMongoId().withMessage("Valid order id is required."),
  body("paymentStatus").optional().isIn(["pending", "paid", "failed", "refunded"]).withMessage("Invalid payment status."),
  body("razorpayPaymentId").optional().trim(),
];

export const upiQrValidator = [
  body("order.products").isArray({ min: 1 }).withMessage("At least one product is required."),
  body("order.products.*.product").isMongoId().withMessage("Valid product id is required."),
  body("order.products.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1."),
  body("order.shippingAddress.fullName").trim().notEmpty().withMessage("Full name is required."),
  body("order.shippingAddress.phone").trim().notEmpty().withMessage("Phone is required."),
  body("order.shippingAddress.street").trim().notEmpty().withMessage("Street is required."),
  body("order.shippingAddress.city").trim().notEmpty().withMessage("City is required."),
  body("order.shippingAddress.state").trim().notEmpty().withMessage("State is required."),
  body("order.shippingAddress.postalCode").trim().notEmpty().withMessage("Postal code is required."),
];

export const qrCheckoutIdValidator = [param("checkoutId").isMongoId().withMessage("Valid QR checkout id is required.")];
