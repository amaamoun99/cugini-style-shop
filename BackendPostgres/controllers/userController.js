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
