// Validation chains for product routes.
import { body, param, query } from "express-validator";

export const productIdValidator = [param("id").isMongoId().withMessage("Valid product id is required.")];
export const productSlugValidator = [param("slug").trim().notEmpty().withMessage("Product slug is required.")];

export const productQueryValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be positive."),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100."),
  query("minPrice").optional().isFloat({ min: 0 }).withMessage("Minimum price must be positive."),
  query("maxPrice").optional().isFloat({ min: 0 }).withMessage("Maximum price must be positive."),
];

const productFields = [
  body("slug").optional().trim().isSlug().withMessage("Slug must be URL friendly."),
  body("discountPrice").optional().isFloat({ min: 0 }).withMessage("Discount price must be positive."),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock cannot be negative."),
  body("images").optional().isArray().withMessage("Images must be an array."),
  body("tags").optional().isArray().withMessage("Tags must be an array."),
  body("tags.*").optional().trim().notEmpty().withMessage("Tags cannot be empty."),
  body("featured").optional().isBoolean().withMessage("Featured must be boolean."),
  body("isActive").optional().isBoolean().withMessage("isActive must be boolean."),
];

export const productValidator = [
  body("title").trim().notEmpty().withMessage("Product title is required."),
  body("description").trim().notEmpty().withMessage("Description is required."),
  body("price").isFloat({ min: 0 }).withMessage("Price must be positive."),
  body("category").isMongoId().withMessage("Valid category is required."),
  ...productFields,
];

export const productUpdateValidator = [
  body("title").optional().trim().notEmpty().withMessage("Product title cannot be empty."),
  body("description").optional().trim().notEmpty().withMessage("Description cannot be empty."),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be positive."),
  body("category").optional().isMongoId().withMessage("Valid category is required."),
  ...productFields,
];
