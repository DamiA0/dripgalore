import { Link } from "react-router-dom";

export default function CheckoutPage() {
  return (
    <section className="container placeholder">
      <h1 className="page-title">Checkout</h1>
      <p>
        Secure test checkout with Stripe is coming in Phase 7. This is a demo store, so no real
        payments will ever be taken.
      </p>
      <Link to="/basket" className="btn">Back to basket</Link>
    </section>
  );
}