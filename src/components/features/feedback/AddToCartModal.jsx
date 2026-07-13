// Centered add-to-cart confirmation modal for product detail actions.
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SafeImage from "../../common/SafeImage.jsx";
import { formatCurrency } from "../../../utils/formatCurrency.js";

export default function AddToCartModal({ open, product, quantity, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const focusable = document.querySelectorAll('[data-cart-modal] a, [data-cart-modal] button');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.setTimeout(() => closeButtonRef.current?.focus(), 50);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open && product && (
        <motion.div className="fixed inset-0 z-[155] grid place-items-center bg-ink/40 px-4 py-[max(1rem,env(safe-area-inset-top))] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div data-cart-modal role="dialog" aria-modal="true" aria-labelledby="cart-modal-title" className="max-h-[min(88dvh,640px)] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white p-5 shadow-soft sm:p-6" initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.96 }} transition={{ duration: 0.22, ease: "easeOut" }} onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-linen text-leaf"><CheckCircle size={22} /></span>
              <button ref={closeButtonRef} type="button" aria-label="Close add to cart modal" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-linen text-ink transition hover:text-danger"><X size={18} /></button>
            </div>
            <h2 id="cart-modal-title" className="mt-5 font-serif text-3xl font-semibold">Added to cart</h2>
            <div className="mt-5 flex gap-4 rounded-3xl bg-cream p-4">
              <SafeImage src={product.image} alt={product.name} className="h-24 w-24 rounded-2xl object-cover" loading="lazy" />
              <div className="min-w-0 flex-1">
                <p className="font-serif text-2xl font-semibold leading-tight">{product.name}</p>
                <p className="mt-2 text-sm font-semibold text-ink/55">Qty {quantity} · {product.volume}</p>
                <p className="mt-2 font-bold text-ink">{formatCurrency(product.price * quantity)}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link to="/cart" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-white shadow-soft transition hover:bg-leaf"><ShoppingBag size={17} /> View Cart</Link>
              <button type="button" onClick={onClose} className="inline-flex min-h-12 items-center justify-center rounded-full bg-linen px-5 text-sm font-bold text-ink transition hover:text-leaf">Continue Shopping</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}




