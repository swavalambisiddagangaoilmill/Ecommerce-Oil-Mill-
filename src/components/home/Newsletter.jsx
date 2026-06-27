// Renders the homepage Newsletter section.
import { Send } from "lucide-react";
import Button from "../ui/Button.jsx";
import Container from "../ui/Container.jsx";
import Input from "../ui/Input.jsx";

export default function Newsletter() {
  return (
    <section className="section-padding bg-leaf text-white">
      <Container className="grid items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">Pantry letters</p>
          <h2 className="mt-4 max-w-2xl font-serif text-3xl font-semibold leading-tight lg:text-5xl">Recipes, batch releases, and oil care notes.</h2>
        </div>
        <form className="grid w-full gap-3 rounded-3xl bg-white p-4 shadow-soft sm:grid-cols-[minmax(0,1fr)_180px] lg:p-5 xl:grid-cols-[minmax(0,1fr)_200px]">
          <Input type="email" placeholder="Email address" aria-label="Email address" className="h-14 bg-cream px-5 sm:h-16" />
          <Button type="submit" className="h-14 w-full sm:h-16"><Send size={18} /> Subscribe</Button>
        </form>
      </Container>
    </section>
  );
}
