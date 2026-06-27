// Renders the homepage ExtractionProcess section.
import { processSteps } from "../../data/siteData.js";
import Container from "../ui/Container.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";

export default function ExtractionProcess() {
  return (
    <section className="py-12 md:py-20 xl:py-24 bg-ink text-white">
      <Container>
        <SectionHeading eyebrow="Extraction process" title="Slow by design, pure by nature" text="We preserve the old rhythm of pressing while applying careful quality checks at each stage." />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <div key={step} className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
              <span className="font-serif text-5xl font-semibold text-clay">0{index + 1}</span>
              <p className="mt-4 leading-7 text-white/75 sm:mt-6">{step}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}


