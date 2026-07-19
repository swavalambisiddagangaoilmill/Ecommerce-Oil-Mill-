// Renders the Shop page experience.
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb.jsx";
import ProductCard from "../components/features/product/ProductCard.jsx";
import Container from "../components/ui/Container.jsx";
import Input from "../components/ui/Input.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import { getCategories, getProducts } from "../services/catalogService.js";

const perPage = 6;

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ name: "All" }]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const invalidSearch = search.trim().length === 1;

  useEffect(() => {
    getCategories().then((items) => setCategories([{ name: "All" }, ...items])).catch(() => setCategories([{ name: "All" }]));
  }, []);

  useEffect(() => {
    if (invalidSearch) return undefined;
    setSearchLoading(true);
    const timer = window.setTimeout(() => {
      const categoryId = categories.find((item) => item.name === category)?.id;
      getProducts({ page, limit: perPage, search, category: category === "All" ? undefined : categoryId, sort: sort === "featured" ? "featured" : sort === "price-low" ? "priceAsc" : sort === "price-high" ? "priceDesc" : "newest" })
        .then((data) => setProducts(data.products))
        .catch(() => setProducts([]))
        .finally(() => setSearchLoading(false));
    }, search ? 300 : 0);
    return () => window.clearTimeout(timer);
  }, [categories, category, invalidSearch, page, search, sort]);

  useEffect(() => {
    const nextSearch = searchParams.get("q") || "";
    setSearch((current) => (current === nextSearch ? current : nextSearch));
    if (nextSearch) setCategory("All");
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    if (!location.state?.resetShop) return;
    setCategory("All");
    setSort("featured");
    setPage(1);
    if (!searchParams.get("q")) setSearch("");
    navigate({ pathname: "/shop", search: searchParams.toString() ? `?${searchParams}` : "" }, { replace: true, state: null });
  }, [location.key]);

  useEffect(() => {
    if (searchParams.get("focus") === "search") window.setTimeout(() => searchInputRef.current?.focus(), 150);
  }, [searchParams]);

  const updateSearch = (value) => {
    setSearch(value);
    setPage(1);
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set("q", value);
    else nextParams.delete("q");
    nextParams.set("focus", "search");
    setSearchParams(nextParams, { replace: true });
  };

  const visible = useMemo(() => products.filter(() => !invalidSearch), [invalidSearch, products]);
  const totalPages = Math.max(1, page + (visible.length === perPage ? 1 : 0));

  const changeCategory = (next) => {
    setCategory(next);
    setPage(1);
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Shop" }]} />
      <h1 className="sr-only">Shop cold pressed oils</h1>
      <section className="section-padding">
        <Container>
          <SectionHeading eyebrow="Shop oils" title="Cold pressed staples for every kitchen" text="Filter by seed, compare flavor styles, and add your pantry favourites in a few calm clicks." />
          <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_180px_180px] lg:gap-4">
            <Input inputRef={searchInputRef} placeholder="Search oils" value={search} onChange={(event) => updateSearch(event.target.value)} aria-label="Search products" className="h-11 text-xs sm:h-[52px] sm:text-sm" />
            <select value={category} onChange={(event) => changeCategory(event.target.value)} className="h-11 min-w-0 rounded-xl border border-ink/10 bg-white px-3 text-sm font-semibold outline-none sm:h-[52px] sm:px-4">
              {categories.map((item) => <option key={item.id || item.name}>{item.name}</option>)}
            </select>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-11 min-w-0 rounded-xl border border-ink/10 bg-white px-3 text-sm font-semibold outline-none sm:h-[52px] sm:px-4">
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
          {searchLoading && <p className="mb-5 rounded-2xl bg-linen p-4 text-sm font-semibold text-ink/60">Searching products...</p>}
          {invalidSearch && <p className="mb-5 rounded-2xl bg-linen p-4 text-sm font-semibold text-clay">Enter at least 2 characters to search.</p>}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          {visible.length === 0 && !searchLoading && <p className="rounded-3xl bg-white p-10 text-center text-ink/60">No oils match your search.</p>}
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index + 1} type="button" onClick={() => setPage(index + 1)} className={`h-11 w-11 rounded-full text-sm font-bold transition ${page === index + 1 ? "bg-ink text-white" : "bg-white hover:bg-linen"}`}>{index + 1}</button>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
