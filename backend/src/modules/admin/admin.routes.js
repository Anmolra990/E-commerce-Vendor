import express from "express";
import adminController from "./admin.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import authorize from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/vendors",
  authMiddleware,
  authorize("admin"),
  adminController.getVendors
);

router.put(
  "/vendors/:vendorId/freeze",
  authMiddleware,
  authorize("admin"),
  adminController.updateVendorFreeze
);

export default router;
