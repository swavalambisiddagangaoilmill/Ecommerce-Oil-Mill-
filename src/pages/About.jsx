// Renders the About page experience.
import Breadcrumb from "../components/common/Breadcrumb.jsx";
import TestimonialCarousel from "../components/common/TestimonialCarousel.jsx";
import Benefits from "../components/features/home/Benefits.jsx";
import ExtractionProcess from "../components/features/home/ExtractionProcess.jsx";
import Container from "../components/ui/Container.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import { processStepsDetailed, qualityStandards, sustainabilityPoints } from "../data/pageData.js";
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
      <section className="section-padding bg-cream">
        <Container>
          <SectionHeading eyebrow="How we work" title="Sourced, pressed, and packed with care" text="Our process stays simple: careful seed selection, slow extraction, natural settling, protective packing, and fresh dispatch." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {processStepsDetailed.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-3xl bg-white p-5 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-linen text-leaf"><Icon size={19} /></span>
                <h2 className="mt-4 font-serif text-2xl font-semibold">{title}</h2>
                <p className="mt-2 leading-7 text-ink/62">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <article className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="font-serif text-3xl font-semibold">Quality standards</h2>
              <div className="mt-4 grid gap-3">
                {qualityStandards.map((item) => <p key={item} className="rounded-2xl bg-linen px-4 py-3 font-semibold text-ink/70">{item}</p>)}
              </div>
            </article>
            <article className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="font-serif text-3xl font-semibold">Responsible choices</h2>
              <div className="mt-4 grid gap-3">
                {sustainabilityPoints.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex gap-3 rounded-2xl bg-linen p-4">
                    <Icon size={18} className="mt-1 shrink-0 text-leaf" />
                    <p className="text-sm leading-6 text-ink/62"><span className="font-bold text-ink">{title}:</span> {text}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </Container>
      </section>
      <section className="section-padding bg-surface">
        <Container>
          <SectionHeading eyebrow="Customer notes" title="Trusted by modern kitchens" text="Real reviews from families, chefs, and wellness-led homes using Swavalambi Siddaganga Oil Mill in everyday cooking." />
          <TestimonialCarousel items={testimonials} />
        </Container>
      </section>
    </>
  );
}
