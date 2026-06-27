// Renders the MegaMenu layout element.
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function MegaMenu({ menu, open, onNavigate }) {
  const data = menu?.data;
  const isShop = data?.variant === "shop";

  return (
    <motion.div
      className={`absolute left-0 top-[54px] w-full overflow-hidden rounded-b-3xl border border-t-0 border-ink/10 bg-white shadow-soft ${
        open ? "pointer-events-auto visible" : "pointer-events-none invisible"
      }`}
      initial={false}
      animate={{ opacity: open ? 1 : 0, y: open ? 0 : -12 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      aria-hidden={!open}
    >
      {data && (
        <div className="grid gap-6 p-6 xl:grid-cols-[24%_1fr] 2xl:p-7">
          <nav
            aria-label={`${menu.label} links`}
            className={isShop ? "grid content-start gap-2" : "grid content-start gap-2"}
          >
            {data.links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={onNavigate}
                className={
                  isShop
                    ? "flex h-12 items-center rounded-2xl px-5 text-base font-semibold text-ink/75 transition duration-200 hover:bg-linen hover:text-leaf focus-visible:bg-linen focus-visible:text-leaf focus-visible:outline-none"
                    : "flex h-12 items-center rounded-2xl px-5 text-base font-semibold text-ink/75 transition duration-200 hover:bg-linen hover:translate-x-1 hover:text-leaf focus-visible:bg-linen focus-visible:translate-x-1 focus-visible:text-leaf focus-visible:outline-none"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link to={data.banner.href} onClick={onNavigate} className="group grid max-h-[300px] overflow-hidden rounded-3xl bg-linen lg:grid-cols-[0.9fr_1.1fr]">
            <div className="max-h-[300px] overflow-hidden">
              <img
                src={data.banner.image}
                alt={data.banner.title}
                loading="lazy"
                className="h-full min-h-[260px] w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-7 2xl:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">{data.banner.eyebrow}</p>
              <h3 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight text-ink">
                {data.banner.title}
              </h3>
              <p className="mt-3 max-w-xl leading-7 text-ink/60">{data.banner.description}</p>
              <span className="mt-5 inline-flex h-12 w-max items-center gap-2 rounded-xl bg-ink px-6 text-sm font-semibold text-white transition duration-300 group-hover:bg-leaf">
                Shop Now <ArrowRight size={18} />
              </span>
            </div>
          </Link>
        </div>
      )}
    </motion.div>
  );
}
