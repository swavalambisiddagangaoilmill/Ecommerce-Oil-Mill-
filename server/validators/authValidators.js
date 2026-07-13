// Validation chains for authentication routes.
import { body, param } from "express-validator";

export const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required."),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  body("phone").optional().trim().isLength({ min: 7 }).withMessage("Phone number is too short."),
];

export const loginValidator = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required."),
  body("password").notEmpty().withMessage("Password is required."),
];

export const updateProfileValidator = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty."),
  body("phone").optional().trim().isLength({ min: 7 }).withMessage("Phone number is too short."),
  body("addresses").optional().isArray().withMessage("Addresses must be an array."),
];

export const changePasswordValidator = [
  body("currentPassword").notEmpty().withMessage("Current password is required."),
  body("password").isLength({ min: 6 }).withMessage("New password must be at least 6 characters."),
];

export const forgotPasswordValidator = [body("email").isEmail().normalizeEmail().withMessage("Valid email is required.")];
export const resetPasswordValidator = [param("token").notEmpty().withMessage("Reset token is required."), body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters.")];
export const verifyEmailValidator = [param("token").notEmpty().withMessage("Verification token is required.")];

export const addressValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required."),
  body("phone").trim().notEmpty().withMessage("Phone is required."),
  body("street").trim().notEmpty().withMessage("Street is required."),
  body("city").trim().notEmpty().withMessage("City is required."),
  body("state").trim().notEmpty().withMessage("State is required."),
  body("postalCode").trim().notEmpty().withMessage("Postal code is required."),
];

export const addressIdValidator = [param("addressId").isMongoId().withMessage("Valid address id is required.")];
