// Renders the homepage Categories section.
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { categoryTiles } from "../../data/siteData.js";
import Container from "../ui/Container.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";

export default function Categories() {
  return (
    <section className="py-12 md:py-16 xl:py-20">
      <Container>
        <div className="[&>div]:mb-7 [&_h2]:text-3xl [&_p:last-child]:mt-4 [&_p:last-child]:text-base [&_p:last-child]:leading-7 lg:[&_h2]:text-4xl">
          <SectionHeading eyebrow="Shop by ritual" title="Choose oils by how your kitchen lives" text="From daily tadkas to conscious wellness routines, every bottle is pressed for a distinct rhythm of use." />
        </div>
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-5">
          {categoryTiles.map((category, index) => (
            <motion.div key={category.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
              <Link to="/shop" className="group block overflow-hidden rounded-3xl bg-white shadow-sm">
                <div className="aspect-[4/4.35] overflow-hidden sm:aspect-[4/4.6] lg:aspect-[4/4.75]">
                  <img src={category.image} alt={category.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-3.5 sm:p-4">
                  <h3 className="font-serif text-xl font-semibold leading-tight md:text-2xl">{category.name}</h3>
                  <p className="mt-1.5 text-xs font-medium text-ink/55 sm:text-sm">Explore collection</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
