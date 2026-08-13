import Product from "../products/product.model.js";
import Order from "../orders/order.model.js";
import Payment from "../payments/payment.model.js";
import User from "../auth/auth.model.js";

class DashboardService {
  async getVendorDashboard(user) {
    const [productCount, orderCount] = await Promise.all([
      Product.countDocuments({ vendorId: user._id }),
      Order.countDocuments({
        "items.productId": {
          $in: await Product.find({ vendorId: user._id }).distinct("_id"),
        },
      }),
    ]);

    return {
      message: "Vendor dashboard access granted",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      stats: {
        products: productCount,
        orders: orderCount,
      },
    };
  }

  async getAdminDashboard(user) {
    const [usersCount, ordersCount, paymentsCount, productsCount] =
      await Promise.all([
        User.countDocuments(),
        Order.countDocuments(),
        Payment.countDocuments(),
        Product.countDocuments(),
      ]);

    return {
      message: "Admin dashboard access granted",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      stats: {
        users: usersCount,
        orders: ordersCount,
        payments: paymentsCount,
        products: productsCount,
      },
    };
  }
}

export default new DashboardService();
