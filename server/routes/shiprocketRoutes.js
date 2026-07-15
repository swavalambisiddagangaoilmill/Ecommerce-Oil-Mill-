// Shiprocket webhook route registration.
import { Router } from "express";
import { shiprocketWebhookHandler } from "../controllers/orderController.js";

const router = Router();

router.post("/webhook", shiprocketWebhookHandler);

export default router;
