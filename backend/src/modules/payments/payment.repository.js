import Payment from "./payment.model.js";

class PaymentRepository {

  // Create payment
  async createPayment(data) {
    return await Payment.create(data);
  }


  // Get all payments
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
    return await Payment.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  }



  async findByStripeSessionId(sessionId) {
    return await Payment.findOne({
      stripeSessionId: sessionId,
    });
  }



  async findByPaymentIntentId(paymentIntentId) {
    return await Payment.findOne({
      stripePaymentIntentId: paymentIntentId,
    });
  }
}

export default new PaymentRepository();