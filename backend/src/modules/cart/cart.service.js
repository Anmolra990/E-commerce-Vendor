import cartRepository from "./cart.repository.js";
import Product from "../products/product.model.js";
import AppError from "../../utils/AppError.js";

class CartService {
  async addToCart(userId, productId, quantity) {
    const product = await Product.findById(productId).populate("vendorId", "isFrozen");

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.vendorId?.isFrozen || product.status !== "Active") {
      throw new AppError("This product is currently unavailable.", 400);
    }

    if (product.stock <= 0) {
      throw new AppError("This product is out of stock.", 400);
    }

    if (quantity > product.stock) {
      throw new AppError("Not enough stock available", 400);
    }

    let cart = await cartRepository.findCartByUser(userId);

    if (!cart) {
      cart = await cartRepository.createCart({
        userId,
        items: [
          {
            productId: product._id,
            quantity,
          },
        ],
      });

      return cart;
    }

    // Remove old cart items whose products no longer exist
    cart.items = cart.items.filter(
      (item) => item.productId !== null
    );

    const item = cart.items.find((item) => {
      const itemProductId =
        item.productId?._id?.toString() ||
        item.productId?.toString();

      return itemProductId === productId.toString();
    });

    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        quantity,
      });
    }

    return await cartRepository.updateCart(cart);
  }

  async getCart(userId) {
    const cart = await cartRepository.findCartByUser(userId);

    if (!cart) {
      return {
        items: [],
      };
    }

    // Remove cart items where product was deleted
    cart.items = cart.items.filter(
      (item) => item.productId !== null
    );

    return cart;
  }

  async updateQuantity(userId, productId, quantity) {
    const cart = await cartRepository.findCartByUser(userId);

    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    const item = cart.items.find((item) => {
      const itemProductId =
        item.productId?._id?.toString() ||
        item.productId?.toString();

      return itemProductId === productId.toString();
    });

    if (!item) {
      throw new AppError("Product not found in cart", 404);
    }

    item.quantity = quantity;

    return await cartRepository.updateCart(cart);
  }

  async removeItem(userId, productId) {
    const cart = await cartRepository.findCartByUser(userId);

    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    cart.items = cart.items.filter((item) => {
      const itemProductId =
        item.productId?._id?.toString() ||
        item.productId?.toString();

      return itemProductId !== productId.toString();
    });

    return await cartRepository.updateCart(cart);
  }

  async clearCart(userId) {
    return await cartRepository.clearCart(userId);
  }
}

export default new CartService();
