import { body } from "express-validator";

export const paymentValidator = [
  body("orderId")
    .notEmpty()
    .withMessage("Order ID is required"),

  body("method")
    .isIn(["UPI", "Card", "Cash On Delivery"])
    .withMessage("Invalid payment method"),
];