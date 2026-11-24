import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container placeholder">
      <h1 className="page-title">Page not found</h1>
      <p>This page doesn't exist yet. It may be coming in a later phase.</p>
      <Link to="/" className="btn">Back to home</Link>
    </section>
  );
}