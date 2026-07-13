// Auth route registration.
import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  addAddressHandler,
  changePassword,
  deleteAddressHandler,
  forgotPassword,
  getProfile,
  login,
  logout,
  refresh,
  register,
  resetPasswordHandler,
  updateAddressHandler,
  updateProfile,
  verifyEmailHandler,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  addressIdValidator,
  addressValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  updateProfileValidator,
  verifyEmailValidator,
} from "../validators/authValidators.js";

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false, message: { success: false, message: "Too many authentication attempts.", errors: [] } });

router.post("/register", authLimiter, registerValidator, validate, register);
router.post("/login", authLimiter, loginValidator, validate, login);
router.post("/refresh", authLimiter, refresh);
router.post("/logout", protect, logout);
router.post("/forgot-password", forgotPasswordValidator, validate, forgotPassword);
router.post("/reset-password/:token", resetPasswordValidator, validate, resetPasswordHandler);
router.get("/verify-email/:token", verifyEmailValidator, validate, verifyEmailHandler);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfileValidator, validate, updateProfile);
router.put("/change-password", protect, changePasswordValidator, validate, changePassword);
router.post("/addresses", protect, addressValidator, validate, addAddressHandler);
router.put("/addresses/:addressId", protect, addressIdValidator, addressValidator, validate, updateAddressHandler);
router.delete("/addresses/:addressId", protect, addressIdValidator, validate, deleteAddressHandler);

export default router;
