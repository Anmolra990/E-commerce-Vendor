import express from "express";
import orderController from "./order.controller.js";

import authMiddleware from "../../middlewares/authMiddleware.js";
import authorize from "../../middlewares/roleMiddleware.js";
import validate from "../../middlewares/validate.middleware.js";

import {
  createOrderValidator,
  updateOrderValidator,
} from "./order.validator.js";

const router = express.Router();


router.post(
  "/",
  authMiddleware,
  authorize("buyer", "vendor", "admin"),
  createOrderValidator,
  validate,
  orderController.createOrder
);

router.get(
  "/my-orders",
  authMiddleware,
  authorize("buyer", "vendor", "admin"),
  orderController.getBuyerOrders
);


router.get(
  "/all",
  authMiddleware,
  authorize("admin"),
  orderController.getAllOrders
);

router.put(
  "/:id/status",
  authMiddleware,
  authorize("admin", "vendor"),
  orderController.updateStatus
);

router.put(
  "/:id",
  authMiddleware,
  authorize("admin", "vendor"),
  updateOrderValidator,
  validate,
  orderController.updateOrderDetails
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("admin"),
  orderController.deleteOrder
);
 router.get(
  "/vendor/my-orders",
  authMiddleware,
  authorize("vendor"),
  orderController.getVendorOrders
);

router.get(
  "/:id",
  authMiddleware,
  orderController.getOrderById
);

export default router;