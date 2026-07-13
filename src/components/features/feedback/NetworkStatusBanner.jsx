// Shows global offline and reconnecting reliability states.
import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export default function NetworkStatusBanner() {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (online) return null;

  return (
    <div className="sticky top-0 z-[90] flex items-center justify-center gap-2 bg-ink px-4 py-3 text-sm font-semibold text-white">
      <WifiOff size={17} /> You are offline. Some actions may not complete until your connection returns.
    </div>
  );
}



