import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { COLOURS, SIZE_ORDER, type ColourKey } from "../data/products";
import { SECTIONS } from "../data/navigation";
import {
  SORT_OPTIONS, categoryLabel, filterProducts, paginate, readFilters, sortProducts,
} from "../utils/catalogue";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useProducts } from "../context/ProductsContext";
import ProductCard from "../components/ProductCard";
import Filters from "../components/Filters";
import GridToggle from "../components/GridToggle";
import Pagination from "../components/Pagination";
import { LoadError, LoadingBlock } from "../components/Status";
import "./Shop.css";

const PER_PAGE = 12;

// Every category once (for the "All products" page)
const ALL_CATEGORIES = SECTIONS.flatMap((s) => s.categories).filter(
  (c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i
);

export default function Shop() {
  const { gender, category } = useParams();
  const [params, setParams] = useSearchParams();
  const [cols, setCols] = useLocalStorage<number>("dg-grid", 3);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { products, loading, error, reload } = useProducts();

  const section = SECTIONS.find((s) => s.slug === gender);
  const filters = readFilters(params, section?.slug, category);

  // Products in this section/category, used to build the size and colour options
  const scope = products.filter(
    (p) =>
      (!filters.section || p.section === filters.section) &&
      (!filters.category || p.category === filters.category)
  );
  const sizes = SIZE_ORDER.filter((s) => scope.some((p) => p.sizes.includes(s)));
  const colours = (Object.keys(COLOURS) as ColourKey[]).filter((c) =>
    scope.some((p) => p.colours.includes(c))
  );

  const results = sortProducts(filterProducts(products, filters), filters.sort);
  const { items, totalPages, current } = paginate(results, filters.page, PER_PAGE);
  const activeCount = filters.sizes.length + filters.colours.length + (filters.price ? 1 : 0);

  // Change one filter in the web address (and go back to page 1)
  function update(key: string, value: string | null) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  }

  function goToPage(page: number) {
    update("page", page > 1 ? String(page) : null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearFilters() {
    const next = new URLSearchParams();
    const queryCategory = params.get("category");
    if (queryCategory && !category) next.set("category", queryCategory);
    setParams(next);
  }

  const categoryHref = (slug: string | null) =>
    section
      ? slug ? `/shop/${section.slug}/${slug}` : `/shop/${section.slug}`
      : slug ? `/shop?category=${slug}` : "/shop";

  const title =
    [section?.label, filters.category ? categoryLabel(filters.category) : null]
      .filter(Boolean)
      .join(" · ") || "All products";

  return (
    <div className="container shop">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> /{" "}
        {section ? <Link to={`/shop/${section.slug}`}>{section.label}</Link> : <span>Shop</span>}
        {filters.category && <> / <span>{categoryLabel(filters.category)}</span></>}
      </nav>

      <div className="shop-head">
        <h1 className="page-title">{title}</h1>
        {!loading && !error && <p className="result-count">{results.length} products</p>}
      </div>

      <div className="shop-toolbar">
        <button type="button" className="btn btn-outline filter-toggle" onClick={() => setFiltersOpen(true)}>
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>

        <label className="sort">
          Sort by
          <select
            value={filters.sort}
            onChange={(e) => update("sort", e.target.value === "popular" ? null : e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>

        <GridToggle value={cols} onChange={setCols} />
      </div>

      <div className="shop-layout">
        <Filters
          filters={filters}
          categories={section ? section.categories : ALL_CATEGORIES}
          categoryHref={categoryHref}
          sizes={sizes}
          colours={colours}
          update={update}
          clear={clearFilters}
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          resultCount={results.length}
        />

        <section aria-label="Products">
          {loading ? (
            <LoadingBlock label="Loading products…" />
          ) : error ? (
            <LoadError onRetry={reload} />
          ) : items.length === 0 ? (
            <div className="empty">
              <p>No products match those filters.</p>
              <button type="button" className="btn" onClick={clearFilters}>Clear filters</button>
            </div>
          ) : (
            <ul className="product-grid" data-cols={cols}>
              {items.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} expanded={cols === 1} />
                </li>
              ))}
            </ul>
          )}

          {!loading && !error && (
            <Pagination current={current} total={totalPages} onChange={goToPage} />
          )}
        </section>
      </div>
    </div>
  );
}