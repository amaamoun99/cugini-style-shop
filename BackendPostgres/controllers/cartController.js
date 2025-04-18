const cartService = require("../services/cartServices");

const getCart = async (req, res) => {
  try {
    // 🛠️ Get cart identity from middleware
    console.log("🎯 cartController.getCart reached");
    console.log("🛒 Cart identity:", req.cartIdentity);
    const cart = await cartService.getOrCreateCart(req.cartIdentity);
    console.log("✅ Got cart:", cart);
    res.json(cart);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const addCartItem = async (req, res) => {
  try {
    const { variantId, quantity } = req.body;

    if (!variantId || !quantity) {
      return res.status(400).json({
        status: "fail",
        message: "variantId and quantity are required",
      });
    }

    const item = await cartService.addItemToCart({
      ...req.cartIdentity,
      variantId,
      quantity: parseInt(quantity),
    });

    res.status(201).json({
      status: "success",
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;

    if (quantity === undefined) {
      return res.status(400).json({
        status: "fail",
        message: "Quantity is required",
      });
    }

    const updated = await cartService.updateCartItem(id, parseInt(quantity));
    res.json({
      status: "success",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    await cartService.removeCartItem(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    await cartService.clearCart(req.cartIdentity);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getCart,
  addCartItem,
  updateCartItemQuantity,
  deleteCartItem,
  clearCart,
};
