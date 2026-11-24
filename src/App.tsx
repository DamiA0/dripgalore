import { Routes, Route } from "react-router-dom";
import DemoBanner from "./components/DemoBanner";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <DemoBanner />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:gender" element={<Shop />} />
          <Route path="/shop/:gender/:category" element={<Shop />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
