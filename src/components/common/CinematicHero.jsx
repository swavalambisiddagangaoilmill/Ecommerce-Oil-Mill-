// Shared CinematicHero component used across pages.
import { motion } from "framer-motion";

export default function CinematicHero({ eyebrow, title, text, image, posterLabel }) {
  return (
    <section className="pt-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative min-h-[420px] overflow-hidden bg-ink shadow-soft sm:min-h-[500px] lg:min-h-[620px]"
      >
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/52 to-ink/16" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 xl:px-10 2xl:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/72">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl font-semibold leading-none text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8">{text}</p>
        </div>
        {posterLabel && (
          <div className="absolute right-5 top-5 rounded-full border border-white/25 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur sm:right-8 sm:top-8">
            {posterLabel}
          </div>
        )}
      </motion.div>
    </section>
  );
}


