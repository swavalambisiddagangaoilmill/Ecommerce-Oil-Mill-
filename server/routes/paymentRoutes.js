// Payment route registration.
import { Router } from "express";
import { checkUpiQrPayment, createPaymentIntent, createUpiQrPayment, updatePaymentStatus, verifyPayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { paymentIntentValidator, paymentStatusValidator, paymentVerifyValidator, qrCheckoutIdValidator, upiQrValidator } from "../validators/paymentValidators.js";

const router = Router();

router.post("/intent", protect, paymentIntentValidator, validate, createPaymentIntent);
router.post("/verify", protect, paymentVerifyValidator, validate, verifyPayment);
router.post("/upi-qr", protect, upiQrValidator, validate, createUpiQrPayment);
router.get("/upi-qr/:checkoutId", protect, qrCheckoutIdValidator, validate, checkUpiQrPayment);
router.put("/orders/:orderId/status", protect, paymentStatusValidator, validate, updatePaymentStatus);

export default router;

