import express from "express";
import authController from "./auth.controller.js";
import {
  registerValidator,
  loginValidator,
  addressValidator,
} from "./auth.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  validate,
  authController.register
);

router.post(
  "/login",
  loginValidator,
  validate,
  authController.login
);

router.get("/profile", authMiddleware, authController.getProfile);

router.post("/addresses", authMiddleware, addressValidator, validate, authController.addAddress);

router.put("/addresses/:addressId", authMiddleware, addressValidator, validate, authController.updateAddress);
router.delete("/addresses/:addressId", authMiddleware, authController.deleteAddress);

export default router;
