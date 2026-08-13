import adminService from "./admin.service.js";

class AdminController {
  async getVendors(req, res, next) {
    try {
      const vendors = await adminService.getVendors();

      res.status(200).json({
        success: true,
        data: vendors,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateVendorFreeze(req, res, next) {
    try {
      const { vendorId } = req.params;
      const { isFrozen } = req.body;

      const vendor = await adminService.setVendorFreeze(vendorId, isFrozen);

      res.status(200).json({
        success: true,
        message: `Vendor ${isFrozen ? "frozen" : "unfrozen"} successfully`,
        data: vendor,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
