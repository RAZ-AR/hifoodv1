import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MenuItem } from '@/types';

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem, quantityChange?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  getItemQuantity: (itemId: string) => number;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem, quantityChange: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.item.id === item.id);

      if (existingItem) {
        // Изменяем количество (может быть как +1, так и -1)
        const newQuantity = existingItem.quantity + quantityChange;

        if (newQuantity <= 0) {
          // Удаляем если количество стало 0 или меньше
          return prevItems.filter((cartItem) => cartItem.item.id !== item.id);
        }

        return prevItems.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
      } else {
        // Добавляем новый товар только если quantityChange положительное
        if (quantityChange > 0) {
          return [...prevItems, { item, quantity: quantityChange }];
        }
        return prevItems;
      }
    });
  };

  const getItemQuantity = (itemId: string): number => {
    const cartItem = cartItems.find((item) => item.item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((cartItem) => cartItem.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem.item.id === itemId ? { ...cartItem, quantity } : cartItem
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, cartItem) => {
      return total + cartItem.item.price * cartItem.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
