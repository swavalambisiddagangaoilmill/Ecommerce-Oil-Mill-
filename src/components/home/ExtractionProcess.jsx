// Renders the homepage ExtractionProcess section.
import { processSteps } from "../../data/siteData.js";
import Container from "../ui/Container.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";

export default function ExtractionProcess() {
  return (
    <section className="section-padding bg-ink text-white">
      <Container>
        <SectionHeading eyebrow="Extraction process" title="Slow by design, pure by nature" text="We preserve the old rhythm of pressing while applying careful quality checks at each stage." />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <div key={step} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <span className="font-serif text-5xl font-semibold text-clay">0{index + 1}</span>
              <p className="mt-6 leading-7 text-white/75">{step}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
