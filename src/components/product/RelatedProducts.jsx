// Renders RelatedProducts for product catalog surfaces.
import { getRelatedProducts } from "../../services/catalogService.js";
import ProductCard from "./ProductCard.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";

export default function RelatedProducts({ current }) {
  const related = getRelatedProducts(current, 4);
  return (
    <section className="section-padding">
      <SectionHeading eyebrow="You may also like" title="Pair it with another pantry staple" />
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {related.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
