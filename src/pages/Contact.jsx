// Renders the Contact page experience.
import { Mail, MapPin, Phone } from "lucide-react";
import Breadcrumb from "../components/common/Breadcrumb.jsx";
import Button from "../components/ui/Button.jsx";
import Container from "../components/ui/Container.jsx";
import Input from "../components/ui/Input.jsx";

export default function Contact() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Backend: call submitContactMessage with form fields here.
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Contact" }]} />
      <section className="section-padding">
        <Container className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <form className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
            <h1 className="font-serif text-5xl font-semibold">Contact Us</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/60">Questions about a batch, bulk orders, gifting, or your pantry? Send a note and our care team will respond.</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Input label="Name" required />
              <Input label="Email" type="email" required />
            </div>
            <div className="mt-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink/75">Message</span>
                <textarea className="min-h-40 w-full rounded-xl border border-ink/10 bg-white p-4 outline-none focus:border-leaf focus:ring-4 focus:ring-leaf/10" required />
              </label>
            </div>
            <Button type="submit" className="mt-6">Send Message</Button>
          </form>
          <div className="space-y-5">
            <div className="grid min-h-72 place-items-center rounded-3xl bg-linen p-8 text-center">
              <div>
                <MapPin className="mx-auto text-leaf" size={34} />
                <p className="mt-4 font-serif text-3xl font-semibold">Map Placeholder</p>
                <p className="mt-2 text-ink/60">Indiranagar, Bengaluru</p>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="font-serif text-3xl font-semibold">Business Details</h2>
              <div className="mt-5 grid gap-4 text-ink/65">
                <p className="flex gap-3"><Phone size={19} /> +91 98765 43210</p>
                <p className="flex gap-3"><Mail size={19} /> care@veloraoils.in</p>
                <p className="flex gap-3"><MapPin size={19} /> 12 Pantry Lane, Bengaluru, Karnataka</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
