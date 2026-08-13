import { body } from "express-validator";

export const addToCartValidator = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required"),

  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];