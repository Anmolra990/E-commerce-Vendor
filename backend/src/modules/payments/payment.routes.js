import express from "express";

import paymentController from "./payment.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import authorize from "../../middlewares/roleMiddleware.js";

const router = express.Router();



router.post(
  "/create-checkout-session",
  authMiddleware,
  authorize("buyer"),
  paymentController.createCheckoutSession
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