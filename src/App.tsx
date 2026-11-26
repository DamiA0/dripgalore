import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import DemoBanner from "./components/DemoBanner";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductPage";
import NotFound from "./pages/NotFound";
import BasketPage from "./pages/BasketPage";
import CheckoutPage from "./pages/CheckoutPage";
import HelpLauncher from "./components/HelpLauncher";
import HelpPage from "./pages/HelpPage";
import { AboutPage, AccountPage, CreditsPage, PrivacyPage } from "./pages/InfoPages";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <a className="skip-link" href="#main">Skip to content</a>
      <DemoBanner />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:gender" element={<Shop />} />
          <Route path="/shop/:gender/:category" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/basket" element={<BasketPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/help/:topic" element={<HelpPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </main>
      <Footer />
      <HelpLauncher />
    </>
  );
}
