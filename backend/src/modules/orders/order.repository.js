import Order from "./order.model.js";
import Product from "../products/product.model.js";

class OrderRepository {
  async createOrder(orderData) {
    return await Order.create(orderData);
  }

  async getAllOrders() {
    return await Order.find()
      .populate("userId", "name email")
      .populate("items.productId", "title price");
  }

  async getOrderById(id) {
    return await Order.findById(id)
      .populate("userId", "name email")
      .populate("items.productId", "title price");
  }

  async getBuyerOrders(userId) {
    return await Order.find({ userId })
      .populate("items.productId", "title price");
  }

  async getVendorOrders(vendorId) {
    const vendorProducts = await Product.find({
      vendorId,
    }).select("_id");

    const productIds = vendorProducts.map(
      (product) => product._id
    );

    return await Order.find({
      "items.productId": {
        $in: productIds,
      },
    })
      .populate("userId", "name email")
      .populate("items.productId", "title price vendorId")
      .sort({ createdAt: -1 });
  }

  async updateOrderStatus(id, status) {
    return await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  }

  async updateOrderDetails(id, data) {
    return await Order.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteOrder(id) {
    return await Order.findByIdAndDelete(id);
  }
}

export default new OrderRepository();