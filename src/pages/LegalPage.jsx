// Renders required legal policy pages.
import { Navigate, useParams } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb.jsx";
import Container from "../components/ui/Container.jsx";
import { legalPages } from "../data/legalData.js";

export default function LegalPage() {
  const { slug } = useParams();
  const page = legalPages[slug];

  if (!page) return <Navigate to="/404" replace />;

  return (
    <>
      <Breadcrumb items={[{ label: page.title }]} />
      <section className="section-padding">
        <Container className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">Legal</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight lg:text-6xl">{page.title}</h1>
          <div className="mt-8 grid gap-4">
            {page.sections.map(([title, text]) => (
              <article key={title} className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
                <h2 className="font-serif text-3xl font-semibold">{title}</h2>
                <p className="mt-3 leading-7 text-ink/65">{text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
