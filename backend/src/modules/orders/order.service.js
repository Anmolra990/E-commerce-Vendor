import OrderRepository from "./order.repository.js";
import Product from "../products/product.model.js";
import AppError from "../../utils/AppError.js";

class OrderService {
  async createOrder(items, userId, paymentMethod = "COD", deliveryAddress = "") {
    if (!deliveryAddress?.trim()) {
      throw new AppError("Delivery address is required", 400);
    }

    let orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId).populate("vendorId", "isFrozen");

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      if (product.vendorId?.isFrozen || product.status !== "Active") {
        throw new AppError(`\"${product.title}\" is currently unavailable.`, 400);
      }

      if (product.stock <= 0 || item.quantity > product.stock) {
        throw new AppError(`\"${product.title}\" does not have enough stock.`, 400);
      }

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    return await OrderRepository.createOrder({
      userId,
      items: orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      deliveryAddress,
    });
  }

  async getBuyerOrders(userId) {
    return await OrderRepository.getBuyerOrders(userId);
  }

  async getVendorOrders(vendorId) {
  return await OrderRepository.getVendorOrders(vendorId);
}


  async getAllOrders() {
    return await OrderRepository.getAllOrders();
  }

  async getOrderById(id) {
    const order = await OrderRepository.getOrderById(id);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    return order;
  }

  async updateStatus(id, status) {
    return await OrderRepository.updateOrderStatus(id, status);
  }

  async updateOrderDetails(id, data) {
    const allowedFields = {};

    if (data.status) {
      allowedFields.status = data.status;
    }

    if (data.paymentStatus) {
      allowedFields.paymentStatus = data.paymentStatus;
    }

    if (Object.keys(allowedFields).length === 0) {
      throw new AppError("No valid fields provided for update", 400);
    }

    return await OrderRepository.updateOrderDetails(id, allowedFields);
  }

  async deleteOrder(id) {
    return await OrderRepository.deleteOrder(id);
  }
}

export default new OrderService();
