// Renders the OurProcess page experience.
import Breadcrumb from "../components/common/Breadcrumb.jsx";
import CinematicHero, { DEMO_HERO_VIDEO } from "../components/common/CinematicHero.jsx";
import PageCta from "../components/common/PageCta.jsx";
import Container from "../components/ui/Container.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import { getProcessContent } from "../services/contentService.js";

const { brandValues, processStepsDetailed, qualityStandards, sustainabilityPoints } = getProcessContent();

export default function OurProcess() {
  return (
    <>
      <Breadcrumb items={[{ label: "About", href: "/about" }, { label: "Our Process" }]} />
      <CinematicHero
        eyebrow="Our process"
        title="From selected seeds to fresh pantry dispatch."
        text="A detailed look at how Velora sources, presses, settles, bottles, and delivers oils with a freshness-first standard."
        image="https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1800&q=85"
        video={DEMO_HERO_VIDEO}
        contentVisible={false}
      />

      <section className="section-padding">
        <Container className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">Overview</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight lg:text-6xl">
              Every stage is designed to preserve the natural character of the seed.
            </h2>
          </div>
          <p className="rounded-[2rem] bg-white p-7 text-lg leading-8 text-ink/65 shadow-sm sm:p-9">
            The Velora process favors low intervention: careful sourcing, slow pressing, natural settling, protective packing, and fresh dispatch. It is a practical system for oils that need to taste alive and remain dependable.
          </p>
        </Container>
      </section>

      <section className="bg-linen/70 py-12 md:py-16 xl:py-20">
        <Container>
          <SectionHeading eyebrow="Step by step" title="How each bottle is made" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {processStepsDetailed.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="rounded-[2rem] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-linen text-leaf">
                    <Icon size={22} />
                  </span>
                  <span className="font-serif text-4xl font-semibold text-ink/12">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-6 font-serif text-3xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-ink/62">{text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-padding">
        <Container className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] bg-ink p-7 text-white sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">Quality standards</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold">Clean checks before shelf presence.</h2>
            <div className="mt-7 grid gap-3">
              {qualityStandards.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/8 p-4 font-semibold text-white/78">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-7 shadow-sm sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">Sustainability</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold">Thoughtful by material and method.</h2>
            <div className="mt-7 grid gap-4">
              {sustainabilityPoints.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4 rounded-2xl bg-linen p-4">
                  <Icon size={22} className="mt-1 shrink-0 text-leaf" />
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 leading-7 text-ink/62">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-12 md:py-16 xl:py-20">
        <Container>
          <SectionHeading eyebrow="Trust indicators" title="Signals customers can understand" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brandValues.map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
                <Icon className="mx-auto text-leaf" size={28} />
                <p className="mt-4 font-serif text-2xl font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <PageCta eyebrow="Know your oil" title="Choose products made with a slower, cleaner process." text="Shop the Velora range or speak with us about bulk, gifting, and recurring pantry orders." />
    </>
  );
}
