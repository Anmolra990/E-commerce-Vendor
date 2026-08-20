import Stripe from "stripe";

import paymentRepository from "./payment.repository.js";
import Order from "../orders/order.model.js";
import AppError from "../../utils/AppError.js";
import Membership from "../membership/membership.model.js";

class PaymentService {

  // ==========================================
  // NORMAL ORDER STRIPE PAYMENT
  // ==========================================

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

    if (
      order.userId.toString() !==
      userId.toString()
    ) {
      throw new AppError(
        "You cannot pay for this order",
        403
      );
    }

    if (order.paymentStatus === "Paid") {
      throw new AppError(
        "Order already paid",
        400
      );
    }

    const lineItems = order.items.map((item) => {

      const productName =
        item.productId?.title || "Product";

      const unitAmount =
        Math.round(Number(item.price) * 100);

      if (
        !Number.isSafeInteger(unitAmount) ||
        unitAmount < 1
      ) {
        throw new AppError(
          "An item in this order has an invalid price",
          400
        );
      }

      return {
        price_data: {
          currency: "inr",

          product_data: {
            name: productName,
          },

          unit_amount: unitAmount,
        },

        quantity: item.quantity,
      };
    });

    const stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY
    );

    const session =
      await stripe.checkout.sessions.create({

        payment_method_types: ["card"],

        line_items: lineItems,

        mode: "payment",

        success_url:
          `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${process.env.FRONTEND_URL}/payment-cancelled`,

        metadata: {
          orderId:
            order._id.toString(),

          userId:
            userId.toString(),
        },
      });

    return {
      url: session.url,
      sessionId: session.id,
    };
  }


  // ==========================================
  // MEMBERSHIP STRIPE PAYMENT
  // ==========================================

  async createMembershipCheckoutSession(
    userId,
    membershipId
  ) {

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new AppError(
        "Stripe is not configured. Add STRIPE_SECRET_KEY to backend/.env and restart the server.",
        500
      );
    }

    const membership =
      await Membership.findById(
        membershipId
      );

    if (!membership) {
      throw new AppError(
        "Membership not found",
        404
      );
    }

    // Check ownership
    if (
      membership.userId.toString() !==
      userId.toString()
    ) {
      throw new AppError(
        "You cannot pay for this membership",
        403
      );
    }

    // Already active
    if (membership.status === "Active") {
      throw new AppError(
        "Membership is already active",
        400
      );
    }


    // ==========================================
    // MEMBERSHIP PLANS
    // ==========================================

    const plans = {

      silver: {
        name: "Silver Membership",
        price: 499,
      },

      gold: {
        name: "Gold Membership",
        price: 999,
      },

    };


    const selectedPlan =
      plans[membership.plan];


    if (!selectedPlan) {
      throw new AppError(
        "Invalid membership plan",
        400
      );
    }


    // ==========================================
    // STRIPE
    // ==========================================

    const stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY
    );


    const session =
      await stripe.checkout.sessions.create({

        payment_method_types: ["card"],

        line_items: [
          {
            price_data: {

              currency: "inr",

              product_data: {
                name:
                  selectedPlan.name,
              },

              unit_amount:
                selectedPlan.price * 100,
            },

            quantity: 1,
          },
        ],

        mode: "payment",


        // SUCCESS
        success_url:
          `${process.env.FRONTEND_URL}/membership-success?session_id={CHECKOUT_SESSION_ID}`,


        // CANCEL
        cancel_url:
          `${process.env.FRONTEND_URL}/membership-cancelled`,


        // IMPORTANT
        // Webhook will use these values
        metadata: {

          membershipId:
            membership._id.toString(),

          userId:
            userId.toString(),

          plan:
            membership.plan,
        },

      });


    return {

      url: session.url,

      sessionId:
        session.id,

    };
  }

}

export default new PaymentService();