import Cart from "./cart.model.js";

class CartRepository {
  async findCartByUser(userId) {
    return await Cart.findOne({ userId }).populate(
      "items.productId",
      "title price image stock"
    );
  }

  async createCart(data) {
    return await Cart.create(data);
  }

  async updateCart(cart) {
    return await cart.save();
  }

  async clearCart(userId) {
    return await Cart.findOneAndUpdate(
      { userId },
      { items: [] },
      { new: true }
    );
  }

  async deleteCart(userId) {
    return await Cart.findOneAndDelete({ userId });
  }
}

export default new CartRepository();