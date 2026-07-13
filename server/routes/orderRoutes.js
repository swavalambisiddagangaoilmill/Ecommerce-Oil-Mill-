// Order route registration.
import { Router } from "express";
import { createOrderHandler, getAllOrdersHandler, getMyOrdersHandler, getOrderHandler, updateOrderStatusHandler } from "../controllers/orderController.js";
import { adminOnly } from "../middleware/admin.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createOrderValidator, orderIdValidator, updateOrderStatusValidator } from "../validators/orderValidators.js";

const router = Router();

router.post("/", protect, createOrderValidator, validate, createOrderHandler);
router.get("/my", protect, getMyOrdersHandler);
router.get("/", protect, adminOnly, getAllOrdersHandler);
router.get("/:id", protect, orderIdValidator, validate, getOrderHandler);
router.put("/:id/status", protect, adminOnly, orderIdValidator, updateOrderStatusValidator, validate, updateOrderStatusHandler);

export default router;
