// DripGalore back end (Cloudflare Worker). Handles everything under /api/.
import { FAQS } from "../src/data/faq";

interface Env {
  DB: D1Database;
  AI: { run: (model: string, input: unknown) => Promise<unknown> };
}

// A product as stored in the database
interface ProductRow {
  id: number;
  slug: string;
  name: string;
  section: string;
  category: string;
  price: number;
  was_price: number | null;
  colours: string;
  sizes: string;
  description: string;
  fit: string;
  fabric: string;
  is_new: number;
  popularity: number;
}

const MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8-fast";
const MAX_QUESTION_LENGTH = 300;

const formatPrice = (pence: number) => `£${(pence / 100).toFixed(2)}`;

const clean = (value: unknown, max = 200): string =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";

// Turn a database row into the shape the website uses
function toProduct(r: ProductRow) {
  return {
    id: String(r.id),
    slug: r.slug,
    name: r.name,
    section: r.section,
    category: r.category,
    price: r.price,
    wasPrice: r.was_price ?? undefined,
    colours: JSON.parse(r.colours) as string[],
    sizes: JSON.parse(r.sizes) as string[],
    description: r.description,
    fit: r.fit,
    fabric: r.fabric,
    isNew: r.is_new === 1,
    popularity: r.popularity,
  };
}

// ---------- GET /api/products ----------
async function handleProducts(env: Env): Promise<Response> {
  const { results } = await env.DB
    .prepare("SELECT * FROM products WHERE active = 1 ORDER BY id")
    .all<ProductRow>();
  return Response.json(
    { products: results.map(toProduct) },
    { headers: { "Cache-Control": "public, max-age=60" } }
  );
}

// ---------- GET /api/products/:slug ----------
async function handleProduct(env: Env, slug: string): Promise<Response> {
  const row = await env.DB
    .prepare("SELECT * FROM products WHERE slug = ? AND active = 1")
    .bind(slug)
    .first<ProductRow>();
  if (!row) return Response.json({ error: "Product not found" }, { status: 404 });
  return Response.json({ product: toProduct(row) });
}

// ---------- POST /api/ask (AI help) ----------
async function getProductById(env: Env, id: unknown): Promise<ProductRow | null> {
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1) return null;
  return env.DB.prepare("SELECT * FROM products WHERE id = ? AND active = 1").bind(n).first<ProductRow>();
}

function productFactsText(p: ProductRow | null): string {
  if (!p) return "None (the customer is not viewing a product).";
  const price = p.was_price
    ? `${formatPrice(p.price)} (on sale, was ${formatPrice(p.was_price)})`
    : formatPrice(p.price);
  return [
    `Name: ${p.name}`,
    `Section: ${p.section}`,
    `Category: ${p.category}`,
    `Price: ${price}`,
    `Description: ${p.description}`,
    `Fit: ${p.fit}`,
    `Fabric: ${p.fabric}`,
    `Sizes: ${(JSON.parse(p.sizes) as string[]).join(", ")}`,
    `Colours: ${(JSON.parse(p.colours) as string[]).join(", ")}`,
  ].join("\n");
}

const FAQ_TEXT = FAQS.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");

async function handleAsk(request: Request, env: Env): Promise<Response> {
  let body: { question?: unknown; productId?: unknown };
  try {
    body = (await request.json()) as { question?: unknown; productId?: unknown };
  } catch {
    return Response.json({ answer: null, error: "Invalid request" }, { status: 400 });
  }

  const question = clean(body.question, MAX_QUESTION_LENGTH);
  if (question.length < 2) {
    return Response.json({ answer: null, error: "Question is empty" }, { status: 400 });
  }

  // Look the product up in OUR database: never trust product details sent by the browser
  const product = body.productId ? await getProductById(env, body.productId) : null;

  const systemPrompt = [
    "You are the friendly help assistant for DripGalore, a DEMO streetwear store built as a portfolio project by Solomon Adepoju.",
    "Nothing is really for sale and no real payments are taken (checkout uses Stripe test mode).",
    "Rules:",
    "- Answer using ONLY the facts below. If the answer is not in the facts, say you're not sure and suggest the Help centre.",
    "- Never make up prices, discounts, stock levels, delivery times or policies.",
    "- Never ask for personal or payment details.",
    "- Keep answers short: 1 to 3 sentences, plain text, British English.",
    "- Only help with shopping questions about DripGalore. Politely decline anything else.",
    "",
    "STORE FAQ:",
    FAQ_TEXT,
    "",
    "PRODUCT THE CUSTOMER IS VIEWING:",
    productFactsText(product),
  ].join("\n");

  try {
    const result = (await env.AI.run(MODEL, {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      max_tokens: 250,
      temperature: 0.3,
    })) as { response?: string };

    const answer = result.response?.trim();
    return Response.json({ answer: answer || null, source: "ai" });
  } catch (err) {
    console.error("Workers AI error:", err);
    return Response.json({ answer: null, error: "AI unavailable" }, { status: 503 });
  }
}

// ---------- Router ----------
export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    try {
      if (pathname === "/api/health") {
        return Response.json({ ok: true, service: "dripgalore-api", time: new Date().toISOString() });
      }

      if (pathname === "/api/products" && request.method === "GET") {
        return await handleProducts(env);
      }

      const productMatch = pathname.match(/^\/api\/products\/([a-z0-9-]+)$/);
      if (productMatch && request.method === "GET") {
        return await handleProduct(env, productMatch[1]);
      }

      if (pathname === "/api/ask") {
        if (request.method !== "POST") {
          return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
        }
        return await handleAsk(request, env);
      }

      return Response.json({ error: "Not found" }, { status: 404 });
    } catch (err) {
      console.error("API error:", err);
      return Response.json({ error: "Server error" }, { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;