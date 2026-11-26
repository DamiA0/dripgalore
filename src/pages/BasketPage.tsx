import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBasket } from "../context/BasketContext";
import { COLOURS, type ColourKey } from "../data/products";
import ProductImage from "../components/ProductImage";
import { FREE_DELIVERY_FROM, basketLines, basketTotals } from "../utils/basket";
import { formatPrice } from "../utils/catalogue";
import "./BasketPage.css";
import { useProducts } from "../context/ProductsContext";
import { LoadingBlock } from "../components/Status";

export default function BasketPage() {
  const { items, count, setQty, remove, clear } = useBasket();
  const { products, loading } = useProducts();
  const lines = basketLines(items, products);
  const totals = basketTotals(lines);

  useEffect(() => {
    document.title = "Basket | DripGalore";
    return () => {
      document.title = "DripGalore | Demo Streetwear Store";
    };
  }, []);

  if (loading) return <div className="container"><LoadingBlock label="Loading basket…" /></div>;
  if (lines.length === 0) {
    return (
      <section className="container placeholder">
        <h1 className="page-title">Your basket is empty</h1>
        <p>Find something you like and it will show up here.</p>
        <div className="basket-empty-actions">
          <Link to="/shop/men" className="btn">Shop men</Link>
          <Link to="/shop/women" className="btn btn-outline">Shop women</Link>
        </div>
      </section>
    );
  }

  const freePercent = Math.min(100, (totals.subtotal / FREE_DELIVERY_FROM) * 100);

  return (
    <div className="container basket">
      <h1 className="page-title">
        Basket <span className="basket-count">({count} {count === 1 ? "item" : "items"})</span>
      </h1>

      <div className="basket-layout">
        <ul className="basket-list">
          {lines.map((line) => {
            const key = { productId: line.productId, colour: line.colour, size: line.size };
            const colour = line.colour as ColourKey;
            const href = `/product/${line.product.slug}`;
            return (
              <li key={`${line.productId}-${line.colour}-${line.size}`} className="basket-item">
                <Link to={href} className="basket-img" tabIndex={-1} aria-hidden="true">
                  <ProductImage product={line.product} colour={colour} />
                </Link>

                <div className="basket-details">
                  <h2><Link to={href}>{line.product.name}</Link></h2>
                  <p className="basket-variant">
                    {COLOURS[colour]?.name ?? line.colour} · Size {line.size}
                  </p>
                  <p className="basket-unit">{formatPrice(line.product.price)} each</p>

                  <div className="basket-actions">
                    <label>
                      Qty
                      <select value={line.qty} onChange={(e) => setQty(key, Number(e.target.value))}>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </label>
                    <button type="button" className="link-btn" onClick={() => remove(key)}>
                      Remove
                    </button>
                  </div>
                </div>

                <p className="basket-line-total">{formatPrice(line.lineTotal)}</p>
              </li>
            );
          })}
        </ul>

        <aside className="basket-summary" aria-label="Order summary">
          <h2>Order summary</h2>

          {totals.toFreeDelivery > 0 ? (
            <p className="free-msg">Spend {formatPrice(totals.toFreeDelivery)} more for free delivery</p>
          ) : (
            <p className="free-msg ok">✓ You've got free delivery</p>
          )}
          <div className="free-bar" aria-hidden="true">
            <span style={{ width: `${freePercent}%` }} />
          </div>

          <dl>
            <div><dt>Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
            {totals.savings > 0 && (
              <div className="savings"><dt>You save</dt><dd>{formatPrice(totals.savings)}</dd></div>
            )}
            <div><dt>Delivery</dt><dd>{totals.delivery === 0 ? "Free" : formatPrice(totals.delivery)}</dd></div>
            <div className="total"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
          </dl>

          <Link to="/checkout" className="btn btn-accent checkout-btn">Checkout (demo)</Link>
          <p className="demo-note">Demo store: checkout uses Stripe test mode. No real payment is ever taken.</p>
          <button type="button" className="link-btn" onClick={clear}>Clear basket</button>
        </aside>
      </div>
    </div>
  );
}