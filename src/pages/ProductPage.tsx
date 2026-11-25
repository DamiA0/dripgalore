import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { COLOURS, PRODUCTS, type ColourKey, type Product } from "../data/products";
import ProductImage from "../components/ProductImage";
import ProductCard from "../components/ProductCard";
import { categoryLabel, formatPrice, sectionLabel } from "../utils/catalogue";
import { useBasket } from "../context/BasketContext";
import NotFound from "./NotFound";
import "./Shop.css";
import "./ProductPage.css";

export default function ProductPage() {
  const { slug } = useParams();
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return <NotFound />;
  // "key" resets the choices when you move to a different product
  return <ProductDetails key={product.id} product={product} />;
}

function ProductDetails({ product }: { product: Product }) {
  const { add } = useBasket();
  const [colour, setColour] = useState<ColourKey>(product.colours[0]);
  const [size, setSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0] : null
  );
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    document.title = `${product.name} | DripGalore`;
    return () => {
      document.title = "DripGalore | Demo Streetwear Store";
    };
  }, [product.name]);

  const onSale = product.wasPrice !== undefined;
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  function handleAdd() {
    if (!size) {
      setError("Please choose a size.");
      return;
    }
    add({ productId: product.id, colour, size, qty });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 3000);
  }

  return (
    <div className="container pd">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> /{" "}
        <Link to={`/shop/${product.section}`}>{sectionLabel(product.section)}</Link> /{" "}
        <Link to={`/shop/${product.section}/${product.category}`}>{categoryLabel(product.category)}</Link> /{" "}
        <span>{product.name}</span>
      </nav>

      <div className="pd-layout">
        {/* ---------- Gallery ---------- */}
        <div className="pd-gallery">
          <div className="pd-main">
            <ProductImage product={product} colour={colour} />
          </div>
          {product.colours.length > 1 && (
            <div className="pd-thumbs" role="group" aria-label="Choose a colour">
              {product.colours.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="pd-thumb"
                  aria-pressed={c === colour}
                  aria-label={COLOURS[c].name}
                  onClick={() => setColour(c)}
                >
                  <ProductImage product={product} colour={c} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---------- Info and buy box ---------- */}
        <div className="pd-info">
          <p className="pd-meta">
            {sectionLabel(product.section)} · {categoryLabel(product.category)}
            {product.isNew && <span className="tag">New</span>}
          </p>
          <h1 className="pd-title">{product.name}</h1>
          <p className="pd-price">
            {onSale && <s aria-label="Was">{formatPrice(product.wasPrice!)}</s>}
            <span className={onSale ? "now" : ""}>{formatPrice(product.price)}</span>
          </p>

          <fieldset>
            <legend>
              Colour: <strong>{COLOURS[colour].name}</strong>
            </legend>
            <div className="pd-colours">
              {product.colours.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="pd-colour"
                  style={{ background: COLOURS[c].hex }}
                  aria-label={COLOURS[c].name}
                  aria-pressed={c === colour}
                  onClick={() => setColour(c)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>
              Size{size && <>: <strong>{size}</strong></>}
            </legend>
            <div className="pd-size-grid">
              {product.sizes.map((s) => (
                <label key={s} className={`pd-size ${size === s ? "on" : ""}`}>
                  <input
                    type="radio"
                    name="size"
                    value={s}
                    checked={size === s}
                    onChange={() => {
                      setSize(s);
                      setError("");
                    }}
                  />
                  {s}
                </label>
              ))}
            </div>
            <Link to="/help/size-guide" className="pd-link">Size guide</Link>
          </fieldset>

          {error && <p className="pd-error" role="alert">{error}</p>}

          <div className="pd-buy">
            <label className="pd-qty">
              <span className="sr-only">Quantity</span>
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <button type="button" className="btn btn-accent pd-add" onClick={handleAdd}>
              Add to basket · {formatPrice(product.price * qty)}
            </button>
          </div>

          <ul className="pd-perks">
            <li>✓ Free UK delivery over £50</li>
            <li>✓ 30-day returns</li>
            <li>✓ Demo store: checkout uses Stripe test mode, no real payments</li>
          </ul>

          <div className="pd-accordion">
            <details open>
              <summary>Description</summary>
              <p>{product.description}</p>
            </details>
            <details>
              <summary>Fit &amp; fabric</summary>
              <p><strong>Fit:</strong> {product.fit}</p>
              <p><strong>Fabric:</strong> {product.fabric}</p>
            </details>
            <details>
              <summary>Delivery &amp; returns</summary>
              <p>Standard UK delivery in 3–5 working days, free on orders over £50. Return unworn items within 30 days. (Demo store: nothing is actually sent.)</p>
            </details>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="pd-related" aria-label="You might also like">
          <h2>You might also like</h2>
          <ul className="product-grid" data-cols="4">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} expanded={false} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {added && (
        <div className="pd-toast" role="status">
          ✓ Added to basket <Link to="/basket">View basket</Link>
        </div>
      )}
    </div>
  );
}