// Provides cart state synchronized with backend cart APIs.
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAuthToken } from "../api/apiClient.js";
import { addCartItem, clearCartApi, fetchCart, removeCartItem, updateCartItem } from "../services/cartService.js";
import { readGuestSession, writeGuestSession } from "../utils/guestSession.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readGuestSession().data.cart);

  useEffect(() => {
    let active = true;
    if (!getAuthToken()) return undefined;
    fetchCart().then((cart) => active && setItems(cart)).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    writeGuestSession({ cart: items });
  }, [items]);

  const addItem = (product, quantity = 1) => {
    let previousItems = [];
    setItems((current) => {
      previousItems = current;
      const existing = current.find((item) => item.id === product.id);
      return existing ? current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)) : [...current, { ...product, quantity }];
    });
    if (getAuthToken()) addCartItem(product._id || product.id, quantity).then(setItems).catch(() => setItems(previousItems));
  };

  const updateQuantity = (id, quantity) => {
    let previousItems = [];
    setItems((current) => {
      previousItems = current;
      return current.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item));
    });
    if (getAuthToken()) updateCartItem(id, quantity).then(setItems).catch(() => setItems(previousItems));
  };

  const removeItem = (id) => {
    let previousItems = [];
    setItems((current) => {
      previousItems = current;
      return current.filter((item) => item.id !== id);
    });
    if (getAuthToken()) removeCartItem(id).then(setItems).catch(() => setItems(previousItems));
  };

  const clearCart = () => {
    const previousItems = items;
    setItems([]);
    if (getAuthToken()) clearCartApi().then(setItems).catch(() => setItems(previousItems));
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const mrpTotal = items.reduce((sum, item) => sum + (item.mrp || item.price) * item.quantity, 0);
    const discount = mrpTotal - subtotal;
    const shipping = subtotal > 999 || subtotal === 0 ? 0 : 80;
    const tax = Math.round(subtotal * 0.05);
    return { subtotal, mrpTotal, discount, shipping, tax, total: subtotal + shipping + tax };
  }, [items]);

  const isInCart = (id) => items.some((item) => item.id === id);
  const getItemQuantity = (id) => items.find((item) => item.id === id)?.quantity || 0;

  return <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, totals, isInCart, getItemQuantity }}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
