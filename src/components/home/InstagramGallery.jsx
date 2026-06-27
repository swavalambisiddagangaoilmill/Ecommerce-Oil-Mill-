// Renders the homepage InstagramGallery section.
import { instagramImages } from "../../data/siteData.js";
import Container from "../ui/Container.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";

export default function InstagramGallery() {
  return (
    <section className="section-padding">
      <Container>
        <SectionHeading eyebrow="@veloraoils" title="A slower look at everyday cooking" />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {instagramImages.map((image, index) => (
            <div key={image} className="aspect-square overflow-hidden rounded-3xl bg-linen">
              <img src={image} alt={`Velora lifestyle ${index + 1}`} loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
