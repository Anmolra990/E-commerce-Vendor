import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Out for Delivery", "Delivered"],
      default: "Pending",
    },

    paymentStatus: {
  type: String,
  enum: ["Pending", "Paid"],
  default: "Pending",
},

paymentMethod: {
  type: String,
  enum: ["UPI", "Card", "COD", "Net Banking"],
  default: "COD",
},

stripeSessionId: {
  type: String,
  default: null,
},

stripePaymentIntentId: {
  type: String,
  default: null,
},

paidAt: {
  type: Date,
  default: null,
},

    deliveryAddress: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);