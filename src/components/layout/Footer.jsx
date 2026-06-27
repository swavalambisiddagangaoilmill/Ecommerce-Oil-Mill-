// Renders the Footer layout element.
import { Facebook, Instagram, Mail, MapPin, Phone, Send, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../ui/Container.jsx";

const footerColumns = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "/" },
      { label: "Shop Oils", href: "/shop" },
      { label: "Best Sellers", href: "/shop" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/about/story" },
      { label: "Our Process", href: "/about/process" },
      { label: "FAQ", href: "/about/faq" },
      { label: "Sustainability", href: "/about" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Care Guide", href: "/about/faq" },
      { label: "Shipping", href: "/about/faq" },
      { label: "Bulk Orders", href: "/contact" },
      { label: "Account", href: "/login" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms & Conditions", href: "/legal/terms" },
      { label: "Shipping Policy", href: "/legal/shipping" },
      { label: "Refund Policy", href: "/legal/refund" },
      { label: "Cookie Policy", href: "/legal/cookies" },
    ],
  },
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
    <footer className="border-t border-ink/10 bg-footer">
      <Container className="py-12 md:py-16 xl:py-20">
        <div className="text-center">
          <Link
            to="/"
            className="mx-auto grid min-h-32 max-w-3xl place-items-center rounded-[2rem] border border-ink/10 bg-cream px-6 py-10 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft"
          >
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-clay">Primary brand logo</span>
            <span className="mt-3 font-serif text-6xl font-semibold leading-none text-ink sm:text-7xl lg:text-8xl">Velora</span>
          </Link>
          <Link
            to="/contact"
            className="mx-auto mt-5 inline-grid min-w-56 place-items-center rounded-full border border-ink/10 bg-white px-7 py-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:text-leaf"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink/38">Made by team</span>
            <span className="mt-1 font-serif text-2xl font-semibold">Team Logo</span>
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr] xl:mt-16">
          <div className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8 md:grid-cols-2 xl:grid-cols-4">
            {footerColumns.map((column) => (
              <nav key={column.title} aria-label={`${column.title} footer links`}>
                <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-clay">{column.title}</h3>
                <div className="mt-5 grid gap-3">
                  {column.links.map((link) => (
                    <Link key={link.label} to={link.href} className="font-semibold text-ink/62 transition duration-200 hover:translate-x-1 hover:text-leaf">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>
            ))}
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] bg-ink p-6 text-white shadow-soft sm:p-8">
              <h3 className="font-serif text-3xl font-semibold">Join the pantry letter</h3>
              <p className="mt-3 leading-7 text-white/62">Seasonal recipes, batch notes, and quiet guides for caring for cold pressed oils.</p>
              <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={handleNewsletterSubmit}>
                <label className="sr-only" htmlFor="footer-email">Email address</label>
                <input
                  id="footer-email"
                  type="email"
                  placeholder="Email address"
                  className="h-12 min-w-0 flex-1 rounded-full border border-white/10 bg-white/10 px-5 text-sm text-white outline-none placeholder:text-white/42 focus:border-white/50"
                />
                <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink transition duration-300 hover:bg-linen">
                  <Send size={16} /> Subscribe
                </button>
              </form>
            </div>

            <div className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-3 text-sm font-semibold text-ink/62">
                <span className="flex items-center gap-3"><MapPin size={18} className="text-leaf" /> Indiranagar, Bengaluru</span>
                <span className="flex items-center gap-3"><Phone size={18} className="text-leaf" /> +91 98765 43210</span>
                <span className="flex items-center gap-3"><Mail size={18} className="text-leaf" /> care@veloraoils.in</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ label, icon: Icon, href }) => (
                  <Link
                    key={label}
                    to={href}
                    aria-label={label}
                    className="grid h-11 w-11 place-items-center rounded-full bg-linen text-ink transition duration-300 hover:-translate-y-1 hover:bg-leaf hover:text-white"
                  >
                    <Icon size={18} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-ink/10 pt-6 text-sm font-medium text-ink/52 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Velora Oils. All rights reserved.</p>
          <p>Cold pressed pantry staples, bottled with patience.</p>
        </div>
      </Container>
    </footer>
  );
}
