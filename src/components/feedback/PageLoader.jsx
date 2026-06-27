// Reusable page-level loading and skeleton state.
import Container from "../ui/Container.jsx";

export default function PageLoader({ label = "Loading" }) {
  return (
    <section className="section-padding">
      <Container>
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">{label}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-56 animate-pulse rounded-3xl bg-linen" />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
