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
                    images: true,
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
    return prisma.$transaction(async (tx) => {
      try {
        // Get or create cart within transaction scope
        const cart = await this._getOrCreateCartTx({ userId, sessionId }, tx);
        
        // Check product variant availability (without locking yet)
        const variant = await tx.productVariant.findUnique({
          where: { id: variantId },
          include: {
            product: true
          }
        });

        if (!variant) {
          throw new Error("Product variant not found");
        }

        // Check stock availability - Since we only update stock at checkout, 
        // we just verify the current stock is sufficient
        if (variant.stock <= 0) {
          throw new Error("This product is out of stock");
        }

        // Find existing cart item if any
        const existingItem = await tx.cartItem.findFirst({
          where: {
            cartId: cart.id,
            variantId,
          },
        });

        let updatedItem;
        if (existingItem) {
          // Check stock for combined quantity
          const totalQuantity = existingItem.quantity + quantity;
          
          if (totalQuantity > variant.stock) {
            throw new Error(`Cannot add ${quantity} more units. Only ${variant.stock} units available in total.`);
          }
          
          // Update existing cart item
          updatedItem = await tx.cartItem.update({
            where: { id: existingItem.id },
            data: {
              quantity: totalQuantity,
            },
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          });
        } else {
          // Check if requested quantity is available
          if (quantity > variant.stock) {
            throw new Error(`Cannot add ${quantity} units. Only ${variant.stock} units available.`);
          }
          
          // Create new cart item
          updatedItem = await tx.cartItem.create({
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
        }

        return updatedItem;
      } catch (error) {
        throw new Error(`Failed to add item to cart: ${error.message}`);
      }
    });
  }

  // Internal method to get or create cart within a transaction
  async _getOrCreateCartTx({ userId, sessionId }, tx) {
    let cart = await tx.cart.findFirst({
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
                product: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await tx.cart.create({
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

  async updateCartItem(id, quantity) {
    return prisma.$transaction(async (tx) => {
      try {
        // Get the cart item
        const cartItem = await tx.cartItem.findUnique({
          where: { id },
          include: {
            variant: {
              include: {
                product: true,
              }
            }
          }
        });

        if (!cartItem) {
          throw new Error("Cart item not found");
        }

        // Handle zero or negative quantity as delete
        if (quantity <= 0) {
          return await tx.cartItem.delete({
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

        // Check stock availability
        if (quantity > cartItem.variant.stock) {
          throw new Error(`Cannot update to ${quantity} units. Only ${cartItem.variant.stock} units available.`);
        }

        // Update cart item
        return await tx.cartItem.update({
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
    });
  }

  async removeCartItem(id) {
    return prisma.$transaction(async (tx) => {
      try {
        const cartItem = await tx.cartItem.findUnique({
          where: { id }
        });

        if (!cartItem) {
          throw new Error("Cart item not found");
        }

        return await tx.cartItem.delete({
          where: { id },
        });
      } catch (error) {
        throw new Error(`Failed to remove cart item: ${error.message}`);
      }
    });
  }

  async clearCart({ userId, sessionId }) {
    return prisma.$transaction(async (tx) => {
      try {
        const cart = await tx.cart.findFirst({
          where: {
            OR: [
              { userId: userId || undefined },
              { sessionId: sessionId || undefined },
            ],
          },
        });

        if (cart) {
          return await tx.cartItem.deleteMany({
            where: { cartId: cart.id },
          });
        }

        return null;
      } catch (error) {
        throw new Error(`Failed to clear cart: ${error.message}`);
      }
    });
  }

  // New method to validate cart items against current stock
  async validateCartStock({ userId, sessionId }) {
    return prisma.$transaction(async (tx) => {
      const cart = await this._getOrCreateCartTx({ userId, sessionId }, tx);
      
      if (!cart.items || cart.items.length === 0) {
        return { valid: true, invalidItems: [] };
      }
      
      const invalidItems = [];
      
      for (const item of cart.items) {
        // Fresh check of current stock
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true }
        });
        
        if (!variant || variant.stock < item.quantity) {
          invalidItems.push({
            itemId: item.id,
            variantId: item.variantId,
            requested: item.quantity,
            available: variant ? variant.stock : 0,
            productName: variant?.product?.name || 'Unknown product'
          });
        }
      }
      
      return { 
        valid: invalidItems.length === 0,
        invalidItems
      };
    });
  }
}

module.exports = new CartService();