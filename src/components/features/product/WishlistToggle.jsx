// Reusable Instagram-style wishlist heart toggle.
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useToast } from "../feedback/ToastProvider.jsx";
import { useWishlist } from "../../../context/WishlistContext.jsx";

export default function WishlistToggle({ product, className = "", size = 18, labelPrefix = "Wishlist" }) {
  const { isWishlisted, toggleWishlistItem } = useWishlist();
  const { showToast } = useToast();
  const active = isWishlisted(product.id);

  const handleToggle = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const added = toggleWishlistItem(product);
    showToast(added ? "Saved to Wishlist" : "Removed from Wishlist", "wishlist", null, { id: `wishlist-${product.id}` });
  };

  return (
    <motion.button
      type="button"
      aria-label={`${labelPrefix} ${product.name}`}
      aria-pressed={active}
      onClick={handleToggle}
      whileTap={{ scale: 0.82 }}
      animate={{ scale: active ? [1, 1.18, 1] : 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`grid place-items-center rounded-full bg-white/95 text-ink shadow-sm transition hover:text-leaf focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf ${active ? "text-leaf" : ""} ${className}`}
    >
      <Heart size={size} fill={active ? "currentColor" : "none"} />
    </motion.button>
  );
}



