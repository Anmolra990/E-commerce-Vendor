import express from "express";
import productController from "./product.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import authorize from "../../middlewares/roleMiddleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { uploadImage } from "../../middlewares/upload.middleware.js";
import { createProductValidator } from "./product.validator.js";

const router = express.Router();

router.get("/", productController.getAllProducts);

router.get(
  "/vendor/my-products",
  authMiddleware,
  authorize("vendor"),
  productController.getVendorProducts
);

router.get("/:id", productController.getProductById);


router.post(
  "/",
  authMiddleware,
  authorize("vendor"),
  uploadImage,
  createProductValidator,
  validate,
  productController.createProduct
);

router.put(
  "/:id",
  authMiddleware,
  authorize("vendor"),
  uploadImage,
  createProductValidator,
  validate,
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("vendor"),
  productController.deleteProduct
);

router.get(
  "/vendor/my-products",
  authMiddleware,
  authorize("vendor"),
  productController.getVendorProducts
);

export default router;