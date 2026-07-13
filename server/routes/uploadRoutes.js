// Upload route registration.
import { Router } from "express";
import { deleteSingleImage, uploadSingleImage } from "../controllers/uploadController.js";
import { adminOnly } from "../middleware/admin.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/image", protect, adminOnly, upload.single("image"), uploadSingleImage);
router.delete("/image", protect, adminOnly, deleteSingleImage);

export default router;
