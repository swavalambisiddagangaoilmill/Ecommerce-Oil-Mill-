// Renders RelatedProducts for product catalog surfaces.
import { getRelatedProducts } from "../../services/catalogService.js";
import ProductCard from "./ProductCard.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";

export default function RelatedProducts({ current }) {
  const related = getRelatedProducts(current, 6);
  if (related.length === 0) return null;

  return (
    <section className="section-padding">
      <SectionHeading eyebrow="You may also like" title="More oils from this family" />
      <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {related.map((product) => <div key={product.id} className="w-[78vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none"><ProductCard product={product} /></div>)}
      </div>
    </section>
  );
}

