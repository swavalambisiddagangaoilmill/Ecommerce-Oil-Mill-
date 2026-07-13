// Renders the homepage Benefits section.
import { benefits } from "../../../data/siteData.js";
import Container from "../../ui/Container.jsx";
import SectionHeading from "../../ui/SectionHeading.jsx";

export default function Benefits() {
  return (
    <section className="section-padding">
      <Container>
        <SectionHeading eyebrow="Why cold pressed" title="Cleaner oils with deeper character" text="Every detail is chosen to protect flavor, natural nutrition, and the integrity of each seed." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf/10 text-leaf"><Icon size={22} /></span>
              <h3 className="mt-6 font-serif text-2xl font-semibold">{title}</h3>
              <p className="mt-3 leading-7 text-ink/60">{text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}



