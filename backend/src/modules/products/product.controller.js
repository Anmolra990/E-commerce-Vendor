import productService from "./product.service.js";

class ProductController {
  async createProduct(req, res, next) {
    try {
      if (req.file) {
        req.body.image = `/uploads/${req.file.filename}`;
      }

      const product = await productService.createProduct(
        req.body,
        req.user._id
      );

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllProducts(req, res, next) {
    try {
      const includeInactive = req.query.includeInactive === "true";
      const products = await productService.getAllProducts(
        includeInactive
      );

      res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const product = await productService.getProductById(
        req.params.id
      );

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      if (req.file) {
        req.body.image = `/uploads/${req.file.filename}`;
      }

      const product = await productService.updateProduct(
        req.params.id,
        req.body,
        req.user._id
      );

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      await productService.deleteProduct(
        req.params.id,
        req.user._id
      );

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getVendorProducts(req, res, next) {
    try {
      const products = await productService.getVendorProducts(
        req.user._id
      );

      res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();