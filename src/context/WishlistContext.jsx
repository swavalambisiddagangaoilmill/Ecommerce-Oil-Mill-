// Stores lightweight wishlist state for the floating wishlist popup.
import { createContext, useContext, useMemo, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  const addWishlistItem = (product) => {
    setItems((current) => (current.some((item) => item.id === product.id) ? current : [...current, product]));
  };

  const removeWishlistItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const value = useMemo(() => ({ items, addWishlistItem, removeWishlistItem }), [items]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
