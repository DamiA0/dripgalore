import { Link } from "react-router-dom";
import { COLOURS, type ColourKey } from "../data/products";
import type { Category } from "../data/navigation";
import { PRICE_RANGES, type FilterState } from "../utils/catalogue";

interface Props {
  filters: FilterState;
  categories: Category[];
  categoryHref: (slug: string | null) => string;
  sizes: string[];
  colours: ColourKey[];
  update: (key: string, value: string | null) => void;
  clear: () => void;
  open: boolean;
  onClose: () => void;
  resultCount: number;
}

// Add or remove a value from a comma-separated list
function toggle(list: string[], value: string): string | null {
  const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  return next.length ? next.join(",") : null;
}

export default function Filters({
  filters, categories, categoryHref, sizes, colours,
  update, clear, open, onClose, resultCount,
}: Props) {
  return (
    <>
      {open && <div className="filters-backdrop" onClick={onClose} />}

      <aside className={`filters ${open ? "open" : ""}`} aria-label="Filters">
        <div className="filters-head">
          <h2>Filters</h2>
          <button type="button" className="filters-close" onClick={onClose} aria-label="Close filters">✕</button>
        </div>

        <fieldset>
          <legend>Category</legend>
          <ul className="cat-list">
            <li>
              <Link to={categoryHref(null)} className={!filters.category ? "active" : ""}>All</Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={categoryHref(c.slug)} className={filters.category === c.slug ? "active" : ""}>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset>
          <legend>Size</legend>
          <div className="size-grid">
            {sizes.map((s) => {
              const on = filters.sizes.includes(s);
              return (
                <label key={s} className={`size-chip ${on ? "on" : ""}`}>
                  <input type="checkbox" checked={on} onChange={() => update("size", toggle(filters.sizes, s))} />
                  {s}
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend>Colour</legend>
          <div className="colour-list">
            {colours.map((c) => (
              <label key={c} className="colour-option">
                <input
                  type="checkbox"
                  checked={filters.colours.includes(c)}
                  onChange={() => update("colour", toggle(filters.colours, c))}
                />
                <span className="dot" style={{ background: COLOURS[c].hex }} />
                {COLOURS[c].name}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Price</legend>
          {PRICE_RANGES.map((r) => (
            <label key={r.id} className="radio-option">
              <input
                type="radio"
                name="price"
                checked={filters.price === r.id}
                onChange={() => update("price", r.id)}
              />
              {r.label}
            </label>
          ))}
          {filters.price && (
            <button type="button" className="link-btn" onClick={() => update("price", null)}>
              Any price
            </button>
          )}
        </fieldset>

        <div className="filters-foot">
          <button type="button" className="btn btn-outline" onClick={clear}>Clear all</button>
          <button type="button" className="btn show-results" onClick={onClose}>
            Show {resultCount} results
          </button>
        </div>
      </aside>
    </>
  );
}