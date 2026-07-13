// Shared cart-aware Add to Cart button with duplicate confirmation.
import { AnimatePresence, motion } from "framer-motion";
import { Check, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../feedback/ToastProvider.jsx";
import { useCart } from "../../../hooks/useCart.jsx";
import Button from "../../ui/Button.jsx";

export default function AddToCartButton({ product, quantity = 1, className = "", iconSize = 18, onAdded }) {
  const { items, addItem } = useCart();
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);
  const cancelRef = useRef(null);
  const inCart = items.some((item) => item.id === product.id);

  const confirmAdd = (amount = quantity) => {
    if (loading) return;
    setLoading(true);
    addItem(product, amount);
    setPulse(true);
    showToast("Added to Cart", "cart", { label: "View Cart", to: "/cart" }, { id: `cart-${product.id}` });
    window.setTimeout(() => setPulse(false), 420);
    window.setTimeout(() => setLoading(false), 260);
    onAdded?.();
  };

  const handleClick = () => {
    if (loading) return;
    if (inCart) {
      setConfirmOpen(true);
      return;
    }
    confirmAdd(quantity);
  };

  useEffect(() => {
    if (!confirmOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setConfirmOpen(false);
    };
    window.setTimeout(() => cancelRef.current?.focus(), 40);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [confirmOpen]);

  return (
    <div className="relative">
      <motion.div animate={{ scale: pulse ? [1, 1.035, 1] : 1 }} transition={{ duration: 0.35 }}>
        <Button disabled={loading || product.stock === 0} loading={loading} className={className} onClick={handleClick}>
          {inCart ? <Check size={iconSize} /> : <ShoppingBag size={iconSize} />}
          {inCart ? "Added to Cart" : "Add to Cart"}
        </Button>
      </motion.div>
      <AnimatePresence>
        {confirmOpen && (
          <motion.div className="fixed inset-0 z-[160] grid place-items-center bg-ink/25 px-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setConfirmOpen(false)}>
            <motion.div role="dialog" aria-modal="true" aria-labelledby={`cart-confirm-${product.id}`} className="w-full max-w-sm rounded-[1.75rem] bg-white p-5 shadow-soft" initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} transition={{ duration: 0.2 }} onMouseDown={(event) => event.stopPropagation()}>
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-linen text-leaf"><ShoppingBag size={19} /></span>
                <button type="button" aria-label="Close add one more confirmation" onClick={() => setConfirmOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-linen text-ink transition hover:text-danger"><X size={16} /></button>
              </div>
              <h2 id={`cart-confirm-${product.id}`} className="mt-4 font-serif text-3xl font-semibold">Already in your cart</h2>
              <p className="mt-3 leading-7 text-ink/65">This product is already in your cart. Would you like to add one more?</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => { confirmAdd(1); setConfirmOpen(false); }} className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-5 text-sm font-bold text-white transition hover:bg-leaf">Add One More</button>
                <button ref={cancelRef} type="button" onClick={() => setConfirmOpen(false)} className="inline-flex min-h-12 items-center justify-center rounded-full bg-linen px-5 text-sm font-bold text-ink transition hover:text-leaf">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



