import dashboardService from "./dashboard.service.js";

class DashboardController {
  async getVendorDashboard(req, res, next) {
    try {
      const data = await dashboardService.getVendorDashboard(req.user);

      res.status(200).json({
        success: true,
        message: "Vendor dashboard loaded",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAdminDashboard(req, res, next) {
    try {
      const data = await dashboardService.getAdminDashboard(req.user);

      res.status(200).json({
        success: true,
        message: "Admin dashboard loaded",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
