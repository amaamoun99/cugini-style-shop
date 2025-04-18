import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { fetchCart, addCartItem, updateCartItem, deleteCartItem, clearCart as clearCartApi } from '@/api/cart';

interface CartItem {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  variant: {
    id: string;
    productId: string;
    size: string;
    color?: string;
    stock: number;
    sku?: string;
    product: {
      id: string;
      name: string;
      price: number;
      description?: string;
      images: Array<{
        id: string;
        productId: string;
        url: string;
        altText?: string;
      }>;
    };
  };
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  loading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const cartData = await fetchCart();
      const items = cartData.items || [];
      setCartItems(items);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  // Calculate total number of items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Add wrapper functions to update cart and automatically refresh the cart data
  const addItem = async (variantId: string, quantity: number) => {
    try {
      await addCartItem(variantId, quantity);
      await refreshCart();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  };

  const updateItem = async (itemId: string, quantity: number) => {
    try {
      await updateCartItem(itemId, quantity);
      await refreshCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await deleteCartItem(itemId);
      await refreshCart();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  };
  
  const clearCart = async () => {
    try {
      await clearCartApi();
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        error,
        refreshCart,
        addItem,
        updateItem,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
