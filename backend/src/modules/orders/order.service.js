import OrderRepository from "./order.repository.js";
import Product from "../products/product.model.js";
import cartRepository from "../cart/cart.repository.js";
import AppError from "../../utils/AppError.js";

class OrderService {
  async createOrder(items, userId, paymentMethod = "COD", deliveryAddress = "") {
    if (!deliveryAddress?.trim()) {
      throw new AppError("Delivery address is required", 400);
    }

    const requestedItems = new Map();

    for (const item of items) {
      const productId = item.productId.toString();
      requestedItems.set(productId, (requestedItems.get(productId) || 0) + item.quantity);
    }

    const reservedStock = [];
    let orderItems = [];
    let totalAmount = 0;
    let orderCreated = false;

    try {
      for (const [productId, quantity] of requestedItems) {
        const product = await Product.findById(productId).populate("vendorId", "isFrozen");

        if (!product) {
          throw new AppError("Product not found", 404);
        }

        if (product.vendorId?.isFrozen || product.status !== "Active") {
          throw new AppError(`\"${product.title}\" is currently unavailable.`, 400);
        }

        // Atomically reserve stock. This prevents two buyers from purchasing
        // the last item at the same time.
        const reservedProduct = await Product.findOneAndUpdate(
          {
            _id: productId,
            status: "Active",
            stock: { $gte: quantity },
          },
          { $inc: { stock: -quantity } },
          { new: false }
        );

        if (!reservedProduct) {
          throw new AppError(`\"${product.title}\" does not have enough stock.`, 400);
        }

        reservedStock.push({ productId: product._id, quantity });
        orderItems.push({
          productId: product._id,
          quantity,
          price: product.price,
        });
        totalAmount += product.price * quantity;
      }

      const order = await OrderRepository.createOrder({
        userId,
        items: orderItems,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
        deliveryAddress,
      });

      orderCreated = true;
      await cartRepository.clearCart(userId);
      return order;
    } catch (error) {
   
      if (!orderCreated) {
        await Promise.all(
          reservedStock.map(({ productId, quantity }) =>
            Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } })
          )
        );
      }
      throw error;
    }
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
