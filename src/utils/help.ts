import { COLOURS, type Product } from "../data/products";
import { FAQS } from "../data/faq";
import { formatPrice } from "./catalogue";

export const FALLBACK_ANSWER =
  "I'm not sure about that one yet. I can help with sizing, delivery, returns, payments and product details. Try one of the suggestions below, or browse the Help centre.";

// Returns a function that checks whether the question contains any of the given words or phrases
function matcher(question: string) {
  const q = ` ${question.toLowerCase().replace(/[^a-z0-9£ ]+/g, " ").replace(/\s+/g, " ").trim()} `;
  return (...terms: string[]) => terms.some((t) => q.includes(` ${t} `));
}

function careFor(product: Product): string {
  switch (product.category) {
    case "jumpers":
    case "beanies":
      return "Hand wash or use a wool cycle at 30°C, then dry flat. Don't tumble dry.";
    case "jackets":
      return "Machine wash at 30°C on a gentle cycle with the zip done up. Line dry and don't iron the shell.";
    case "bags":
      return "Wipe clean with a damp cloth. Don't machine wash.";
    case "caps":
      return "Spot clean with a damp cloth to keep the peak in shape.";
    default:
      return "Machine wash at 30°C, inside out, with similar colours. Don't tumble dry, and iron on low, avoiding any print.";
  }
}

function productAnswer(question: string, p: Product): string | null {
  const has = matcher(question);

  // General shop questions (delivery, returns...) go to the FAQ instead
  if (has("delivery", "shipping", "postage", "return", "returns", "refund", "pay", "payment", "account", "track", "demo", "real")) {
    return null;
  }

  if (has("stock", "sold out", "restock")) {
    return "This is a demo store, so every size shows as available. There's no real stock.";
  }
  if (has("fabric", "material", "materials", "made", "cotton", "polyester", "wool")) {
    return `The ${p.name} is made from ${p.fabric}.`;
  }
  if (has("wash", "washing", "care", "clean", "iron", "dry", "tumble")) {
    return careFor(p);
  }
  if (has("fit", "fits", "fitting", "baggy", "oversized", "tight", "slim", "true to size", "size up", "size down", "between sizes")) {
    return `${p.fit}. If you're between sizes, take your usual size for the intended fit, or size up for a looser look. The size guide has exact measurements.`;
  }
  if (has("size", "sizes", "xs", "xxl", "available")) {
    return `The ${p.name} comes in ${p.sizes.join(", ")}. Check the size guide for chest and waist measurements.`;
  }
  if (has("colour", "colours", "color", "colors")) {
    return `It comes in ${p.colours.map((c) => COLOURS[c].name).join(", ")}. Use the colour dots on the page to see each one.`;
  }
  if (has("price", "cost", "costs", "sale", "discount", "cheaper", "how much is it", "how much does it")) {
    return p.wasPrice
      ? `It's on sale for ${formatPrice(p.price)}, down from ${formatPrice(p.wasPrice)}.`
      : `It's ${formatPrice(p.price)}, and delivery is free on orders over £50.`;
  }
  return null;
}

function faqAnswer(question: string): string | null {
  const has = matcher(question);
  let best: { answer: string; score: number } | null = null;
  for (const faq of FAQS) {
    const score = faq.keywords.filter((k) => has(k)).length;
    if (score > 0 && (!best || score > best.score)) best = { answer: faq.answer, score };
  }
  return best?.answer ?? null;
}

// A scripted answer if we have one, otherwise null
export function scriptedMatch(question: string, product?: Product): string | null {
  return (product && productAnswer(question, product)) || faqAnswer(question) || null;
}

export function scriptedAnswer(question: string, product?: Product): string {
  return scriptedMatch(question, product) ?? FALLBACK_ANSWER;
}

// Ask the back end's AI. Returns null if it's unavailable for any reason.
export async function askAI(question: string, product?: Product): Promise<string | null> {
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, productId: product?.id }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { answer?: string | null };
    return data.answer?.trim() || null;
  } catch {
    return null;
  }
}