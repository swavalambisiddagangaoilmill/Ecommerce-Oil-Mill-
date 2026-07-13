// Renders the homepage FeaturedProducts section.
import { useEffect, useState } from "react";
import { getBestSellerProducts } from "../../../services/catalogService.js";
import ProductCard from "../product/ProductCard.jsx";
import Container from "../../ui/Container.jsx";
import SectionHeading from "../../ui/SectionHeading.jsx";

export default function FeaturedProducts() {
  const [bestSellerProducts, setBestSellerProducts] = useState([]);

  useEffect(() => {
    let active = true;
    getBestSellerProducts().then((items) => active && setBestSellerProducts(items)).catch(() => active && setBestSellerProducts([]));
    return () => { active = false; };
  }, []);

  return (
    <section className="section-padding">
      <Container>
        <SectionHeading eyebrow="Best sellers" title="Bestsellers pressed for everyday nourishment" />
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-5">
          {bestSellerProducts.map((product) => <ProductCard key={product.id} product={product} variant="premium" />)}
        </div>
      </Container>
    </section>
  );
}
