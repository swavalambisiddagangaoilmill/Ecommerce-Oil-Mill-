// Adds right-click protection and a lightweight DevTools warning.
import { useEffect, useState } from "react";

export default function SecurityAwareness() {
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    const blockContextMenu = (event) => event.preventDefault();
    const checkDevTools = () => {
      const opened = window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160;
      setWarning(opened);
    };

    document.addEventListener("contextmenu", blockContextMenu);
    const interval = window.setInterval(checkDevTools, 1200);
    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      window.clearInterval(interval);
    };
  }, []);

  if (!warning) return null;

  return (
    <div className="fixed left-1/2 top-4 z-[130] w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border border-clay/20 bg-white p-4 text-center text-sm font-semibold text-ink shadow-soft">
      Developer tools appear to be open. Avoid sharing private customer or payment data.
    </div>
  );
}
