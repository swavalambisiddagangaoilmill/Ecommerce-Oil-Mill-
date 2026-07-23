// Renders Google Sign In while preserving the existing auth page style.
import { useEffect, useRef, useState } from "react";
import { useServiceStatus } from "../../../hooks/useServiceStatus.js";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function GoogleSignInButton({ onCredential, disabled = false }) {
  const ref = useRef(null);
  const credentialRef = useRef(onCredential);
  const renderedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const serviceStatus = useServiceStatus();
  const googleAvailable = serviceStatus.services?.googleOAuth?.available !== false;
  const unavailableMessage = serviceStatus.services?.googleOAuth?.message || "Google sign-in is temporarily unavailable.";

  useEffect(() => {
    credentialRef.current = onCredential;
  }, [onCredential]);
  useEffect(() => {
    if (!clientId || !googleAvailable) return undefined;

    const initialize = () => {
      if (renderedRef.current || !window.google?.accounts?.id || !ref.current)
        return false;
      ref.current.replaceChildren();
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => credentialRef.current?.(response.credential),
      });
      window.google.accounts.id.renderButton(ref.current, {
        theme: "outline",
        size: "large",
        width: ref.current.offsetWidth || 360,
        text: "continue_with",
      });
      renderedRef.current = true;
      setReady(true);
      return true;
    };

    const existing = document.querySelector(
      'script[data-google-identity="true"]',
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.dataset.googleIdentity = "true";
      script.onload = initialize;
      document.head.appendChild(script);
    } else {
      initialize();
    }

    const timer = window.setInterval(() => {
      if (initialize()) window.clearInterval(timer);
    }, 300);

    return () => window.clearInterval(timer);
  }, [googleAvailable]);

  if (!clientId || !googleAvailable) {
    return (
      <button
        type="button"
        disabled
        className="h-12 w-full rounded-full border border-ink/10 bg-linen text-sm font-bold text-ink/45"
      >
                Continue with Google
      </button>
    );
  }

  return (
    <div
      aria-disabled={disabled}
      className={`relative min-h-12 w-full overflow-hidden rounded-full ${disabled ? "pointer-events-none opacity-60" : ""}`}
    >
      {!ready && (
        <div className="grid h-12 place-items-center rounded-full border border-ink/10 text-sm font-bold text-ink/60">
          Continue with Google
        </div>
      )}
      <div className={ready ? "" : "absolute inset-0 opacity-0"} ref={ref} />
    </div>
  );
}


