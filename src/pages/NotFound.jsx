// Renders the NotFound page experience.
import Button from "../components/ui/Button.jsx";
import Container from "../components/ui/Container.jsx";

export default function NotFound() {
  return (
    <section className="section-padding">
      <Container className="grid min-h-[55vh] place-items-center text-center">
        <div>
          <p className="font-serif text-8xl font-semibold text-leaf">404</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold">This page has settled elsewhere.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-ink/60">The page you are looking for is unavailable, but the oil collection is freshly stocked.</p>
          <Button to="/shop" className="mt-8">Return to Shop</Button>
        </div>
      </Container>
    </section>
  );
}


