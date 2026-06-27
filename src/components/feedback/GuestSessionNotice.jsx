// Shows guest-session expiry guidance for locally persisted shoppers.
import { AnimatePresence, motion } from "framer-motion";
import { Clock, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGuestSessionMeta, readGuestSession, writeGuestSession } from "../../utils/guestSession.js";

const SOON_THRESHOLD = 6 * 60 * 60 * 1000;
const DISMISS_COOLDOWN = 60 * 60 * 1000;

export default function GuestSessionNotice() {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const checkSession = () => {
      const session = readGuestSession();
      if (session.expired) {
        setNotice("expired");
        return;
      }
      const meta = getGuestSessionMeta();
      if (!meta) return;
      const data = readGuestSession().data;
      const recentlyDismissed = data.expirationNoticeDismissedAt && Date.now() - data.expirationNoticeDismissedAt < DISMISS_COOLDOWN;
      if (!recentlyDismissed && meta.expiresAt - Date.now() < SOON_THRESHOLD) {
        setNotice("soon");
      }
    };
    checkSession();
    const timer = window.setInterval(checkSession, 60000);
    return () => window.clearInterval(timer);
  }, []);

  const dismiss = () => {
    writeGuestSession({ expirationNoticeDismissedAt: Date.now() });
    setNotice(null);
  };

  return (
    <AnimatePresence>
      {notice && (
        <motion.div className="fixed inset-0 z-[150] grid place-items-center bg-ink/35 px-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div role="dialog" aria-modal="true" aria-labelledby="guest-session-title" className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-soft" initial={{ y: 18, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 18, scale: 0.98 }}>
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-linen text-leaf"><Clock size={21} /></span>
              <button type="button" aria-label="Close guest session notice" onClick={dismiss} className="grid h-10 w-10 place-items-center rounded-full bg-linen text-ink transition hover:text-danger"><X size={18} /></button>
            </div>
            <h2 id="guest-session-title" className="mt-5 font-serif text-3xl font-semibold">{notice === "soon" ? "Guest session expiring soon" : "Guest session expired"}</h2>
            <p className="mt-3 leading-7 text-ink/65">
              {notice === "soon" ? "Your guest session will expire soon. Sign in to permanently save your cart, wishlist and preferences." : "Your guest session expired, so temporary cart and wishlist data was cleared. Create an account to keep everything saved next time."}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link to="/login" onClick={() => setNotice(null)} className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-leaf">Login</Link>
              <button type="button" onClick={dismiss} className="inline-flex h-12 items-center justify-center rounded-full bg-linen px-5 text-sm font-semibold text-ink transition hover:text-leaf">Continue as Guest</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
