const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const { getOrCreateCart } = require("./cartServices");

exports.loadCheckoutData = async function (cartIdentity) {
  const cart = await getOrCreateCart(cartIdentity);
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");
  return cart;
};

exports.validateCartAndAddress = async function (
  cartIdentity,
  shippingAddress
) {
  const cart = await getOrCreateCart(cartIdentity);
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  // Basic address validation
  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
    throw new Error("Invalid address");
  }

  // Optional: Check item stock
  for (let item of cart.items) {
    if (item.variant.stock < item.quantity) {
      throw new Error(`Insufficient stock for SKU ${item.variant.sku}`);
    }
  }
};

exports.calculateCartTotal = async function (cartIdentity) {
  const cart = await getOrCreateCart(cartIdentity);
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  let subtotal = 0;
  for (let item of cart.items) {
    subtotal += item.quantity * item.variant.product.price;
  }

  const shipping = 30; // for example
  const total = subtotal + shipping;

  return { subtotal, shipping, total };
};

exports.createOrder = async function (
  cartIdentity,
  shippingAddress,
  paymentMethod
) {
  const cart = await getOrCreateCart(cartIdentity);
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  // Validate address again
  if (!shippingAddress || !shippingAddress.street) {
    throw new Error("Invalid shipping address");
  }

  const total = await this.calculateCartTotal(cartIdentity);

  const order = await prisma.$transaction(async (tx) => {
    const newAddress = await tx.address.create({
      data: {
        userId: cart.userId,
        ...shippingAddress,
      },
    });

    const createdOrder = await tx.Order.create({
      data: {
        userId: cart.userId,
        guestEmail: cart.userId ? null : "guest@example.com",
        addressId: newAddress.id,
        totalAmount: total.total,
        status: "pending",
      },
    });

    for (let item of cart.items) {
      await tx.OrderItem.create({
        data: {
          orderId: createdOrder.id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.variant.product.price,
        },
      });

      // Reduce stock
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    if (paymentMethod) {
      await tx.payment.create({
        data: {
          orderId: createdOrder.id,
          method: paymentMethod,
          status: "unpaid",
        },
      });
    }

    // Clear cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return createdOrder;
  });

  return order;
};
