// Renders the AccordionMenu layout element.
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function AccordionMenu({ title, links, onClose }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-ink/10">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-left text-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {title}
        <ChevronDown size={18} className={`transition duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="grid gap-1 pb-4">
              {links.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={onClose}
                  className="rounded-xl px-4 py-3 text-base font-medium text-ink/65 transition hover:bg-linen hover:text-leaf"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


