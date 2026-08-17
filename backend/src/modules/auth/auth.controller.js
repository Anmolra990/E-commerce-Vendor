import authService from "./auth.service.js";

class AuthController {

  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  
 


  async registerVendor(req, res, next) {
  try {
    const user = await authService.registerVendor(req.body);

    res.status(201).json({
      success: true,
      message: "Vendor registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

 async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const profile = await authService.getProfile(req.user);

      res.status(200).json({
        success: true,
        message: "Profile loaded successfully",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const profile = await authService.updateProfile(
        req.user._id,
        req.validatedBody
      );

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async addAddress(req, res, next) {
    try {
      const addresses = await authService.addAddress(req.user._id, req.body);
      res.status(201).json({ success: true, message: "Address saved", data: addresses });
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req, res, next) {
    try {
      const addresses = await authService.updateAddress(req.user._id, req.params.addressId, req.body);
      res.status(200).json({ success: true, message: "Address updated", data: addresses });
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req, res, next) {
    try {
      const addresses = await authService.deleteAddress(req.user._id, req.params.addressId);
      res.status(200).json({ success: true, message: "Address deleted", data: addresses });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
