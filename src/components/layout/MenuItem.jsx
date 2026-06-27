// Renders the MenuItem layout element.
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export default function MenuItem({
  item,
  active,
  hasDropdown = false,
  onMouseEnter,
  onFocus,
  onKeyDown,
  buttonRef,
}) {
  const content = (
    <>
      <span className="relative z-10">{item.label}</span>
      {hasDropdown && (
        <ChevronDown
          size={16}
          className={`relative z-10 transition duration-200 ${active ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      )}
      <span
        className={`absolute bottom-0 left-6 right-6 h-0.5 origin-left bg-white transition-transform duration-200 ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </>
  );

  const className =
    "group relative inline-flex h-[54px] items-center justify-center gap-2 px-6 text-sm font-semibold text-white outline-none transition duration-200 hover:bg-white/5 focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60 2xl:px-7";

  if (hasDropdown) {
    return (
      <button
        ref={buttonRef}
        type="button"
        className={className}
        aria-haspopup="true"
        aria-expanded={active}
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
      >
        {content}
      </button>
    );
  }

  return (
    <Link ref={buttonRef} to={item.href} className={className} onFocus={onFocus} onKeyDown={onKeyDown}>
      {content}
    </Link>
  );
}
