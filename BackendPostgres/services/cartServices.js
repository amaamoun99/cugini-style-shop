const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

class CartService {
  async getOrCreateCart({ userId, sessionId }) {
    console.log("🛒 Looking for cart with:", { userId, sessionId });

    let cart = await prisma.cart.findFirst({
      where: {
        OR: [
          { userId: userId || undefined },
          { sessionId: sessionId || undefined },
        ],
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      console.log("📦 No cart found. Creating new one...");
      cart = await prisma.cart.create({
        data: {
          userId,
          sessionId,
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async addItemToCart({ userId, sessionId, variantId, quantity }) {
    try {
      const cart = await this.getOrCreateCart({ userId, sessionId });

      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          variantId,
        },
      });

      if (existingItem) {
        return await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + quantity,
          },
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        });
      }

      return await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
        },
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to add item to cart: ${error.message}`);
    }
  }

  async updateCartItem(id, quantity) {
    try {
      if (quantity <= 0) {
        return await prisma.cartItem.delete({
          where: { id },
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        });
      }

      return await prisma.cartItem.update({
        where: { id },
        data: { quantity },
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to update cart item: ${error.message}`);
    }
  }

  async removeCartItem(id) {
    try {
      return await prisma.cartItem.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to remove cart item: ${error.message}`);
    }
  }

  async clearCart({ userId, sessionId }) {
    try {
      const cart = await prisma.cart.findFirst({
        where: {
          OR: [
            { userId: userId || undefined },
            { sessionId: sessionId || undefined },
          ],
        },
      });

      if (cart) {
        return await prisma.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }

      return null;
    } catch (error) {
      throw new Error(`Failed to clear cart: ${error.message}`);
    }
  }
}

module.exports = new CartService();
