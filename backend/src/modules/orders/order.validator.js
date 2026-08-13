import { body } from "express-validator";

export const createOrderValidator = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Items are required"),

  body("items.*.productId")
    .notEmpty()
    .withMessage("Product ID is required"),

  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("deliveryAddress")
    .trim()
    .notEmpty()
    .withMessage("Delivery address is required"),
];

export const updateOrderValidator = [
  body("status")
    .optional()
    .isIn(["Pending", "Confirmed", "Shipped", "Out for Delivery", "Delivered"])
    .withMessage("Invalid order status"),

  body("paymentStatus")
    .optional()
    .isIn(["Pending", "Paid"])
    .withMessage("Invalid payment status"),
];