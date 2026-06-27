// Renders the premium footer layout element.
import { Facebook, Instagram, Mail, MapPin, Phone, Send, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../ui/Container.jsx";

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
  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    // Backend: call subscribeToNewsletter with the email value here.
  };

  return (
    <footer className="bg-ink text-white">
      <Container className="py-12 md:py-16 xl:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <Link to="/" className="group block rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-10 transition hover:-translate-y-1 hover:bg-white/[0.07]">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-clay">Primary brand logo</span>
            <span className="mt-4 block font-serif text-6xl font-semibold leading-none sm:text-7xl lg:text-8xl">Velora</span>
          </Link>
          <a href="https://www.glora.studio" target="_blank" rel="noopener noreferrer" className="mx-auto mt-5 inline-grid min-w-56 place-items-center rounded-full border border-white/10 bg-white px-7 py-4 text-ink shadow-sm transition hover:-translate-y-0.5 hover:bg-linen">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink/38">Made by team</span>
            <img src="/glora-black.svg" alt="Glora Studio" className="mt-1 h-10 w-auto" />
          </a>
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
                <input id="footer-email" type="email" placeholder="Email address" className="h-12 min-w-0 rounded-full border border-ink/10 bg-white px-5 text-sm outline-none placeholder:text-ink/35 focus:border-leaf" />
                <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-leaf"><Send size={16} /> Subscribe</button>
              </form>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <div className="grid gap-3 text-sm font-semibold text-white/62">
                <span className="flex items-center gap-3"><MapPin size={18} className="text-clay" /> Indiranagar, Bengaluru</span>
                <span className="flex items-center gap-3"><Phone size={18} className="text-clay" /> +91 98765 43210</span>
                <span className="flex items-center gap-3"><Mail size={18} className="text-clay" /> care@veloraoils.in</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {socialLinks.map(({ label, icon: Icon, href }) => <Link key={label} to={href} aria-label={label} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:-translate-y-1 hover:bg-white hover:text-ink"><Icon size={18} /></Link>)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm font-medium text-white/52 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Velora Oils. All rights reserved.</p>
          <p>Cold pressed pantry staples, bottled with patience.</p>
        </div>
      </Container>
    </footer>
  );
}
