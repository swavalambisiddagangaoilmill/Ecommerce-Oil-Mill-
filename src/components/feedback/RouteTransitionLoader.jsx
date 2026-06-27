// Shows a short skeleton during route changes so loading states are visible.
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function RouteTransitionLoader() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 380);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[110] bg-cream/90 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-screen-2xl gap-3">
        <span className="h-2 flex-1 animate-pulse rounded-full bg-linen" />
        <span className="h-2 w-24 animate-pulse rounded-full bg-linen" />
      </div>
    </div>
  );
}
