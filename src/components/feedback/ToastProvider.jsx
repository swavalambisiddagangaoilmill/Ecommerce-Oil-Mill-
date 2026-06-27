// Provides lightweight toast notifications for storefront feedback.
import { createContext, useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, tone = "success", action = null) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, tone, action }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-[120] grid w-[min(92vw,360px)] gap-3" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-2xl border p-4 text-sm font-semibold shadow-soft ${
              toast.tone === "error" ? "border-danger/20 bg-white text-danger" : "border-leaf/20 bg-white text-ink"
            }`}
          >
            {toast.message}
            {toast.action && (
              <Link to={toast.action.to} className="mt-3 inline-flex rounded-full bg-linen px-3 py-1 text-xs font-bold text-ink transition hover:text-leaf">
                {toast.action.label}
              </Link>
            )}
          </div>
        ))}
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
