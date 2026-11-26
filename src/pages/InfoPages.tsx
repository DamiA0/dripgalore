import { Link } from "react-router-dom";
import { PHOTO_CREDITS } from "../data/credits";
import "./InfoPages.css";

export function AboutPage() {
  return (
    <article className="container info-page">
      <h1 className="page-title">About this project</h1>
      <p className="lead">
        DripGalore is a <strong>demo streetwear store</strong> built by Solomon Adepoju as a
        full-stack portfolio project. The brand, products and prices are invented, nothing is for
        sale, and no real payments are ever taken.
      </p>

      <h2>What it does</h2>
      <ul className="prose-list">
        <li>Browse men's, women's and accessories ranges by category</li>
        <li>Filter by size, colour and price, sort results, and page through them</li>
        <li>Switch the grid between 1, 2, 3 or 4 products per row (it remembers your choice)</li>
        <li>Product pages with colour and size selection and an add-to-basket flow</li>
        <li>A basket that's saved in your browser, with live totals and free-delivery progress</li>
        <li>A help centre, size guide and a help assistant for questions about each product</li>
      </ul>

      <h2>How it's built</h2>
      <ul className="prose-list">
        <li><strong>Front end:</strong> React, TypeScript, Vite and React Router</li>
        <li><strong>Back end:</strong> a Cloudflare Worker serving the API under <code>/api</code></li>
        <li><strong>Hosting:</strong> Cloudflare, with automatic deploys on every push to GitHub</li>
        <li><strong>Coming next:</strong> AI help answers (Workers AI), a database (Cloudflare D1), Stripe test-mode checkout, and an installable app (PWA)</li>
      </ul>

      <h2>Links</h2>
      <div className="info-actions">
        <a className="btn" href="https://github.com/DamiA0/dripgalore" target="_blank" rel="noopener">
          View the code on GitHub
        </a>
        <a className="btn btn-outline" href="https://fsdportfolio.com" target="_blank" rel="noopener">
          Solomon's portfolio
        </a>
      </div>
    </article>
  );
}

export function PrivacyPage() {
  return (
    <article className="container info-page">
      <h1 className="page-title">Privacy &amp; cookies</h1>
      <p className="lead">
        DripGalore is a demo store. It doesn't collect personal information, and it doesn't use
        advertising or tracking cookies.
      </p>

      <h2>What's stored on your device</h2>
      <p>The site saves a small amount of information in your browser's local storage so it works properly:</p>
      <ul className="prose-list">
        <li><strong>Your basket</strong> (<code>dg-basket</code>): the items, sizes and quantities you add.</li>
        <li><strong>Your grid choice</strong> (<code>dg-grid</code>): how many products you like to see per row.</li>
      </ul>
      <p>
        This stays on your device and isn't sent to us. You can remove it at any time by clearing
        your basket or your browser's site data.
      </p>

      <h2>Help questions</h2>
      <p>
        Questions you type into the help assistant are answered on the site. When AI answers are
        switched on, your question and the product details are sent to Cloudflare to generate a
        reply. Please don't include personal information in your questions.
      </p>

      <h2>Checkout</h2>
      <p>
        Checkout runs on Stripe in test mode, so no real payment details are taken. Stripe's own
        privacy policy applies on its payment pages.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this project? Email{" "}
        <a href="mailto:sadepoju0@outlook.com">sadepoju0@outlook.com</a>.
      </p>
    </article>
  );
}

export function CreditsPage() {
  return (
    <article className="container info-page">
      <h1 className="page-title">Photo credits</h1>
      <p className="lead">
        Product photos are free-to-use images from Pexels and Unsplash. Thank you to the
        photographers. Products without a photo show an illustration instead.
      </p>

      {PHOTO_CREDITS.length === 0 ? (
        <p>Photo credits will be listed here as photos are added.</p>
      ) : (
        <ul className="credits-list">
          {PHOTO_CREDITS.map((c) => (
            <li key={c.url}>
              <strong>{c.product}</strong>: photo by{" "}
              <a href={c.url} target="_blank" rel="noopener">{c.photographer}</a> on {c.source}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function AccountPage() {
  return (
    <section className="container placeholder">
      <h1 className="page-title">Account</h1>
      <p>
        Customer accounts with order history and saved items are coming soon. For now you can
        check out as a guest.
      </p>
      <Link to="/shop" className="btn">Continue shopping</Link>
    </section>
  );
}