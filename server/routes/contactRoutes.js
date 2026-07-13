// Contact and newsletter route registration.
import { Router } from "express";
import { body } from "express-validator";
import { submitContact, subscribeNewsletter } from "../controllers/contactController.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post("/contact", [body("name").trim().notEmpty(), body("email").isEmail(), body("message").trim().notEmpty()], validate, submitContact);
router.post("/newsletter", [body("email").isEmail().normalizeEmail()], validate, subscribeNewsletter);

export default router;
