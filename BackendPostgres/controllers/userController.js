const orderService = require('../services/orderServices');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        addresses: true,
        orders: true,
        wishlist: true,
        cart: true
      }
    });
    res.json({ status: 'success', data: users });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

// Get all users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        addresses: true,
        orders: true,
        wishlist: true,
        cart: true
      }
    });
    res.json({ status: 'success', data: users });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

// Add a product to user's wishlist
exports.addItemToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ status: 'fail', message: 'productId required' });
    }
    // Find or create wishlist with items
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { user: { connect: { id: userId } } },
        include: { items: { include: { product: true } } }
      });
    }
    // Check if already wishlisted
    const alreadyInWishlist = wishlist.items.some(item => item.productId === productId);
    if (alreadyInWishlist) {
      return res.status(200).json({ status: 'success', message: 'Already in wishlist', data: wishlist.items });
    }
    // Add WishlistItem
    await prisma.wishlistItem.create({
      data: {
        wishlist: { connect: { id: wishlist.id } },
        product: { connect: { id: productId } },
      }
    });
    // Fetch updated wishlist items
    const updatedWishlist = await prisma.wishlist.findUnique({
      where: { id: wishlist.id },
      include: { items: { include: { product: true } } }
    });
    res.json({ status: 'success', data: updatedWishlist.items });
  } catch (err) {
    console.error('Add Wishlist Error:', err);
    if (err.stack) console.error('Stack:', err.stack);
    res.status(500).json({ status: 'fail', message: err.message, error: err });
  }
};

// Remove a product from user's wishlist
exports.removeItemFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ status: 'fail', message: 'productId required' });
    }
    // Find user's wishlist with items
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });
    if (!wishlist) {
      return res.status(404).json({ status: 'fail', message: 'Wishlist not found' });
    }
    // Find the wishlist item
    const item = wishlist.items.find(item => item.productId === productId);
    if (!item) {
      return res.status(404).json({ status: 'fail', message: 'Item not in wishlist' });
    }
    await prisma.wishlistItem.delete({ where: { id: item.id } });
    // Fetch updated wishlist items
    const updatedWishlist = await prisma.wishlist.findUnique({
      where: { id: wishlist.id },
      include: { items: { include: { product: true } } }
    });
    res.json({ status: 'success', data: updatedWishlist.items });
  } catch (err) {
    console.error('Remove Wishlist Error:', err);
    if (err.stack) console.error('Stack:', err.stack);
    res.status(500).json({ status: 'fail', message: err.message, error: err });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        addresses: true,
        orders: true,
        wishlist: true,
        cart: true
      }
    });
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
    res.json({ status: 'success', data: user });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ status: 'success', data: updated });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ status: 'success', message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.getUserOrders = async function (req, res) {
  try {
    const orders = await orderService.getUserOrders(req.user.id);
    res.json({ status: "success", data: orders });
  } catch (err) {
    console.error("Fetch Orders Error:", err);
    res.status(500).json({ status: "fail", message: "Could not fetch orders" });
  }
};