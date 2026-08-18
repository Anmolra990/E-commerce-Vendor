import Stripe from "stripe";

import paymentRepository from "./payment.repository.js";
import Order from "../orders/order.model.js";
import AppError from "../../utils/AppError.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentService {

  async createCheckoutSession(userId, orderId) {

    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (order.userId.toString() !== userId.toString()) {
      throw new AppError("You cannot pay for this order", 403);
    }

    if (order.paymentStatus === "Paid") {
      throw new AppError("Order already paid", 400);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: order.items.map((item) => ({
        price_data: {
          currency: "inr",

          product_data: {
            name: item.productId.title,
          },

          unit_amount: item.price * 100,
        },

        quantity: item.quantity,
      })),

      mode: "payment",

      success_url:
        "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",

      cancel_url:
        "http://localhost:5173/payment-cancelled",

      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    return {
      url: session.url,
      sessionId: session.id,
    };
  }
}

export default new PaymentService();