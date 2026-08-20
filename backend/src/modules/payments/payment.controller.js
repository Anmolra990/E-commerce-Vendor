import paymentService from "./payment.service.js";

class PaymentController {

  // Create Stripe Checkout Session
  async createCheckoutSession(req, res, next) {
    try {
      const result = await paymentService.createCheckoutSession(
        req.user._id,
        req.body.orderId
      );

      res.status(201).json({
        success: true,
        message: "Stripe checkout session created",
        data: result,
      });

    } catch (error) {
      next(error);
    }
  }
 

async createMembershipCheckoutSession(
  req,
  res,
  next
) {

  try {

    const result =
      await paymentService
        .createMembershipCheckoutSession(
          req.user._id,
          req.body.membershipId
        );

    res.status(201).json({
      success: true,
      message:
        "Membership Stripe checkout session created",

      data: result,
    });

  } catch (error) {
    next(error);
  }
}

  // Get all payments
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
      const payment = await paymentService.getPayment(
        req.params.id
      );

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