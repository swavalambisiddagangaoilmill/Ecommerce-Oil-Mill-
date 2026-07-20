// Stores visitor cookie consent preferences without blocking storefront use.
import { useEffect, useState } from "react";

const STORAGE_KEY = "velora_cookie_consent";
const defaultPrefs = { essential: true, analytics: false, marketing: false };

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [manage, setManage] = useState(false);
  const [prefs, setPrefs] = useState(defaultPrefs);

  useEffect(() => {
    setVisible(!localStorage.getItem(STORAGE_KEY));
  }, []);

  function save(nextPrefs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...nextPrefs, savedAt: new Date().toISOString() }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[150] mx-auto max-w-4xl rounded-3xl border border-ink/10 bg-white/95 p-4 text-ink shadow-soft backdrop-blur sm:p-5" role="dialog" aria-label="Cookie preferences">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-clay">Privacy Preferences</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold">Cookies, kept simple.</h2>
          <p className="mt-2 text-sm leading-6 text-ink/60">Essential cookies keep secure sessions, checkout, cart, and wishlist working. Optional cookies help us improve the storefront experience.</p>
          {manage && (
            <div className="mt-4 grid gap-2 text-sm text-ink/70 sm:grid-cols-3">
              <label className="flex items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-3 font-semibold"><span>Essential</span><input type="checkbox" checked disabled /></label>
              <label className="flex items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-3 font-semibold"><span>Analytics</span><input type="checkbox" checked={prefs.analytics} onChange={(event) => setPrefs((current) => ({ ...current, analytics: event.target.checked }))} /></label>
              <label className="flex items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-3 font-semibold"><span>Marketing</span><input type="checkbox" checked={prefs.marketing} onChange={(event) => setPrefs((current) => ({ ...current, marketing: event.target.checked }))} /></label>
            </div>
          )}
        </div>
        <div className="grid gap-2 sm:grid-cols-3 lg:w-52 lg:grid-cols-1">
          <button type="button" onClick={() => save({ essential: true, analytics: true, marketing: true })} className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-leaf focus:outline-none focus:ring-4 focus:ring-leaf/15">Accept All</button>
          <button type="button" onClick={() => save(defaultPrefs)} className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink transition hover:border-leaf hover:text-leaf focus:outline-none focus:ring-4 focus:ring-leaf/10">Reject Non-Essential</button>
          <button type="button" onClick={() => (manage ? save(prefs) : setManage(true))} className="rounded-full px-5 py-3 text-sm font-bold text-ink/65 transition hover:bg-cream hover:text-leaf focus:outline-none focus:ring-4 focus:ring-leaf/10">{manage ? "Save Preferences" : "Manage Preferences"}</button>
        </div>
      </div>
    </div>
  );
}