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
  onDropdownToggle,
  onNavigate,
  buttonRef,
}) {
  const className =
    "group relative inline-flex h-[54px] items-center justify-center gap-2 px-6 text-sm font-semibold text-white outline-none transition duration-200 hover:bg-white/5 focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60 2xl:px-7";
  const underline = (
    <span
      className={`absolute bottom-0 left-6 right-6 h-0.5 origin-left bg-white transition-transform duration-200 ${
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    />
  );

  if (hasDropdown) {
    return (
      <div className={className} onMouseEnter={onMouseEnter}>
        <Link ref={buttonRef} to={item.href} state={item.state} className="relative z-10 outline-none" onClick={onNavigate} onFocus={onFocus} onKeyDown={onKeyDown}>
          {item.label}
        </Link>
        <button
          type="button"
          className="relative z-10 inline-flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          aria-label={`Open ${item.label} menu`}
          aria-haspopup="true"
          aria-expanded={active}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDropdownToggle?.();
          }}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
        >
          <ChevronDown
            size={16}
            className={`transition duration-200 ${active ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
        {underline}
      </div>
    );
  }

  return (
    <Link ref={buttonRef} to={item.href} state={item.state} className={className} onClick={onNavigate} onFocus={onFocus} onKeyDown={onKeyDown}>
      <span className="relative z-10">{item.label}</span>
      {underline}
    </Link>
  );
}
