// Renders accessible FAQ accordion interactions.
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FaqAccordion({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-ink/10 bg-white shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left font-semibold text-ink transition hover:text-leaf focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf sm:px-5"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{item.q}</span>
        <ChevronDown size={18} className={`shrink-0 transition duration-300 ${open ? "rotate-180 text-leaf" : "text-ink/45"}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-5 leading-7 text-ink/62 sm:px-5">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



