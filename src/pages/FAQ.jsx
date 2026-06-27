// Renders the FAQ page experience.
import { motion } from "framer-motion";
import { Mail, Search } from "lucide-react";
import { useMemo, useState } from "react";
import Breadcrumb from "../components/common/Breadcrumb.jsx";
import FaqAccordion from "../components/faq/FaqAccordion.jsx";
import Button from "../components/ui/Button.jsx";
import Container from "../components/ui/Container.jsx";
import Input from "../components/ui/Input.jsx";
import { getFaqGroups } from "../services/contentService.js";

const faqGroups = getFaqGroups();

export default function FAQ() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filteredGroups = useMemo(() => {
    const term = query.trim().toLowerCase();
    return faqGroups
      .filter((group) => category === "All" || group.category === category)
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => `${item.q} ${item.a}`.toLowerCase().includes(term)),
      }))
      .filter((group) => group.items.length > 0);
  }, [category, query]);

  return (
    <>
      <Breadcrumb items={[{ label: "About", href: "/about" }, { label: "FAQ" }]} />
      <section className="section-padding pt-10">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">Support guide</p>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-ink/65">
              Everything customers usually ask about cold pressed oils, storage, orders, gifting, and batch care.
            </p>
          </motion.div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 rounded-[2rem] border border-ink/10 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search product, storage, or order questions"
                aria-label="Search FAQs"
                className="pl-11"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", ...faqGroups.map((group) => group.category)].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`h-12 rounded-full px-5 text-sm font-semibold transition ${
                    category === item ? "bg-ink text-white" : "bg-linen text-ink/68 hover:bg-ink hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-7">
            {filteredGroups.map((group) => (
              <section key={group.category} className="rounded-[2rem] bg-linen/70 p-4 sm:p-6">
                <h2 className="font-serif text-3xl font-semibold">{group.category}</h2>
                <div className="mt-5 grid gap-3">
                  {group.items.map((item) => (
                    <FaqAccordion key={item.q} item={item} />
                  ))}
                </div>
              </section>
            ))}
            {filteredGroups.length === 0 && (
              <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold">No matching questions found.</p>
                <p className="mt-2 text-ink/60">Try a different search term or contact support directly.</p>
              </div>
            )}
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl items-center gap-6 rounded-[2rem] bg-ink p-6 text-white sm:p-8 lg:grid-cols-[auto_1fr_auto]">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-white/10">
              <Mail size={22} />
            </span>
            <div>
              <h2 className="font-serif text-3xl font-semibold">Still need help?</h2>
              <p className="mt-2 leading-7 text-white/65">Send a note to the care team for orders, gifting, or product guidance.</p>
            </div>
            <Button to="/contact" variant="secondary" className="w-full sm:w-max">
              Contact Support
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
