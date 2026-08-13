import express from "express";

import paymentController from "./payment.controller.js";

import authMiddleware from "../../middlewares/authMiddleware.js";
import authorize from "../../middlewares/roleMiddleware.js";
import validate from "../../middlewares/validate.middleware.js";

import { paymentValidator } from "./payment.validator.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorize("buyer"),
  paymentValidator,
  validate,
  paymentController.makePayment
);

router.get(
  "/",
  authMiddleware,
  authorize("admin"),
  paymentController.getPayments
);

router.get(
  "/:id",
  authMiddleware,
  paymentController.getPayment
);

export default router;