// Displays active storefront offer banners with lightweight auto-refresh.
import { useEffect, useState } from "react";
import { getActiveOffers } from "../../../services/promotionService.js";

export default function OfferBanner() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    let active = true;
    const load = () => getActiveOffers().then((items) => active && setOffers(items)).catch(() => active && setOffers([]));
    load();
    const timer = window.setInterval(load, 15000);
    window.addEventListener("ss-oil-mill-promotions-changed", load);
    return () => { active = false; window.clearInterval(timer); window.removeEventListener("ss-oil-mill-promotions-changed", load); };
  }, []);

  if (!offers.length) return null;

  return (
    <div className="mb-6 grid gap-3">
      {offers.slice(0, 2).map((offer) => (
        <div key={offer._id} className="rounded-2xl border border-leaf/15 bg-leaf/5 px-4 py-3 text-sm font-semibold text-ink shadow-sm">
          <span className="text-leaf">{offer.bannerText || offer.name}</span>
          {offer.description && <span className="ml-2 text-ink/55">{offer.description}</span>}
        </div>
      ))}
    </div>
  );
}

