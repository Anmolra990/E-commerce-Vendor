import Product from "./product.model.js";

class ProductRepository {
  async createProduct(productData) {
    return await Product.create(productData);
  }

  async getAllProducts(includeInactive = false) {
    
    return await Product.find({}).populate("vendorId", "name email isFrozen");
  }

  async getProductById(id) {
    return await Product.findById(id).populate(
      "vendorId",
      "name email isFrozen"
    );
  }

  async updateProduct(id, data) {
    return await Product.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }

  async getVendorProducts(vendorId) {
    return await Product.find({ vendorId });
  }
}

export default new ProductRepository();
