// Reusable SectionHeading UI primitive.
import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, text, align = "center" }) {
  const alignment = align === "left" ? "items-start text-left" : "items-center text-center";
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`mx-auto mb-10 flex max-w-3xl flex-col ${alignment}`}
    >
      {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-clay">{eyebrow}</p>}
      <h2 className="font-serif text-3xl font-semibold leading-tight text-ink lg:text-5xl">{title}</h2>
      {text && <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/65">{text}</p>}
    </motion.div>
  );
}


