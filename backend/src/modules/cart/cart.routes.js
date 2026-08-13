import express from "express";

import cartController from "./cart.controller.js";

import authMiddleware from "../../middlewares/authMiddleware.js";
import authorize from "../../middlewares/roleMiddleware.js";
import validate from "../../middlewares/validate.middleware.js";

import { addToCartValidator } from "./cart.validator.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorize("buyer", "vendor", "admin"),
  addToCartValidator,
  validate,
  cartController.addToCart
);

router.get(
  "/",
  authMiddleware,
  authorize("buyer", "vendor", "admin"),
  cartController.getCart
);

router.put(
  "/:productId",
  authMiddleware,
  authorize("buyer", "vendor", "admin"),
  cartController.updateQuantity
);

router.delete(
  "/:productId",
  authMiddleware,
  authorize("buyer", "vendor", "admin"),
  cartController.removeItem
);

router.delete(
  "/",
  authMiddleware,
  authorize("buyer", "vendor", "admin"),
  cartController.clearCart
);

export default router;