// Renders the Navbar layout element.
import { Heart, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePopup } from "../../context/PopupContext.jsx";
import { useCart } from "../../hooks/useCart.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import DesktopMenu from "./DesktopMenu.jsx";
import MobileDrawer from "./MobileDrawer.jsx";

function IconLink({ to, label, children, badge, className = "", onClick }) {
  const content = (
    <>
      {children}
      {badge > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-leaf px-1 text-[11px] font-bold text-white">
          {badge}
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        data-popup-trigger={label.toLowerCase()}
        className={`relative h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-sm transition duration-200 hover:scale-105 hover:bg-linen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf ${className || "grid"}`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      to={to}
      aria-label={label}
      className={`relative h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-sm transition duration-200 hover:scale-105 hover:bg-linen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf ${className || "grid"}`}
    >
      {content}
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { togglePopup } = usePopup();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-cream/96 backdrop-blur transition duration-300 ${
          scrolled ? "shadow-soft" : "shadow-none"
        }`}
      >
        <div className="border-b border-ink/10">
          <div className="mx-auto flex h-[52px] max-w-screen-2xl items-center justify-between px-4 sm:px-6 md:h-20 lg:px-8 xl:grid xl:h-[88px] xl:grid-cols-[1fr_auto_1fr] xl:px-10 2xl:px-12">
            <div className="flex items-center justify-start">
              <Link
                to="/"
                className="font-serif text-3xl font-semibold tracking-tight xl:hidden"
              >
                Velora
              </Link>
              <Link
                to="/shop?focus=search"
                aria-label="Search products"
                className="hidden h-11 items-center gap-3 rounded-full bg-white px-5 text-sm font-semibold text-ink/70 shadow-sm transition duration-200 hover:scale-[1.02] hover:bg-linen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf xl:inline-flex"
              >
                <Search size={18} />
                Search oils
              </Link>
            </div>
            <Link
              to="/"
              className="hidden font-serif text-4xl font-semibold tracking-tight xl:block"
            >
              Velora
            </Link>
            <div className="flex items-center justify-end gap-3">
              <IconLink label="Wishlist" badge={wishlistItems.length} className="hidden xl:grid" onClick={() => togglePopup("wishlist")}>
                <Heart size={19} />
              </IconLink>
              <IconLink to="/login" label="Account" className="hidden xl:grid">
                <UserRound size={19} />
              </IconLink>
              <IconLink
                to="/cart"
                label="Cart"
                badge={count}
                className="hidden xl:grid"
              >
                <ShoppingBag size={19} />
              </IconLink>
              <button
                type="button"
                aria-label="Open menu"
                className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-sm transition duration-200 hover:scale-105 hover:bg-linen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf xl:hidden"
                onClick={() => setOpen(true)}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
        <DesktopMenu />
      </header>
      <MobileDrawer open={open} onClose={() => setOpen(false)} onWishlist={() => togglePopup("wishlist")} />
    </>
  );
}


