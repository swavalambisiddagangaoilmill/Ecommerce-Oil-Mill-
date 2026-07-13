// Admin route registration.
import { Router } from "express";
import { getStats, getUsers, removeUser, updateRole } from "../controllers/adminController.js";
import { getAllOrdersHandler, updateOrderStatusHandler } from "../controllers/orderController.js";
import { createCategoryHandler, deleteCategoryHandler, updateCategoryHandler } from "../controllers/categoryController.js";
import { createProductHandler, deleteProductHandler, updateProductHandler } from "../controllers/productController.js";
import { adminOnly } from "../middleware/admin.js";
import { protect } from "../middleware/auth.js";
import { logAdminMutation } from "../middleware/security.js";
import { validate } from "../middleware/validate.js";
import { userIdValidator, roleValidator } from "../validators/adminValidators.js";
import { orderIdValidator, updateOrderStatusValidator } from "../validators/orderValidators.js";
import { categoryIdValidator, categoryValidator } from "../validators/categoryValidators.js";
import { productIdValidator, productUpdateValidator, productValidator } from "../validators/productValidators.js";

const router = Router();
router.use(protect, adminOnly);
router.use(logAdminMutation);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.put("/users/:id/role", userIdValidator, roleValidator, validate, updateRole);
router.delete("/users/:id", userIdValidator, validate, removeUser);
router.get("/orders", getAllOrdersHandler);
router.put("/orders/:id/status", orderIdValidator, updateOrderStatusValidator, validate, updateOrderStatusHandler);
router.post("/products", productValidator, validate, createProductHandler);
router.put("/products/:id", productIdValidator, productUpdateValidator, validate, updateProductHandler);
router.delete("/products/:id", productIdValidator, validate, deleteProductHandler);
router.post("/categories", categoryValidator, validate, createCategoryHandler);
router.put("/categories/:id", categoryIdValidator, categoryValidator, validate, updateCategoryHandler);
router.delete("/categories/:id", categoryIdValidator, validate, deleteCategoryHandler);

export default router;
