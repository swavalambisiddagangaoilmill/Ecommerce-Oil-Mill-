// Renders Google Sign In while preserving the existing auth page style.
import { useEffect, useRef, useState } from "react";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function GoogleSignInButton({ onCredential, disabled = false }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!clientId) return undefined;
    const initialize = () => {
      if (!window.google?.accounts?.id || !ref.current) return;
      window.google.accounts.id.initialize({ client_id: clientId, callback: (response) => onCredential?.(response.credential) });
      window.google.accounts.id.renderButton(ref.current, { theme: "outline", size: "large", width: ref.current.offsetWidth || 360, text: "continue_with" });
      setReady(true);
    };
    const existing = document.querySelector('script[data-google-identity="true"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.dataset.googleIdentity = "true";
      script.onload = initialize;
      document.head.appendChild(script);
    } else initialize();
    const timer = window.setInterval(initialize, 300);
    return () => window.clearInterval(timer);
  }, [onCredential]);

  if (!clientId) {
    return <button type="button" disabled className="h-12 w-full rounded-full border border-ink/10 bg-linen text-sm font-bold text-ink/45">Continue with Google</button>;
  }

  return <div aria-disabled={disabled} className={`min-h-12 w-full overflow-hidden rounded-full ${disabled ? "pointer-events-none opacity-60" : ""}`} ref={ref}>{!ready && <div className="grid h-12 place-items-center rounded-full border border-ink/10 text-sm font-bold text-ink/60">Continue with Google</div>}</div>;
}
