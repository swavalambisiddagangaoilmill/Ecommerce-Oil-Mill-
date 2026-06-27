// Renders the Home page experience.
import BrandStrip from "../components/home/BrandStrip.jsx";
import Categories from "../components/home/Categories.jsx";
import EverydayEssentials from "../components/home/EverydayEssentials.jsx";
import ExtractionProcess from "../components/home/ExtractionProcess.jsx";
import FAQ from "../components/home/FAQ.jsx";
import FeaturedProducts from "../components/home/FeaturedProducts.jsx";
import Hero from "../components/home/Hero.jsx";
import InstagramGallery from "../components/home/InstagramGallery.jsx";
import Newsletter from "../components/home/Newsletter.jsx";
import StorySection from "../components/home/StorySection.jsx";
import Testimonials from "../components/home/Testimonials.jsx";
import Button from "../components/ui/Button.jsx";
import Container from "../components/ui/Container.jsx";

export default function Home() {
  return (
    <>
      <h1 className="sr-only">Velora cold pressed edible oils</h1>
      <Hero />
      <BrandStrip />
      <Categories />
      <EverydayEssentials />
      <StorySection />
      <ExtractionProcess />
      <FeaturedProducts />
      <section className="section-padding bg-surface">
        <Container className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">
              Lifestyle edit
            </p>
            <h2 className="mt-4 max-w-2xl font-serif text-3xl font-semibold leading-tight lg:text-5xl">
              Build a pantry that cooks beautifully every day.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/65">
              Curated oil bundles for daily meals, festive cooking, and wellness
              routines, bottled in gift-ready amber glass.
            </p>
            <Button to="/shop" className="mt-8">
              Shop Bundles
            </Button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1400&q=85"
            alt="Premium pantry ingredients"
            loading="lazy"
            className="aspect-[16/10] w-full rounded-3xl object-cover shadow-soft"
          />
        </Container>
      </section>
      <Testimonials />
      <FAQ />
      <Newsletter />
      <InstagramGallery />
    </>
  );
}
