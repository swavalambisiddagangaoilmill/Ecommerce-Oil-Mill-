// Provides unified toast notifications for storefront feedback.
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, Heart, ShoppingBag } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

const ToastContext = createContext(null);
const icons = { success: CheckCircle, error: AlertCircle, wishlist: Heart, cart: ShoppingBag };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismissToast = useCallback((id) => {
    window.clearTimeout(timersRef.current.get(id));
    timersRef.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, tone = "success", action = null, options = {}) => {
    const id = options.id || `${tone}-${message}`;
    setToasts((current) => {
      const next = current.filter((toast) => toast.id !== id).slice(-2);
      return [...next, { id, message, tone, action }];
    });
    window.clearTimeout(timersRef.current.get(id));
    timersRef.current.set(id, window.setTimeout(() => dismissToast(id), options.duration || 3200));
  }, [dismissToast]);

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  const value = useMemo(() => ({ showToast, dismissToast }), [dismissToast, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-[140] grid w-[min(92vw,380px)] gap-3" aria-live="polite" aria-relevant="additions">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const Icon = icons[toast.tone] || icons.success;
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="rounded-[1.35rem] border border-ink/10 bg-white p-4 text-ink shadow-soft"
              >
                <div className="flex items-start gap-3">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${toast.tone === "error" ? "bg-danger/10 text-danger" : "bg-linen text-leaf"}`}><Icon size={19} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold leading-6">{toast.message}</p>
                    {toast.action && (
                      <Link to={toast.action.to} onClick={() => dismissToast(toast.id)} className="mt-3 inline-flex rounded-full bg-ink px-4 py-2 text-xs font-bold text-white transition hover:bg-leaf">
                        {toast.action.label}
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}



