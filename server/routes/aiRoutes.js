// AI assistant route registration.
import { Router } from "express";
import { body } from "express-validator";
import { chatAssistant } from "../controllers/aiController.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post("/chat", [body("message").trim().notEmpty().withMessage("Message is required.")], validate, chatAssistant);

export default router;
