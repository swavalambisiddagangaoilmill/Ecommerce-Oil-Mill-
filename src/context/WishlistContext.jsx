// Stores wishlist state with 48-hour guest-session persistence.
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { readGuestSession, writeGuestSession } from "../utils/guestSession.js";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => readGuestSession().data.wishlist);

  useEffect(() => {
    writeGuestSession({ wishlist: items });
  }, [items]);

  const isWishlisted = (id) => items.some((item) => item.id === id);

  const addWishlistItem = (product) => {
    let saved = false;
    setItems((current) => {
      if (current.some((item) => item.id === product.id)) return current;
      saved = true;
      return [...current, product];
    });
    return saved;
  };

  const removeWishlistItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const toggleWishlistItem = (product) => {
    let nextState = true;
    setItems((current) => {
      const exists = current.some((item) => item.id === product.id);
      nextState = !exists;
      return exists ? current.filter((item) => item.id !== product.id) : [...current, product];
    });
    return nextState;
  };

  const value = useMemo(() => ({ items, isWishlisted, addWishlistItem, removeWishlistItem, toggleWishlistItem }), [items]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
