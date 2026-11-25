import { useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { FAQS, HELP_TOPICS, MEN_SIZES, WOMEN_SIZES } from "../data/faq";
import HelpDrawer from "../components/HelpDrawer";
import NotFound from "./NotFound";
import "./HelpPage.css";

export default function HelpPage() {
  const { topic } = useParams();
  const [askOpen, setAskOpen] = useState(false);

  const current = HELP_TOPICS.find((t) => t.slug === topic);
  if (topic && !current) return <NotFound />;
  const faqs = current ? FAQS.filter((f) => f.topic === current.slug) : FAQS;

  return (
    <div className="container help-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> /{" "}
        {current ? (
          <>
            <Link to="/help">Help</Link> / <span>{current.label}</span>
          </>
        ) : (
          <span>Help</span>
        )}
      </nav>

      <h1 className="page-title">{current ? current.label : "Help centre"}</h1>

      <div className="help-layout">
        <nav className="help-nav" aria-label="Help topics">
          <NavLink to="/help" end>All questions</NavLink>
          {HELP_TOPICS.map((t) => (
            <NavLink key={t.slug} to={`/help/${t.slug}`}>{t.label}</NavLink>
          ))}
        </nav>

        <div>
          {current?.slug === "size-guide" && <SizeGuide />}

          <div className="faq-list">
            {faqs.map((f) => (
              <details key={f.question}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>

          <div className="help-cta">
            <div>
              <h2>Still need help?</h2>
              <p>Ask our help assistant a question.</p>
            </div>
            <button type="button" className="btn" onClick={() => setAskOpen(true)}>
              Ask a question
            </button>
          </div>
        </div>
      </div>

      <HelpDrawer open={askOpen} onClose={() => setAskOpen(false)} />
    </div>
  );
}

function SizeGuide() {
  return (
    <>
      <ul className="measure-tips">
        <li><strong>Chest/bust:</strong> measure around the fullest part, keeping the tape level.</li>
        <li><strong>Waist:</strong> measure around your natural waistline.</li>
        <li>All measurements are body measurements in centimetres.</li>
      </ul>

      <div className="table-scroll">
        <table className="size-table">
          <caption>Men</caption>
          <thead>
            <tr><th scope="col">Size</th><th scope="col">Chest (cm)</th><th scope="col">Waist (cm)</th></tr>
          </thead>
          <tbody>
            {MEN_SIZES.map((s) => (
              <tr key={s.size}><th scope="row">{s.size}</th><td>{s.chest}</td><td>{s.waist}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-scroll">
        <table className="size-table">
          <caption>Women</caption>
          <thead>
            <tr><th scope="col">Size</th><th scope="col">UK size</th><th scope="col">Bust (cm)</th><th scope="col">Waist (cm)</th></tr>
          </thead>
          <tbody>
            {WOMEN_SIZES.map((s) => (
              <tr key={s.size}><th scope="row">{s.size}</th><td>{s.uk}</td><td>{s.bust}</td><td>{s.waist}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}