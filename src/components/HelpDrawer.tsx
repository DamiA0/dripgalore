import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../data/products";
import { scriptedAnswer } from "../utils/help";
import { formatPrice } from "../utils/catalogue";
import ProductImage from "./ProductImage";
import { CloseIcon } from "./Icons";
import "./HelpDrawer.css";

interface Message {
  from: "bot" | "user";
  text: string;
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
  "What sizes does it come in?",
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
  }, [messages]);

  function ask(question: string) {
    const q = question.trim();
    if (!q) return;
    setMessages((m) => [...m, { from: "user", text: q }, { from: "bot", text: scriptedAnswer(q, product) }]);
    setInput("");
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
            <p key={i} className={`bubble ${m.from}`}>{m.text}</p>
          ))}
          <div ref={endRef} />
        </div>

        <div className="help-suggestions">
          {suggestions.map((s) => (
            <button key={s} type="button" className="chip-btn" onClick={() => ask(s)}>
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
          <button type="submit" className="btn" disabled={!input.trim()}>Send</button>
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