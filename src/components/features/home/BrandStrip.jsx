// Renders the homepage BrandStrip section.
import { brandValues, trustStats } from "../../../data/siteData.js";
import Container from "../../ui/Container.jsx";

export default function BrandStrip() {
  return (
    <section className="border-y border-ink/10 bg-white">
      <Container className="py-6 md:py-7">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
          {trustStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-3xl font-semibold leading-none text-leaf md:text-4xl">{stat.value}</p>
              <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/55 md:text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {brandValues.map(({ icon: Icon, label }) => (
            <div key={label} className="flex min-h-12 items-center gap-2.5 rounded-2xl bg-linen px-3.5 py-3 text-sm font-semibold">
              <Icon size={17} className="shrink-0 text-leaf" /> {label}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}



