// Shows a delayed top progress line without shifting the header.
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function RouteTransitionLoader() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer;
    const showTimer = window.setTimeout(() => {
      setVisible(true);
      hideTimer = window.setTimeout(() => setVisible(false), 320);
    }, 120);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
      setVisible(false);
    };
  }, [location.pathname, location.search]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-0.5 overflow-hidden bg-transparent"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.18 }}
    >
      <motion.span className="block h-full origin-left bg-leaf" initial={{ scaleX: 0 }} animate={{ scaleX: visible ? 1 : 0 }} transition={{ duration: 0.32, ease: "easeOut" }} />
    </motion.div>
  );
}



