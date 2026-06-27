// Provides cart state with 48-hour guest-session persistence.
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { readGuestSession, writeGuestSession } from "../utils/guestSession.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readGuestSession().data.cart);

  useEffect(() => {
    writeGuestSession({ cart: items });
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...current, { ...product, quantity }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setItems((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => setItems((current) => current.filter((item) => item.id !== id));
  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const mrpTotal = items.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
    const discount = mrpTotal - subtotal;
    const shipping = subtotal > 999 || subtotal === 0 ? 0 : 80;
    const tax = Math.round(subtotal * 0.05);
    return { subtotal, mrpTotal, discount, shipping, tax, total: subtotal + shipping + tax };
  }, [items]);

  const isInCart = (id) => items.some((item) => item.id === id);
  const getItemQuantity = (id) => items.find((item) => item.id === id)?.quantity || 0;

  const value = { items, addItem, updateQuantity, removeItem, clearCart, totals, isInCart, getItemQuantity };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

