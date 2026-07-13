// Wishlist route registration.
import { Router } from "express";
import { addWishlistHandler, getWishlistHandler, removeWishlistHandler } from "../controllers/wishlistController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { wishlistBodyValidator, wishlistParamValidator } from "../validators/wishlistValidators.js";

const router = Router();

router.get("/", protect, getWishlistHandler);
router.post("/", protect, wishlistBodyValidator, validate, addWishlistHandler);
router.delete("/:productId", protect, wishlistParamValidator, validate, removeWishlistHandler);

export default router;
