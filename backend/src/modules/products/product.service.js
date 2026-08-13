import productRepository from "./product.repository.js";
import User from "../auth/auth.model.js";
import AppError from "../../utils/AppError.js";

class ProductService {
  async createProduct(data, vendorId) {
    const vendor = await User.findById(vendorId).select("isFrozen");

    if (vendor?.isFrozen) {
      throw new AppError(
        "Your account is frozen. You cannot create new products.",
        403
      );
    }

    return await productRepository.createProduct({
      ...data,
      vendorId,
      status: "Active",
    });
  }

  async getAllProducts() {
    const products = await productRepository.getAllProducts();
    return products.map((product) => this.addAvailability(product));
  }

  async getProductById(id) {
    const product = await productRepository.getProductById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return this.addAvailability(product);
  }

  async updateProduct(id, data, vendorId) {
    const product = await productRepository.getProductById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.vendorId._id.toString() !== vendorId.toString()) {
      throw new AppError(
        "You can update only your own products",
        403
      );
    }

    const vendor = await User.findById(vendorId).select("isFrozen");

    if (vendor?.isFrozen) {
      throw new AppError(
        "Your account is frozen. You cannot update products.",
        403
      );
    }

    return await productRepository.updateProduct(id, data);
  }

  async deleteProduct(id, vendorId) {
    const product = await productRepository.getProductById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.vendorId._id.toString() !== vendorId.toString()) {
      throw new AppError(
        "You can delete only your own products",
        403
      );
    }

    const vendor = await User.findById(vendorId).select("isFrozen");

    if (vendor?.isFrozen) {
      throw new AppError(
        "Your account is frozen. You cannot delete products.",
        403
      );
    }

    await productRepository.deleteProduct(id);

    return;
  }

  async getVendorProducts(vendorId) {
    return await productRepository.getVendorProducts(vendorId);
  }

  addAvailability(product) {
    const productData = product.toObject();
    const vendorFrozen = Boolean(productData.vendorId?.isFrozen);
    const inactive = productData.status && productData.status !== "Active";
    const outOfStock = productData.stock <= 0;

    return {
      ...productData,
      isAvailable: !vendorFrozen && !inactive && !outOfStock,
      unavailableReason: vendorFrozen
        ? "This product is temporarily unavailable because due to technical issues"
        : outOfStock
        ? "This product is out of stock."
        : inactive
        ? "This product is currently unavailable."
        : null,
    };
  }
}

export default new ProductService();
