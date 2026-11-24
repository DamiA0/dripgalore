import { useState } from "react";
import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";
import { COLOURS, type ColourKey, type Product } from "../data/products";
import { categoryLabel, formatPrice, sectionLabel } from "../utils/catalogue";

interface Props {
  product: Product;
  expanded: boolean; // true in "1 per row" view
}

export default function ProductCard({ product, expanded }: Props) {
  const [colour, setColour] = useState<ColourKey>(product.colours[0]);
  const href = `/product/${product.slug}`;
  const onSale = product.wasPrice !== undefined;

  return (
    <article className={`product-card ${expanded ? "expanded" : ""}`}>
      <Link to={href} className="card-media" tabIndex={-1} aria-hidden="true">
        <ProductImage product={product} colour={colour} />
        <span className="tags">
          {product.isNew && <span className="tag">New</span>}
          {onSale && <span className="tag sale">Sale</span>}
        </span>
      </Link>

      <div className="card-body">
        <h3 className="card-title">
          <Link to={href}>{product.name}</Link>
        </h3>
        <p className="card-meta">
          {sectionLabel(product.section)} · {categoryLabel(product.category)}
        </p>
        <p className="card-price">
          {onSale && <s aria-label="Was">{formatPrice(product.wasPrice!)}</s>}
          <span className={onSale ? "now" : ""}>{formatPrice(product.price)}</span>
        </p>

        <div className="swatches" role="group" aria-label="Colours">
          {product.colours.map((c) => (
            <button
              key={c}
              type="button"
              className={`swatch ${c === colour ? "active" : ""}`}
              style={{ background: COLOURS[c].hex }}
              aria-label={COLOURS[c].name}
              aria-pressed={c === colour}
              onClick={() => setColour(c)}
            />
          ))}
        </div>

        {expanded && (
          <>
            <p className="card-desc">{product.description}</p>
            <p className="card-sizes">Sizes: {product.sizes.join(", ")}</p>
            <Link to={href} className="btn">View product</Link>
          </>
        )}
      </div>
    </article>
  );
}