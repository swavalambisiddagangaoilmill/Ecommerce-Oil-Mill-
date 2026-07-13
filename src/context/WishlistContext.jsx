// Stores wishlist state synchronized with backend APIs.
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAuthToken } from "../api/apiClient.js";
import { addWishlist, fetchWishlist, removeWishlist } from "../services/wishlistService.js";
import { readGuestSession, writeGuestSession } from "../utils/guestSession.js";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => readGuestSession().data.wishlist);

  useEffect(() => {
    let active = true;
    if (!getAuthToken()) return undefined;
    fetchWishlist().then((wishlist) => active && setItems(wishlist)).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    writeGuestSession({ wishlist: items });
  }, [items]);

  const isWishlisted = (id) => items.some((item) => item.id === id);

  const addWishlistItem = (product) => {
    let saved = false;
    let previousItems = [];
    setItems((current) => {
      previousItems = current;
      if (current.some((item) => item.id === product.id)) return current;
      saved = true;
      return [...current, product];
    });
    if (getAuthToken()) addWishlist(product._id || product.id).then(setItems).catch(() => setItems(previousItems));
    return saved;
  };

  const removeWishlistItem = (id) => {
    let previousItems = [];
    setItems((current) => {
      previousItems = current;
      return current.filter((item) => item.id !== id);
    });
    if (getAuthToken()) removeWishlist(id).then(setItems).catch(() => setItems(previousItems));
  };

  const toggleWishlistItem = (product) => {
    const exists = isWishlisted(product.id);
    if (exists) removeWishlistItem(product.id);
    else addWishlistItem(product);
    return !exists;
  };

  const value = useMemo(() => ({ items, isWishlisted, addWishlistItem, removeWishlistItem, toggleWishlistItem }), [items]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
