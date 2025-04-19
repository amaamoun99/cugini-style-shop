const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const cartService = require("./cartServices");

exports.loadCheckoutData = async function (cartIdentity) {
  // Validate stock at checkout start to catch any inventory changes
  const stockValidation = await cartService.validateCartStock(cartIdentity);
  if (!stockValidation.valid) {
    const itemNames = stockValidation.invalidItems.map(item => 
      `${item.productName} (requested: ${item.requested}, available: ${item.available})`
    ).join(", ");
    throw new Error(`Some items in your cart are no longer available in requested quantities: ${itemNames}`);
  }

  const cart = await cartService.getOrCreateCart(cartIdentity);
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");
  return cart;
};

exports.validateCartAndAddress = async function (cartIdentity, shippingAddress) {
  // Basic address validation
  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
    throw new Error("Invalid address");
  }

  // Revalidate stock at this step too
  const stockValidation = await cartService.validateCartStock(cartIdentity);
  if (!stockValidation.valid) {
    const itemNames = stockValidation.invalidItems.map(item => 
      `${item.productName} (requested: ${item.requested}, available: ${item.available})`
    ).join(", ");
    throw new Error(`Some items in your cart are no longer available in requested quantities: ${itemNames}`);
  }
};

exports.calculateCartTotal = async function (cartIdentity) {
  const cart = await cartService.getOrCreateCart(cartIdentity);
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
  guestName,
  userId
) {
  return prisma.$transaction(async (tx) => {
    try {
      // We need to get the cart and validate stock within the transaction 
      // to ensure consistency
      const cart = await cartService._getOrCreateCartTx(cartIdentity, tx);
  
      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }
  
      if (!shippingAddress || !shippingAddress.street) {
        throw new Error("Invalid shipping address");
      }

      // Calculate total (could also move this into transaction for maximum safety)
      let subtotal = 0;
      for (let item of cart.items) {
        subtotal += item.quantity * item.variant.product.price;
      }
      const shipping = 75;
      const total = subtotal + shipping;
  
      // Determine the user ID for this order - use authenticated userId if provided, otherwise try cart.userId
      const authenticatedUserId = userId || cart.userId;
      console.log('Creating order with userId:', authenticatedUserId || 'Guest order');
      
      // Create address first
      const newAddress = await tx.address.create({
        data: {
          userId: authenticatedUserId,
          ...shippingAddress,
        },
      });
      
      // Create order
      const createdOrder = await tx.order.create({
        data: {
          userId: authenticatedUserId, // Use the authenticated user ID if provided
          guestEmail: email,
          guestPhone: phoneNumber,
          guestName: guestName,
          addressId: newAddress.id,
          totalAmount: total,
          status: "pending",
        },
      });
  
      // Process each item, updating inventory with pessimistic locking
      for (let item of cart.items) {
        // Lock the row to prevent concurrent updates
        // This is PostgreSQL-specific FOR UPDATE locking
        const lockedVariant = await tx.$queryRaw`
          SELECT * FROM "ProductVariant"
          WHERE id = ${item.variantId}
          FOR UPDATE
        `;
  
        // Now fetch the variant data
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });
  
        if (!variant) {
          throw new Error(`Product variant ${item.variantId} not found`);
        }
  
        // Verify sufficient stock within transaction
        if (variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${variant.product.name} (${variant.sku}). Only ${variant.stock} available.`);
        }
  
        // Create order item
        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            variantId: item.variantId,
            quantity: item.quantity,
            price: variant.product.price,
          },
        });
  
        // Update stock (decrement by purchased quantity)
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }
  
      // Create payment record
      if (paymentMethod) {
        await tx.payment.create({
          data: {
            orderId: createdOrder.id,
            method: paymentMethod,
            status: "unpaid",
          },
        });
      }
  
      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
  
      // Return created order with all details
      return tx.order.findUnique({
        where: { id: createdOrder.id },
        include: {
          orderItems: {
            include: {
              variant: {
                include: { product: true }
              }
            }
          },
          payment: true,
          address: true
        }
      });
    } catch (error) {
      // All changes will be rolled back automatically on error
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }, {
    // Set a longer timeout for checkout process
    // PostgreSQL default is typically ~30s but for complex checkouts with many items
    // it might be good to have more time
    timeout: 60000, // 60 seconds
    
    // Using the default isolation level (READ COMMITTED) for most databases
    // For stricter isolation (prevents phantom reads) you could use:
    // isolation: 'serializable'
  });
};

// New method to reserve inventory temporarily (optional)
exports.reserveInventory = async function(cartIdentity, durationMinutes = 15) {
  // This would implement a temporary hold system for inventory
  // Could be implemented if needed in the future
};