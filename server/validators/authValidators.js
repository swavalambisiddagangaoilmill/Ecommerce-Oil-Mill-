// Validation chains for authentication routes.
import { body, param } from "express-validator";

const strongPassword = body("password")
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
  .matches(/[A-Z]/).withMessage("Password must include an uppercase letter.")
  .matches(/[a-z]/).withMessage("Password must include a lowercase letter.")
  .matches(/\d/).withMessage("Password must include a number.");

export const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required."),
  strongPassword,
  body("phone").optional().trim().isLength({ min: 7 }).withMessage("Phone number is too short."),
  body("turnstileToken").optional().trim(),
];

export const loginValidator = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required."),
  body("password").notEmpty().withMessage("Password is required."),
  body("remember").optional().isBoolean().toBoolean(),
  body("turnstileToken").optional().trim(),
  body("otpCode").optional().isLength({ min: 6, max: 6 }).withMessage("Security code must be 6 digits."),
];

export const googleValidator = [body("credential").optional().trim(), body("idToken").optional().trim()];

export const updateProfileValidator = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty."),
  body("phone").optional().trim().isLength({ min: 7 }).withMessage("Phone number is too short."),
];

export const changePasswordValidator = [
  body("currentPassword").notEmpty().withMessage("Current password is required."),
  strongPassword,
  body("otpCode").isLength({ min: 6, max: 6 }).withMessage("Security code is required."),
];

export const forgotPasswordValidator = [body("email").isEmail().normalizeEmail().withMessage("Valid email is required."), body("turnstileToken").optional().trim()];
export const resetPasswordValidator = [param("token").notEmpty().withMessage("Reset token is required."), strongPassword];
export const verifyEmailValidator = [param("token").notEmpty().withMessage("Verification token is required.")];
export const otpRequestValidator = [body("purpose").isIn(["change_password", "change_email", "delete_account"]).withMessage("Valid OTP purpose is required.")];
export const sessionIdValidator = [param("sessionId").notEmpty().withMessage("Session id is required.")];

export const addressValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required."),
  body("phone").trim().notEmpty().withMessage("Phone is required."),
  body("street").trim().notEmpty().withMessage("Street is required."),
  body("city").trim().notEmpty().withMessage("City is required."),
  body("state").trim().notEmpty().withMessage("State is required."),
  body("postalCode").trim().notEmpty().withMessage("Postal code is required."),
];

export const addressIdValidator = [param("addressId").isMongoId().withMessage("Valid address id is required.")];
