// api/services/orders.service.js
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

exports.getUserOrders = async function (userId) {
  return prisma.order.findMany({
    where: { userId: userId },
    include: {
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
    orderBy: {
      createdAt: "desc",
    },
  });
};

exports.getOrderById = async function (orderId) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
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
};

exports.getOrderStatus = async function (orderId) {
  return prisma.order.findUnique({
    where: { id: orderId },
    select: {
      status: true,
      userId: true,
    },
  });
};
