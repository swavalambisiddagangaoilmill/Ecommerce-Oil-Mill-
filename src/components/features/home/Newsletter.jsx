// Renders the homepage Newsletter section.
import { Send } from "lucide-react";
import { useState } from "react";
import TurnstileWidget from "../auth/TurnstileWidget.jsx";
import { subscribeToNewsletter } from "../../../services/contactService.js";
import Button from "../../ui/Button.jsx";
import Container from "../../ui/Container.jsx";
import Input from "../../ui/Input.jsx";

export default function Newsletter() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    setLoading(true);
    setMessage("");
    try {
      await subscribeToNewsletter({ email, turnstileToken });
      setMessage("Subscribed successfully.");
      event.currentTarget.reset();
    } catch (err) {
      setMessage(err.message || "Unable to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding bg-leaf text-white">
      <Container className="grid items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">Pantry letters</p><h2 className="mt-4 max-w-2xl font-serif text-3xl font-semibold leading-tight lg:text-5xl">Recipes, batch releases, and oil care notes.</h2></div>
        <form className="grid w-full gap-3 rounded-3xl bg-white p-4 shadow-soft sm:grid-cols-[minmax(0,1fr)_180px] lg:p-5 xl:grid-cols-[minmax(0,1fr)_200px]" onSubmit={handleSubmit}>
          <Input name="email" type="email" placeholder="Email address" aria-label="Email address" className="h-14 bg-cream px-5 sm:h-16" required />
          <Button type="submit" className="h-14 w-full sm:h-16" loading={loading}><Send size={18} /> Subscribe</Button>
          <TurnstileWidget onVerify={setTurnstileToken} className="sm:col-span-2" />
          {message && <p className="text-sm font-semibold text-ink sm:col-span-2">{message}</p>}
        </form>
      </Container>
    </section>
  );
}
