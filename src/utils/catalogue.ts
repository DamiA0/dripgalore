import type { ColourKey, Product } from "../data/products";
import { SECTIONS } from "../data/navigation";

export type SortKey = "popular" | "newest" | "price-asc" | "price-desc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export const PRICE_RANGES = [
  { id: "0-25", label: "Under £25", min: 0, max: 2500 },
  { id: "25-50", label: "£25 – £50", min: 2500, max: 5000 },
  { id: "50-75", label: "£50 – £75", min: 5000, max: 7500 },
  { id: "75-up", label: "£75 and over", min: 7500, max: Infinity },
];

export interface FilterState {
  section?: string;
  category?: string;
  sizes: string[];
  colours: string[];
  price?: string;
  sort: SortKey;
  page: number;
}

// Read the filters from the web address, e.g. ?size=M,L&colour=black&sort=price-asc&page=2
export function readFilters(
  params: URLSearchParams,
  section?: string,
  routeCategory?: string
): FilterState {
  const list = (key: string) => params.get(key)?.split(",").filter(Boolean) ?? [];
  const sort = params.get("sort");
  return {
    section,
    category: routeCategory ?? params.get("category") ?? undefined,
    sizes: list("size"),
    colours: list("colour"),
    price: params.get("price") ?? undefined,
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortKey) : "popular",
    page: Math.max(1, Number(params.get("page")) || 1),
  };
}

export function filterProducts(products: Product[], f: FilterState): Product[] {
  const range = PRICE_RANGES.find((r) => r.id === f.price);
  return products.filter(
    (p) =>
      (!f.section || p.section === f.section) &&
      (!f.category || p.category === f.category) &&
      (f.sizes.length === 0 || f.sizes.some((s) => p.sizes.includes(s))) &&
      (f.colours.length === 0 || f.colours.some((c) => p.colours.includes(c as ColourKey))) &&
      (!range || (p.price >= range.min && p.price < range.max))
  );
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "newest":
      return copy.sort((a, b) => Number(b.isNew) - Number(a.isNew) || Number(b.id) - Number(a.id));
    default:
      return copy.sort((a, b) => b.popularity - a.popularity);
  }
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * perPage;
  return { items: items.slice(start, start + perPage), totalPages, current };
}

export const formatPrice = (pence: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);

export function categoryLabel(slug: string): string {
  for (const section of SECTIONS) {
    const found = section.categories.find((c) => c.slug === slug);
    if (found) return found.label;
  }
  return slug;
}

export function sectionLabel(slug: string): string {
  return SECTIONS.find((s) => s.slug === slug)?.label ?? slug;
}