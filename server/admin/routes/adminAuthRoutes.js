// Dedicated admin authentication routes.
import { Router } from "express";
import { body } from "express-validator";
import { adminLogin, adminLoginLimiter, adminLogout, adminProfile } from "../controllers/adminAuthController.js";
import { protect } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";

const router = Router();

router.post("/login", adminLoginLimiter, [body("email").isEmail().normalizeEmail(), body("password").isString().notEmpty()], validate, adminLogin);
router.get("/profile", protect, adminProfile);
router.post("/logout", protect, adminLogout);

export default router;
