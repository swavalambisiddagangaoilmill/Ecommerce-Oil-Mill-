// Renders the homepage Hero section.
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=2200&q=90",
    alt: "Premium cold pressed oil bottle with olives",
  },
  {
    src: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=2200&q=90",
    alt: "Elegant kitchen ingredients prepared for cooking",
  },
  {
    src: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=2200&q=90",
    alt: "Premium pantry ingredients on a kitchen table",
  },
  {
    src: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=2200&q=90",
    alt: "Golden edible oil and fresh ingredients",
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const goTo = (index) => {
    setActive((index + slides.length) % slides.length);
  };

  return (
    <section
      className="hero-banner group relative w-full overflow-hidden bg-linen"
      aria-label="Featured oil collection"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
      onTouchEnd={(event) => {
        if (touchStart === null) return;
        const distance = touchStart - event.changedTouches[0].clientX;
        if (distance > 48) goTo(active + 1);
        if (distance < -48) goTo(active - 1);
        setTouchStart(null);
      }}
    >
      {slides.map((slide, index) => (
        <motion.img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          loading={index === 0 ? "eager" : "lazy"}
          draggable="false"
          className="absolute inset-0 h-full w-full select-none object-cover"
          initial={false}
          animate={{ opacity: index === active ? 1 : 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        />
      ))}

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => goTo(active - 1)}
        className="absolute left-6 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow-sm transition duration-300 hover:bg-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf group-hover:opacity-100 xl:grid"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => goTo(active + 1)}
        className="absolute right-6 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow-sm transition duration-300 hover:bg-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf group-hover:opacity-100 xl:grid"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 md:bottom-6">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goTo(index)}
            className="h-1.5 w-9 overflow-hidden rounded-full bg-white/45"
          >
            <span
              key={`${active}-${index}`}
              className={`block h-full rounded-full bg-white ${index === active ? "hero-progress" : ""}`}
              style={{
                width: index < active ? "100%" : "0%",
                animationPlayState: paused ? "paused" : "running",
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}



