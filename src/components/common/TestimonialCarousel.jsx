// Reusable rotating testimonials carousel with manual controls.
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function TestimonialCarousel({ items, interval = 4500 }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];
  const previewItems = useMemo(() => items.filter((_, index) => index !== activeIndex).slice(0, 2), [activeIndex, items]);

  const goTo = (index) => setActiveIndex((index + items.length) % items.length);

  useEffect(() => {
    if (items.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [interval, items.length]);

  if (!activeItem) return null;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
      <article className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="flex min-h-[300px] flex-col justify-between sm:min-h-[270px]"
          >
            <div>
              <div className="mb-7 flex items-center gap-1 text-clay" aria-label={`${activeItem.rating} star review`}>
                {Array.from({ length: activeItem.rating }).map((_, index) => (
                  <Star key={index} size={17} fill="currentColor" />
                ))}
              </div>
              <p className="font-serif text-2xl leading-9 text-ink sm:text-3xl sm:leading-[2.9rem]">
                "{activeItem.quote}"
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-5 border-t border-ink/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-ink">{activeItem.name}</p>
                <p className="mt-1 text-sm font-medium text-ink/50">{activeItem.role}</p>
              </div>
              <p className="text-sm font-semibold text-ink/45">{activeItem.review}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </article>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 sm:flex lg:grid lg:grid-cols-1">
          {previewItems.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => goTo(items.findIndex((review) => review.name === item.name))}
              className="rounded-3xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:bg-linen"
            >
              <p className="line-clamp-3 text-sm leading-6 text-ink/65">"{item.quote}"</p>
              <p className="mt-4 text-sm font-semibold text-ink">{item.name}</p>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm">
          <div className="flex gap-2">
            {items.map((item, index) => (
              <button
                key={item.name}
                type="button"
                aria-label={`Show review ${index + 1}`}
                onClick={() => goTo(index)}
                className={`h-2.5 rounded-full transition-all ${index === activeIndex ? "w-7 bg-leaf" : "w-2.5 bg-ink/15 hover:bg-ink/30"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" aria-label="Previous review" onClick={() => goTo(activeIndex - 1)} className="grid h-10 w-10 place-items-center rounded-full bg-linen text-ink transition hover:bg-leaf hover:text-white">
              <ChevronLeft size={18} />
            </button>
            <button type="button" aria-label="Next review" onClick={() => goTo(activeIndex + 1)} className="grid h-10 w-10 place-items-center rounded-full bg-linen text-ink transition hover:bg-leaf hover:text-white">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


