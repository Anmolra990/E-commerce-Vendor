import express from "express";
import path from "path";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import productRoutes from "./modules/products/product.routes.js";
import orderRoutes from "./modules/orders/order.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";

import { stripeWebhook } from "./modules/payments/payment.webhook.js";

const app = express();

app.use(cors());



app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);




app.use(express.json());

app.use(
  "/uploads",
  express.static(path.resolve("uploads"))
);




app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/admin", adminRoutes);




app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the E-commerce",
  });
});



app.use(errorMiddleware);

export default app;