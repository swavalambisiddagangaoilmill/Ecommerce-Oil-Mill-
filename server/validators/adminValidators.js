// Validation chains for admin routes.
import { body, param } from "express-validator";

export const userIdValidator = [param("id").isMongoId().withMessage("Valid user id is required.")];
export const roleValidator = [body("role").isIn(["user", "admin"]).withMessage("Role must be user or admin.")];
