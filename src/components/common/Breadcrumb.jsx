// Shared Breadcrumb component used across pages.
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../ui/Container.jsx";

export default function Breadcrumb({ items = [] }) {
  return (
    <Container className="pt-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-ink/55">
        <Link to="/" className="inline-flex items-center gap-1 transition hover:text-leaf">
          <Home size={16} /> Home
        </Link>
        {items.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-2">
            <ChevronRight size={14} />
            {item.href ? (
              <Link className="transition hover:text-leaf" to={item.href}>
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-ink">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </Container>
  );
}


