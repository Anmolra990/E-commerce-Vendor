import User from "../auth/auth.model.js";
import Product from "../products/product.model.js";
import AppError from "../../utils/AppError.js";

class AdminService {
  async getVendors() {
    const vendors = await User.find({ role: "vendor" }).select(
      "name email isFrozen createdAt"
    );

    const counts = await Product.aggregate([
      { $match: { vendorId: { $in: vendors.map((v) => v._id) } } },
      { $group: { _id: "$vendorId", count: { $sum: 1 } } },
    ]);

    const countMap = counts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    return vendors.map((vendor) => ({
      _id: vendor._id,
      name: vendor.name,
      email: vendor.email,
      isFrozen: vendor.isFrozen,
      createdAt: vendor.createdAt,
      productCount: countMap[vendor._id.toString()] || 0,
    }));
  }

  async setVendorFreeze(vendorId, isFrozen) {
    const vendor = await User.findOne({ _id: vendorId, role: "vendor" });

    if (!vendor) {
      throw new AppError("Vendor not found", 404);
    }

    vendor.isFrozen = isFrozen;
    await vendor.save();

    await Product.updateMany(
      { vendorId: vendor._id },
      { status: isFrozen ? "Inactive" : "Active" }
    );

    return {
      _id: vendor._id,
      name: vendor.name,
      email: vendor.email,
      isFrozen: vendor.isFrozen,
      createdAt: vendor.createdAt,
    };
  }
}

export default new AdminService();
