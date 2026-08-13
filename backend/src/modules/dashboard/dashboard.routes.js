import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import authorize from "../../middlewares/roleMiddleware.js";
import dashboardController from "./dashboard.controller.js";

const router = express.Router();

router.get(
  "/vendor",
  authMiddleware,
  authorize("vendor"),
  dashboardController.getVendorDashboard
);

router.get(
  "/admin",
  authMiddleware,
  authorize("admin"),
  dashboardController.getAdminDashboard
);

export default router;
