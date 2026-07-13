// Renders the homepage StorySection section.
import Container from "../../ui/Container.jsx";
import SectionHeading from "../../ui/SectionHeading.jsx";

export default function StorySection() {
  return (
    <section className="section-padding bg-surface">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl shadow-soft">
          <img src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1300&q=85" alt="Traditional kitchen ingredients" loading="lazy" className="aspect-[4/3] h-full w-full object-cover" />
        </div>
        <div>
          <SectionHeading align="left" eyebrow="Our story" title="Traditional pressing, redesigned for the modern pantry." text="Velora began with a simple belief: edible oil should taste alive. We source clean seeds, press slowly, let each batch settle naturally, and bottle only what feels worthy of your table." />
          <div className="grid gap-4 sm:grid-cols-2">
            {["No chemical refining", "Small batch freshness", "Traceable farm partners", "Premium glass packaging"].map((item) => (
              <div key={item} className="rounded-2xl bg-white p-5 font-semibold shadow-sm">{item}</div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}



