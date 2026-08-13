import orderService from "./order.service.js";

class OrderController {
  async createOrder(req, res, next) {
    try {
      const order = await orderService.createOrder(
        req.body.items,
        req.user._id,
        req.body.paymentMethod || "COD",
        req.body.deliveryAddress
      );

      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
  
 async getVendorOrders(req, res, next) {
  try {
    const orders = await orderService.getVendorOrders(
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
}

  async getBuyerOrders(req, res, next) {
    try {
      const orders = await orderService.getBuyerOrders(req.user._id);

      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req, res, next) {
    try {
      const orders = await orderService.getAllOrders();

      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req, res, next) {
    try {
      const order = await orderService.getOrderById(req.params.id);

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const order = await orderService.updateStatus(
        req.params.id,
        req.body.status
      );

      res.status(200).json({
        success: true,
        message: "Order status updated",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateOrderDetails(req, res, next) {
    try {
      const order = await orderService.updateOrderDetails(
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: "Order details updated",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteOrder(req, res, next) {
    try {
      await orderService.deleteOrder(req.params.id);

      res.status(200).json({
        success: true,
        message: "Order deleted",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
