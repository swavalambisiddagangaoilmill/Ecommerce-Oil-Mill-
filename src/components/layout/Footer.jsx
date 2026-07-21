// Renders the premium footer layout element.
import { Facebook, Instagram, Mail, MapPin, Phone, Send, Youtube } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import TurnstileWidget from "../features/auth/TurnstileWidget.jsx";
import Container from "../ui/Container.jsx";
import { subscribeToNewsletter } from "../../services/contactService.js";

const footerColumns = [
  { title: "Navigation", links: [{ label: "Home", href: "/" }, { label: "Shop Oils", href: "/shop" }, { label: "Best Sellers", href: "/shop" }, { label: "Contact", href: "/contact" }] },
  { title: "About", links: [{ label: "Our Story", href: "/about/story" }, { label: "Our Process", href: "/about/process" }, { label: "FAQ", href: "/about/faq" }, { label: "Sustainability", href: "/about" }] },
  { title: "Support", links: [{ label: "Care Guide", href: "/about/faq" }, { label: "Shipping", href: "/legal/shipping" }, { label: "Bulk Orders", href: "/contact" }, { label: "Account", href: "/login" }] },
  { title: "Legal", links: [{ label: "Privacy Policy", href: "/legal/privacy" }, { label: "Terms & Conditions", href: "/legal/terms" }, { label: "Shipping Policy", href: "/legal/shipping" }, { label: "Refund Policy", href: "/legal/refund" }, { label: "Cookie Policy", href: "/legal/cookies" }] },
];

const socialLinks = [
  { label: "Instagram", icon: Instagram, href: "/contact" },
  { label: "Facebook", icon: Facebook, href: "/contact" },
  { label: "YouTube", icon: Youtube, href: "/contact" },
];

export default function Footer() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleNewsletterSubmit = async (event) => {
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
    <footer className="bg-ink text-white">
      <Container className="py-12 md:py-16 xl:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <Link to="/" className="group block rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-10 transition hover:-translate-y-1 hover:bg-white/[0.07]">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-clay">Primary brand logo</span>
            {/* <!-- Company Logo Placeholder --> */}
            <span className="mt-4 block font-serif text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">Swavalambi Siddaganga Oil Mill</span>
          </Link>
          <div className="mx-auto mt-5 inline-grid min-w-56 place-items-center rounded-full border border-white/10 bg-white px-7 py-4 text-ink shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink/38">Made by team</span>
            {/* <!-- Company Logo Placeholder --> */}
            <span className="mt-1 font-serif text-xl font-semibold">Team Logo Placeholder</span>
          </div>
        </div>

        <div className="mt-12 grid gap-5 xl:mt-16 xl:grid-cols-[1fr_0.82fr]">
          <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <nav key={column.title} aria-label={`${column.title} footer links`}>
                <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-clay">{column.title}</h3>
                <div className="mt-5 grid gap-3">
                  {column.links.map((link) => <Link key={link.label} to={link.href} className="font-semibold text-white/62 transition hover:translate-x-1 hover:text-white">{link.label}</Link>)}
                </div>
              </nav>
            ))}
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2rem] bg-cream p-6 text-ink shadow-soft sm:p-8">
              <h3 className="font-serif text-3xl font-semibold">Join the pantry letter</h3>
              <p className="mt-3 leading-7 text-ink/62">Seasonal recipes, batch notes, and quiet guides for caring for cold pressed oils.</p>
              <form className="mt-6 grid gap-3 sm:grid-cols-[1fr_150px]" onSubmit={handleNewsletterSubmit}>
                <label className="sr-only" htmlFor="footer-email">Email address</label>
                <input id="footer-email" name="email" type="email" required placeholder="Email address" className="h-12 min-w-0 rounded-full border border-ink/10 bg-white px-5 text-sm outline-none placeholder:text-ink/35 focus:border-leaf" />
                <button type="submit" disabled={loading} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-leaf disabled:cursor-wait disabled:opacity-70"><Send size={16} /> Subscribe</button>
                <TurnstileWidget onVerify={setTurnstileToken} className="sm:col-span-2" />
                {message && <p className="text-sm font-semibold text-ink/65 sm:col-span-2">{message}</p>}
              </form>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <div className="grid gap-3 text-sm font-semibold text-white/62">
                <span className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-clay" /> SIDDAGANGA OIL MILL, Near Small City Club Road, Sira Gate, TUDA Layout, Tumakuru, Karnataka 572106</span>
                <span className="flex items-center gap-3"><Phone size={18} className="text-clay" /> 09972565174</span>
                <span className="flex items-center gap-3"><Mail size={18} className="text-clay" /> support@swavalambisiddagangaoilmill.com</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {socialLinks.map(({ label, icon: Icon, href }) => <Link key={label} to={href} aria-label={label} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:-translate-y-1 hover:bg-white hover:text-ink"><Icon size={18} /></Link>)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm font-medium text-white/52 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Swavalambi Siddaganga Oil Mill. All rights reserved.</p>
          <p>Work is Worship.</p>
        </div>
      </Container>
    </footer>
  );
}


