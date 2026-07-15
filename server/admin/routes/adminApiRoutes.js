// Admin API routes with permission enforcement.
import { Router } from "express";
import * as controller from "../controllers/adminController.js";
import { requireAdmin, requireAdminPermission } from "../middleware/adminAuth.js";
import { protect } from "../../middleware/auth.js";

const router = Router();
router.use(protect, requireAdmin);

router.get("/search", requireAdminPermission("dashboard.read"), controller.globalSearch);
router.get("/dashboard", requireAdminPermission("dashboard.read"), controller.dashboard);
router.get("/orders", requireAdminPermission("orders.read"), controller.orders);
router.put("/orders/:id/status", requireAdminPermission("orders.update"), controller.orderStatus);
router.post("/orders/:id/ready-to-ship", requireAdminPermission("orders.ship"), controller.orderReadyToShip);
router.post("/orders/:id/mock-shipment/next", requireAdminPermission("shipping.manage"), controller.mockShippingNext);
router.get("/products", requireAdminPermission("products.read"), controller.products);
router.post("/products", requireAdminPermission("products.create"), controller.saveProduct);
router.put("/products/:id", requireAdminPermission("products.update"), controller.saveProduct);
router.delete("/products/:id", requireAdminPermission("products.archive"), controller.archiveProduct);
router.post("/products/bulk-price/preview", requireAdminPermission("products.update"), controller.bulkPricePreview);
router.post("/products/bulk-price/apply", requireAdminPermission("products.update"), controller.bulkPriceApply);
router.put("/inventory/:id", requireAdminPermission("inventory.update"), controller.inventoryUpdate);
router.get("/categories", requireAdminPermission("categories.read"), controller.categories);
router.post("/categories", requireAdminPermission("categories.manage"), controller.saveCategory);
router.put("/categories/:id", requireAdminPermission("categories.manage"), controller.saveCategory);
router.get("/offers", requireAdminPermission("offers.read"), controller.offers);
router.post("/offers", requireAdminPermission("offers.manage"), controller.createOffer);
router.put("/offers/:id", requireAdminPermission("offers.manage"), controller.updateOffer);
router.get("/coupons", requireAdminPermission("coupons.read"), controller.coupons);
router.post("/coupons", requireAdminPermission("coupons.manage"), controller.createCoupon);
router.put("/coupons/:id", requireAdminPermission("coupons.manage"), controller.updateCoupon);
router.get("/shipping", requireAdminPermission("shipping.read"), controller.shipping);
router.get("/customers", requireAdminPermission("customers.read"), controller.customers);
router.get("/payments", requireAdminPermission("payments.read"), controller.payments);
router.get("/content", requireAdminPermission("content.read"), controller.content);
router.put("/content/:key", requireAdminPermission("content.manage"), controller.saveContent);
router.get("/messages", requireAdminPermission("messages.read"), controller.messages);
router.put("/messages/:id/status", requireAdminPermission("messages.manage"), controller.messageStatus);
router.get("/newsletter", requireAdminPermission("newsletter.read"), controller.newsletter);
router.delete("/newsletter/:id", requireAdminPermission("newsletter.manage"), controller.unsubscribe);
router.get("/reports", requireAdminPermission("reports.read"), controller.reports);
router.get("/users", requireAdminPermission("admins.read"), controller.adminUsers);
router.put("/users/:id", requireAdminPermission("admins.manage"), controller.updateAdmin);
router.get("/audit-logs", requireAdminPermission("audit.read"), controller.auditLogs);
router.get("/settings", requireAdminPermission("settings.read"), controller.settings);
router.put("/settings", requireAdminPermission("settings.manage"), controller.saveSettings);

export default router;

