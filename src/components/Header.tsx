import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import { SECTIONS } from "../data/navigation";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "./Icons";
import { useBasket } from "../context/BasketContext";
import "./Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count: basketCount } = useBasket();

  return (
    <header className="site-header">
      <div className="header-inner container">
        <button
          className="icon-btn menu-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Link to="/" className="logo-link" aria-label="DripGalore home">
          <Logo />
        </Link>

        <nav
          id="main-nav"
          className={`main-nav ${menuOpen ? "open" : ""}`}
          aria-label="Main"
          onClick={(e) => {
            // close the mobile menu when any link is clicked
            if ((e.target as HTMLElement).closest("a")) setMenuOpen(false);
          }}
        >
          <ul className="nav-list">
            {SECTIONS.map((section) => (
              <li key={section.slug} className="nav-item">
                <NavLink to={`/shop/${section.slug}`} className="nav-link">
                  {section.label}
                </NavLink>
                <ul className="dropdown">
                  {section.categories.map((cat) => (
                    <li key={cat.slug}>
                      <Link to={`/shop/${section.slug}/${cat.slug}`}>{cat.label}</Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <Link to="/shop" className="icon-btn" aria-label="Search products">
            <SearchIcon />
          </Link>
          <Link to="/account" className="icon-btn" aria-label="Account">
            <UserIcon />
          </Link>
          <Link to="/basket" className="icon-btn" aria-label={`Basket, ${basketCount} items`}>
            <BagIcon />
            {basketCount > 0 && <span className="badge" aria-hidden="true">{basketCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}