// Content route registration.
import { Router } from "express";
import { getFaqs, getPageContent } from "../controllers/contentController.js";

const router = Router();

router.get("/faqs", getFaqs);
router.get("/pages/:slug", getPageContent);

export default router;
