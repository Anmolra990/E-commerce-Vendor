import express from "express";
import authController from "./auth.controller.js";
import {
  registerValidator,
  loginValidator,
  addressValidator,
} from "./auth.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import authorize from "../../middlewares/roleMiddleware.js";
import validateWithZod from "../../middlewares/zod.middleware.js";
import { updateProfileSchema } from "./profile.schema.js";

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  validate,
  authController.register
);

router.post(
  "/register/vendor",
  registerValidator,
  validate,
  authController.registerVendor
);

router.post(
  "/login",
  loginValidator,
  validate,
  authController.login
);

router.get("/profile", authMiddleware, authController.getProfile);

router.put(
  "/profile",
  authMiddleware,
  authorize("buyer", "vendor"),
  validateWithZod(updateProfileSchema),
  authController.updateProfile
);

router.post("/addresses", authMiddleware, addressValidator, validate, authController.addAddress);

router.put("/addresses/:addressId", authMiddleware, addressValidator, validate, authController.updateAddress);
router.delete("/addresses/:addressId", authMiddleware, authController.deleteAddress);

export default router;
