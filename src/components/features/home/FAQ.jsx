// Renders the homepage FAQ section.
import { faqs } from "../../../data/siteData.js";
import Container from "../../ui/Container.jsx";
import SectionHeading from "../../ui/SectionHeading.jsx";

export default function FAQ() {
  return (
    <section className="section-padding">
      <Container>
        <SectionHeading eyebrow="FAQ" title="Good oil deserves clear answers" />
        <div className="mx-auto max-w-3xl divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-white px-6">
          {faqs.map((faq) => (
            <details key={faq.q} className="group py-5">
              <summary className="cursor-pointer list-none text-lg font-semibold">{faq.q}</summary>
              <p className="mt-3 leading-7 text-ink/60">{faq.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}



