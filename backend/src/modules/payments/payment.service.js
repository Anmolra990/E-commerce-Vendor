import Stripe from "stripe";

import paymentRepository from "./payment.repository.js";
import Order from "../orders/order.model.js";
import AppError from "../../utils/AppError.js";

class PaymentService {

  async createCheckoutSession(userId, orderId) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new AppError(
        "Stripe is not configured. Add STRIPE_SECRET_KEY to backend/.env and restart the server.",
        500
      );
    }

    const order = await Order.findById(orderId).populate(
      "items.productId",
      "title"
    );

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (order.userId.toString() !== userId.toString()) {
      throw new AppError("You cannot pay for this order", 403);
    }

    if (order.paymentStatus === "Paid") {
      throw new AppError("Order already paid", 400);
    }

    const lineItems = order.items.map((item) => {
      const productName = item.productId?.title || "Product";
      const unitAmount = Math.round(Number(item.price) * 100);

      if (!Number.isSafeInteger(unitAmount) || unitAmount < 1) {
        throw new AppError("An item in this order has an invalid price", 400);
      }

      return {
        price_data: {
          currency: "inr",
          product_data: { name: productName },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: lineItems,

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
