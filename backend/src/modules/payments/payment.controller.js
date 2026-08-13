import paymentService from "./payment.service.js";

class PaymentController {
  async makePayment(req, res, next) {
    try {
      const payment = await paymentService.makePayment(
        req.user._id,
        req.body.orderId,
        req.body.method
      );

      res.status(201).json({
        success: true,
        message: "Payment Successful",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPayments(req, res, next) {
    try {
      const payments = await paymentService.getPayments();

      res.status(200).json({
        success: true,
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPayment(req, res, next) {
    try {
      const payment = await paymentService.getPayment(req.params.id);

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController();
