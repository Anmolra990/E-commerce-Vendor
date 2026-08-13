import { body } from "express-validator";

export const createProductValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .notEmpty()
    .withMessage("Description is required"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock cannot be negative"),

  body("category")
    .notEmpty()
    .withMessage("Category is required"),

  body("image").custom((value, { req }) => {
    if (req.method === "POST" && !req.file) {
      throw new Error("Product image is required");
    }

    if (req.file && !req.file.mimetype.startsWith("image/")) {
      throw new Error("Image must be a valid image file");
    }

    return true;
  }),
];