// Renders ProductGallery for product catalog surfaces.
import { useState } from "react";
import SafeImage from "../common/SafeImage.jsx";

export default function ProductGallery({ product }) {
  const [active, setActive] = useState(product.gallery[0]);
  return (
    <div className="grid gap-4 lg:grid-cols-[96px_1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
        {product.gallery.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setActive(image)}
            className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border transition ${active === image ? "border-leaf" : "border-ink/10"}`}
          >
            <SafeImage src={image} alt={`${product.name} thumbnail`} className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
      <div className="order-1 aspect-[4/5] overflow-hidden rounded-3xl bg-linen lg:order-2">
        <SafeImage src={active} alt={product.name} className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
