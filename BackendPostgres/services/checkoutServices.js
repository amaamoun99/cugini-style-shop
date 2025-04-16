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
  paymentMethod,
  email,
  phoneNumber,
  guestName
) {
  const cart = await getOrCreateCart(cartIdentity);
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

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

    const createdOrder = await tx.order.create({
      data: {
        userId: cart.userId,
        guestEmail: cart.userId ? null : email,
        guestPhone: cart.userId ? null : phoneNumber,
        guestName: cart.userId ? null : guestName,
        addressId: newAddress.id,
        totalAmount: total.total,
        status: "pending",
      },
    });

    for (let item of cart.items) {
      // Make sure item.variant includes the `product` price!
      const variant = await tx.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      await tx.orderItem.create({
        data: {
          orderId: createdOrder.id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: variant.product.price, // corrected this!
        },
      });

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

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return createdOrder;
  });

  return order;
};

