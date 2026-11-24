import { Link } from "react-router-dom";
import "./Home.css";

const TILES = [
  { label: "Hoodies", to: "/shop?category=hoodies", tone: "t1" },
  { label: "Jumpers", to: "/shop?category=jumpers", tone: "t2" },
  { label: "Trousers", to: "/shop?category=trousers", tone: "t3" },
  { label: "T-shirts", to: "/shop?category=t-shirts", tone: "t4" },
  { label: "Jackets", to: "/shop?category=jackets", tone: "t5" },
  { label: "Accessories", to: "/shop/accessories", tone: "t6" },
];

const PERKS = ["Free UK delivery over £50", "30-day returns", "Secure checkout (test mode)"];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow">New season drop</p>
          <h1>
            Drip that
            <br />
            speaks for itself.
          </h1>
          <p className="hero-sub">
            Hoodies, jumpers, trousers and accessories for men and women, built for everyday wear.
          </p>
          <div className="hero-actions">
            <Link to="/shop/men" className="btn btn-accent">Shop men</Link>
            <Link to="/shop/women" className="btn btn-light">Shop women</Link>
          </div>
        </div>
      </section>

      <section className="container perks" aria-label="Why shop with us">
        <ul>
          {PERKS.map((perk) => (
            <li key={perk}>{perk}</li>
          ))}
        </ul>
      </section>

      <section className="container categories">
        <div className="section-head">
          <h2>Shop by category</h2>
          <Link to="/shop" className="text-link">View all</Link>
        </div>
        <ul className="tile-grid">
          {TILES.map((tile) => (
            <li key={tile.label}>
              <Link to={tile.to} className={`tile ${tile.tone}`}>
                <span className="tile-label">{tile.label}</span>
                <span className="tile-cta">Shop now →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}