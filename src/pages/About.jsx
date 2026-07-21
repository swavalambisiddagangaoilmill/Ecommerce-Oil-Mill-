// Renders the About page experience.
import Breadcrumb from "../components/common/Breadcrumb.jsx";
import TestimonialCarousel from "../components/common/TestimonialCarousel.jsx";
import Benefits from "../components/features/home/Benefits.jsx";
import ExtractionProcess from "../components/features/home/ExtractionProcess.jsx";
import Container from "../components/ui/Container.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import { testimonials } from "../data/siteData.js";

export default function About() {
  return (
    <>
      <Breadcrumb items={[{ label: "About" }]} />
      <section className="section-padding">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">Brand story</p>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight lg:text-6xl">A premium oil house built around patience.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/65">Swavalambi Siddaganga Oil Mill exists to make traditional cold pressed oils feel reliable, elegant, and deeply useful in modern kitchens. Our mission is to protect taste, our vision is a cleaner pantry standard, and our process is intentionally slow.</p>
          </div>
          <img src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1400&q=85" alt="Fresh food prepared with oil" className="aspect-[4/3] rounded-3xl object-cover shadow-soft" />
        </Container>
      </section>
      <Benefits />
      <ExtractionProcess />
      <section className="section-padding bg-surface">
        <Container>
          <SectionHeading eyebrow="Customer notes" title="Trusted by modern kitchens" text="Real reviews from families, chefs, and wellness-led homes using Swavalambi Siddaganga Oil Mill in everyday cooking." />
          <TestimonialCarousel items={testimonials} />
        </Container>
      </section>
    </>
  );
}


