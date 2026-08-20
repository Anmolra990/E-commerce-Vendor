import express from "express";

import membershipController from "./membership.controller.js";

import protect from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  membershipController.createMembership
);

router.get(
  "/my",
  protect,
  membershipController.getMyMembership
);

router.get(
  "/:id",
  protect,
  membershipController.getMembershipById
);

export default router;