import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../data/products";
import { FALLBACK_ANSWER, askAI, scriptedMatch } from "../utils/help";
import { formatPrice } from "../utils/catalogue";
import ProductImage from "./ProductImage";
import { CloseIcon } from "./Icons";
import "./HelpDrawer.css";

interface Message {
  from: "bot" | "user";
  text: string;
  ai?: boolean; // true if the answer came from the AI
}

const GENERAL_SUGGESTIONS = [
  "How much is delivery?",
  "What's your returns policy?",
  "How do I find my size?",
  "Is this a real shop?",
];

const ITEM_SUGGESTIONS = [
  "What's it made of?",
  "How does it fit?",
  "Is it warm enough for winter?",
  "How do I wash it?",
];

interface Props {
  open: boolean;
  onClose: () => void;
  product?: Product;
}

export default function HelpDrawer({ open, onClose, product }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      from: "bot",
      text: product
        ? `Hi! Ask me anything about the ${product.name}: fit, fabric, sizes, care, or delivery and returns.`
        : "Hi! I'm the DripGalore help assistant. Ask me about sizing, delivery, returns or payments.",
    },
  ]);

  // Open or close the <dialog> when "open" changes
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Keep the newest message in view
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, thinking]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || thinking) return;
    setInput("");
    setMessages((m) => [...m, { from: "user", text: q }]);

    // 1. Instant scripted answer if we have one
    const scripted = scriptedMatch(q, product);
    if (scripted) {
      setMessages((m) => [...m, { from: "bot", text: scripted }]);
      return;
    }

    // 2. Otherwise ask the AI (free Cloudflare Workers AI)
    setThinking(true);
    const aiAnswer = await askAI(q, product);
    setThinking(false);
    setMessages((m) => [
      ...m,
      aiAnswer ? { from: "bot", text: aiAnswer, ai: true } : { from: "bot", text: FALLBACK_ANSWER },
    ]);
  }

  const suggestions = product ? ITEM_SUGGESTIONS : GENERAL_SUGGESTIONS;

  return (
    <dialog
      ref={dialogRef}
      className="help-drawer"
      aria-labelledby="help-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // clicked the dark backdrop
      }}
    >
      <div className="help-inner">
        <header className="help-head">
          <h2 id="help-title">Need help?</h2>
          <button type="button" className="icon-btn" aria-label="Close help" onClick={onClose}>
            <CloseIcon />
          </button>
        </header>

        {product && (
          <div className="help-product">
            <div className="help-thumb">
              <ProductImage product={product} />
            </div>
            <div>
              <p className="help-product-name">{product.name}</p>
              <p className="help-product-price">{formatPrice(product.price)}</p>
            </div>
          </div>
        )}

        <div className="help-messages" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`bubble-wrap ${m.from}`}>
              <p className={`bubble ${m.from}`}>{m.text}</p>
              {m.ai && <span className="bubble-label">AI answer · may be wrong</span>}
            </div>
          ))}
          {thinking && (
            <div className="bubble-wrap bot">
              <p className="bubble bot thinking">Thinking…</p>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="help-suggestions">
          {suggestions.map((s) => (
            <button key={s} type="button" className="chip-btn" disabled={thinking} onClick={() => ask(s)}>
              {s}
            </button>
          ))}
        </div>

        <form
          className="help-form"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <label htmlFor="help-input" className="sr-only">Your question</label>
          <input
            id="help-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question…"
            maxLength={300}
            autoComplete="off"
          />
          <button type="submit" className="btn" disabled={!input.trim() || thinking}>Send</button>
        </form>

        <nav className="help-links" aria-label="Help topics">
          <Link to="/help/size-guide" onClick={onClose}>Size guide</Link>
          <Link to="/help/delivery" onClick={onClose}>Delivery</Link>
          <Link to="/help/returns" onClick={onClose}>Returns</Link>
        </nav>
      </div>
    </dialog>
  );
}