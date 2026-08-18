import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // Order connected to this payment
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    // Buyer who made the payment
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Amount paid
    amount: {
      type: Number,
      required: true,
    },

    // Payment gateway
    method: {
      type: String,
      enum: ["STRIPE", "Cash On Delivery"],
      required: true,
    },

    // Payment status
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },

    // Stripe Checkout Session ID
    stripeSessionId: {
      type: String,
      default: "",
    },

    // Stripe Payment Intent ID
    stripePaymentIntentId: {
      type: String,
      default: "",
    },

    // Transaction/reference ID
    transactionId: {
      type: String,
      default: "",
    },

    // When payment was completed
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", paymentSchema);