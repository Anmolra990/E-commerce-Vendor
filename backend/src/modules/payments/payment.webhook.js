import Stripe from "stripe";
import paymentRepository from "./payment.repository.js";
import Order from "../orders/order.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Stripe webhook signature error:", error.message);

    return res.status(400).send(
      `Webhook Error: ${error.message}`
    );
  }

  try {
    switch (event.type) {

      case "checkout.session.completed": {
        const session = event.data.object;

        console.log("Stripe payment completed:", session.id);

        const orderId = session.metadata?.orderId;
        const userId = session.metadata?.userId;

        if (!orderId) {
          console.error("Order ID missing from Stripe metadata");
          break;
        }

        // Find order
        const order = await Order.findById(orderId);

        if (!order) {
          console.error("Order not found:", orderId);
          break;
        }

        // Prevent duplicate processing
        if (order.paymentStatus === "Paid") {
          break;
        }

        // Find existing payment
        let payment =
          await paymentRepository.findByStripeSessionId(
            session.id
          );

        if (!payment) {
          payment =
            await paymentRepository.createPayment({
              orderId: order._id,
              userId,
              amount: order.totalAmount,
              method: "STRIPE",
              status: "Success",
              stripeSessionId: session.id,
              stripePaymentIntentId:
                session.payment_intent || "",
              transactionId:
                session.payment_intent || session.id,
              paidAt: new Date(),
            });
        } else {
          await paymentRepository.updatePayment(
            payment._id,
            {
              status: "Success",
              stripePaymentIntentId:
                session.payment_intent || "",
              transactionId:
                session.payment_intent || session.id,
              paidAt: new Date(),
            }
          );
        }

        // Update order
        order.paymentStatus = "Paid";
        order.status = "Confirmed";

        await order.save();

        console.log(
          `Order ${order._id} marked as Paid`
        );

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;

        console.log(
          "Stripe checkout session expired:",
          session.id
        );

        break;
      }

      default:
        console.log(
          `Unhandled Stripe event: ${event.type}`
        );
    }

    res.json({ received: true });

  } catch (error) {
    console.error("Stripe webhook processing error:", error);

    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};