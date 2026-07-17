// Renders the Navbar layout element.
import { Heart, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
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
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { authenticated, user } = useAuth();
  const { togglePopup } = usePopup();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const accountPath = authenticated ? "/account" : "/login";
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchValue(params.get("q") || "");
  }, [location.search]);

  const navigateToShopSearch = (value = searchValue, replace = false) => {
    const params = new URLSearchParams();
    params.set("focus", "search");
    if (value) params.set("q", value);
    navigate(`/shop?${params.toString()}`, { replace });
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    navigateToShopSearch(value, location.pathname === "/shop");
  };
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
              <form
                role="search"
                onSubmit={(event) => { event.preventDefault(); navigateToShopSearch(searchValue, location.pathname === "/shop"); }}
                className="hidden h-11 min-w-0 items-center gap-3 rounded-full bg-white px-5 text-sm font-semibold text-ink/70 shadow-sm transition duration-200 hover:scale-[1.02] hover:bg-linen focus-within:outline-none focus-within:ring-2 focus-within:ring-leaf xl:inline-flex xl:w-[220px] 2xl:w-[260px]"
              >
                <Search size={18} className="shrink-0" />
                <input
                  value={searchValue}
                  onFocus={() => navigateToShopSearch(searchValue, location.pathname === "/shop")}
                  onChange={handleSearchChange}
                  placeholder="Search oils"
                  aria-label="Search products"
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-ink/70 placeholder:text-ink/50 outline-none"
                />
              </form>
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
              <div className="hidden items-center gap-2 xl:flex"><IconLink to={accountPath} label="Account" className="grid">
                <UserRound size={19} fill={authenticated ? "currentColor" : "none"} />
              </IconLink>{isAdmin && <span className="rounded-full bg-leaf/10 px-2.5 py-1 text-xs font-bold text-leaf">Admin</span>}</div>
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
      <MobileDrawer open={open} onClose={() => setOpen(false)} onWishlist={() => togglePopup("wishlist")} accountPath={accountPath} authenticated={authenticated} isAdmin={isAdmin} />
    </>
  );
}
