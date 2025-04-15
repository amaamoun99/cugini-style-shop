// api/controllers/orders.controller.js
const orderService = require("../services/orderServices");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");


exports.getOrderDetails = async function (req, res) {
  const { id } = req.params;
  try {
    const order = await orderService.getOrderById(id);

    if (!order || order.userId !== req.user.id) {
      return res
        .status(404)
        .json({ status: "fail", message: "Order not found" });
    }

    res.json({ status: "success", data: order });
  } catch (err) {
    console.error("Order Details Error:", err);
    res.status(500).json({ status: "fail", message: "Could not fetch order" });
  }
};

exports.getOrderStatus = async function (req, res) {
  const { id } = req.params;
  try {
    const order = await orderService.getOrderStatus(id);

    if (!order || order.userId !== req.user.id) {
      return res
        .status(404)
        .json({ status: "fail", message: "Order not found" });
    }

    res.json({ status: "success", data: { status: order.status } });
  } catch (err) {
    console.error("Order Status Error:", err);
    res.status(500).json({ status: "fail", message: "Could not fetch status" });
  }
};

///////////////////////////////////////////////////////////////////////
//////////////////admin controllers///////////////////////
exports.getAllOrders = async (req, res) => {
  console.log("Fetching all orders...");
  try {
    const orders = await prisma.Order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        payment: true,
        address: true,
      },
    });
    res.json({ status: "success", data: orders });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        orderItems: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        payment: true,
        address: true,
      },
    });
    if (!order)
      return res
        .status(404)
        .json({ status: "fail", message: "Order not found" });
    res.json({ status: "success", data: order });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status: req.body.status,
      },
    });
    res.json({ status: "success", data: updated });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await prisma.order.delete({ where: { id: req.params.id } });
    res.json({ status: "success", message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
