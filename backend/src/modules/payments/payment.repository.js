import Payment from "./payment.model.js";

class PaymentRepository {
  async createPayment(data) {
    return await Payment.create(data);
  }

  async getAllPayments() {
    return await Payment.find()
      .populate("orderId")
      .populate("userId", "name email");
  }

  async getPaymentById(id) {
    return await Payment.findById(id)
      .populate("orderId")
      .populate("userId", "name email");
  }

  async updatePayment(id, data) {
    return await Payment.findByIdAndUpdate(id, data, {
      new: true,
    });
  }
}

export default new PaymentRepository();