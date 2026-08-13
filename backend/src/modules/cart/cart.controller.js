import cartService from "./cart.service.js";

class CartController {
  async addToCart(req, res, next) {
    try {
      const cart = await cartService.addToCart(
        req.user._id,
        req.body.productId,
        req.body.quantity
      );

      res.status(201).json({
        success: true,
        message: "Product added to cart",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCart(req, res, next) {
    try {
      const cart = await cartService.getCart(req.user._id);

      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateQuantity(req, res, next) {
    try {
      const cart = await cartService.updateQuantity(
        req.user._id,
        req.params.productId,
        req.body.quantity
      );

      res.status(200).json({
        success: true,
        message: "Quantity updated",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req, res, next) {
    try {
      const cart = await cartService.removeItem(
        req.user._id,
        req.params.productId
      );

      res.status(200).json({
        success: true,
        message: "Item removed",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req, res, next) {
    try {
      await cartService.clearCart(req.user._id);

      res.status(200).json({
        success: true,
        message: "Cart cleared",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CartController();
