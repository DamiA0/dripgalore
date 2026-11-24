import { Link } from "react-router-dom";
import Logo from "./Logo";
import { SECTIONS } from "../data/navigation";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>A demo streetwear store. No real products, orders or payments.</p>
        </div>

        <div>
          <h2>Shop</h2>
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.slug}><Link to={`/shop/${s.slug}`}>{s.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Help</h2>
          <ul>
            <li><Link to="/help/delivery">Delivery</Link></li>
            <li><Link to="/help/returns">Returns</Link></li>
            <li><Link to="/help/size-guide">Size guide</Link></li>
          </ul>
        </div>

        <div>
          <h2>About</h2>
          <ul>
            <li><Link to="/about">About this project</Link></li>
            <li><Link to="/privacy">Privacy &amp; cookies</Link></li>
            <li><Link to="/credits">Photo credits</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} DripGalore (demo)</p>
        <p>
          Built by Solomon Adepoju ·{" "}
          <a href="https://fsdportfolio.com" target="_blank" rel="noopener">fsdportfolio.com</a>
        </p>
      </div>
    </footer>
  );
}