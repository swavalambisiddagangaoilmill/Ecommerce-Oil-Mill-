// Shared PageCta component used across pages.
import Button from "../ui/Button.jsx";
import Container from "../ui/Container.jsx";

export default function PageCta({ eyebrow, title, text, action = "Shop Oils", to = "/shop" }) {
  return (
    <section className="py-12 md:py-16 xl:py-20">
      <Container>
        <div className="grid items-center gap-6 rounded-[2rem] bg-ink p-6 text-white sm:p-8 lg:grid-cols-[1fr_auto] lg:p-10">
          <div>
            {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">{eyebrow}</p>}
            <h2 className="mt-3 max-w-3xl font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">{title}</h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/68">{text}</p>
          </div>
          <Button to={to} variant="secondary" className="w-full sm:w-max">
            {action}
          </Button>
        </div>
      </Container>
    </section>
  );
}
