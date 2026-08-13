import paymentRepository from "./payment.repository.js";
import Order from "../orders/order.model.js";
import AppError from "../../utils/AppError.js";

class PaymentService {
  async makePayment(userId, orderId, method) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (order.paymentStatus === "Paid") {
      throw new AppError("Order already paid", 400);
    }

    const payment = await paymentRepository.createPayment({
      orderId,
      userId,
      amount: order.totalAmount,
      method,
      status: "Success",
      transactionId: "TXN" + Date.now(),
    });

    order.paymentStatus = "Paid";
    await order.save();

    return payment;
  }

  async getPayments() {
    return await paymentRepository.getAllPayments();
  }

  async getPayment(id) {
    return await paymentRepository.getPaymentById(id);
  }
}

export default new PaymentService();