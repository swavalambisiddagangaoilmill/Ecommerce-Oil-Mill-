// Shows the Namaste intro loader once per browser session.
import { useEffect, useState } from "react";

export default function IntroLoader() {
  const [visible, setVisible] = useState(
    () => sessionStorage.getItem("veloraIntroSeen") !== "true",
  );

  useEffect(() => {
    if (!visible) return undefined;
    const timer = window.setTimeout(() => {
      sessionStorage.setItem("veloraIntroSeen", "true");
      setVisible(false);
    }, 9950);
    return () => window.clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[140] grid place-items-center bg-cream text-center">
      <div className="animate-[loader-pop_900ms_ease-out_forwards]">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white shadow-soft">
          <span className="h-10 w-10 rounded-full bg-leaf/15 ring-1 ring-leaf/25" />
        </div>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.28em] text-clay">
          Namaste
        </p>
        <p className="mt-3 font-serif text-5xl font-semibold text-ink">
          Velora
        </p>
        <p className="mt-3 text-sm font-semibold text-ink/45">
          Cold pressed pantry rituals
        </p>
      </div>
    </div>
  );
}
