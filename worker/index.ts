// DripGalore back end (Cloudflare Worker). Handles everything under /api/.
import { FAQS } from "../src/data/faq";

interface Env {
  AI: { run: (model: string, input: unknown) => Promise<unknown> };
}

const MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8-fast";
const MAX_QUESTION_LENGTH = 300;

// Trim and shorten any text we receive, so nothing huge or odd reaches the AI
const clean = (value: unknown, max = 200): string =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";

const cleanList = (value: unknown): string =>
  Array.isArray(value) ? value.map((v) => clean(v, 20)).filter(Boolean).slice(0, 12).join(", ") : "";

function productFactsText(product: unknown): string {
  if (!product || typeof product !== "object") return "None (the customer is not viewing a product).";
  const p = product as Record<string, unknown>;
  return [
    `Name: ${clean(p.name, 80)}`,
    `Category: ${clean(p.category, 40)}`,
    `Price: ${clean(p.price, 60)}`,
    `Description: ${clean(p.description, 300)}`,
    `Fit: ${clean(p.fit, 120)}`,
    `Fabric: ${clean(p.fabric, 120)}`,
    `Sizes: ${cleanList(p.sizes)}`,
    `Colours: ${cleanList(p.colours)}`,
  ].join("\n");
}

const FAQ_TEXT = FAQS.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");

async function handleAsk(request: Request, env: Env): Promise<Response> {
  let body: { question?: unknown; product?: unknown };
  try {
    body = (await request.json()) as { question?: unknown; product?: unknown };
  } catch {
    return Response.json({ answer: null, error: "Invalid request" }, { status: 400 });
  }

  const question = clean(body.question, MAX_QUESTION_LENGTH);
  if (question.length < 2) {
    return Response.json({ answer: null, error: "Question is empty" }, { status: 400 });
  }

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
    productFactsText(body.product),
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
    // e.g. the free daily AI allowance is used up: the site falls back to scripted answers
    console.error("Workers AI error:", err);
    return Response.json({ answer: null, error: "AI unavailable" }, { status: 503 });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({ ok: true, service: "dripgalore-api", time: new Date().toISOString() });
    }

    if (url.pathname === "/api/ask") {
      if (request.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
      }
      return handleAsk(request, env);
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  },
} satisfies ExportedHandler<Env>;