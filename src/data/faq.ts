export type HelpTopic = "delivery" | "returns" | "size-guide" | "orders";

export const HELP_TOPICS: { slug: HelpTopic; label: string }[] = [
  { slug: "delivery", label: "Delivery" },
  { slug: "returns", label: "Returns & refunds" },
  { slug: "size-guide", label: "Size guide" },
  { slug: "orders", label: "Orders & payments" },
];

export interface Faq {
  topic: HelpTopic;
  question: string;
  answer: string;
  keywords: string[]; // words that make the assistant pick this answer
}

export const FAQS: Faq[] = [
  // ---- Delivery ----
  {
    topic: "delivery",
    question: "How much is delivery?",
    answer: "Standard UK delivery is £3.99, and it's free on orders over £50. (Demo store: nothing is actually sent.)",
    keywords: ["delivery", "shipping", "postage", "free delivery", "delivery cost"],
  },
  {
    topic: "delivery",
    question: "How long does delivery take?",
    answer: "Standard UK delivery takes 3–5 working days. Orders placed before 2pm on a weekday are dispatched the same day.",
    keywords: ["how long", "when will", "arrive", "days", "dispatch", "next day"],
  },
  {
    topic: "delivery",
    question: "Do you deliver outside the UK?",
    answer: "Not at the moment. DripGalore only delivers to UK addresses.",
    keywords: ["international", "abroad", "outside", "overseas", "europe", "usa", "worldwide"],
  },
  {
    topic: "delivery",
    question: "Can I track my order?",
    answer: "Yes. Once your order is dispatched you'd get an email with a tracking link. (Demo store: test orders aren't shipped, so there's nothing to track.)",
    keywords: ["track", "tracking", "where is my order"],
  },

  // ---- Returns ----
  {
    topic: "returns",
    question: "What is your returns policy?",
    answer: "You can return unworn items with their tags within 30 days of delivery for a full refund.",
    keywords: ["return", "returns", "exchange", "policy", "send back"],
  },
  {
    topic: "returns",
    question: "How do I return an item?",
    answer: "Start a return from the link in your order confirmation email, print the free returns label, and drop the parcel at any post office.",
    keywords: ["how do i return", "returns label", "start a return"],
  },
  {
    topic: "returns",
    question: "When will I get my refund?",
    answer: "Refunds go back to your original payment method within 5 working days of us receiving your return.",
    keywords: ["refund", "money back", "refunded"],
  },

  // ---- Size guide ----
  {
    topic: "size-guide",
    question: "How do I find my size?",
    answer: "Measure your chest and waist, then compare them with the size charts in our size guide. If you're between sizes, size up for a looser fit.",
    keywords: ["size", "sizing", "measure", "measurements", "size guide", "size chart", "my size"],
  },
  {
    topic: "size-guide",
    question: "Do your clothes fit true to size?",
    answer: "Most pieces fit true to size. Hoodies and tees have a relaxed, boxy cut, so size down if you prefer a closer fit. Each product page tells you the fit.",
    keywords: ["true to size", "small", "big", "large", "fit", "fitting", "size up", "size down"],
  },

  // ---- Orders & payments ----
  {
    topic: "orders",
    question: "Is this a real shop?",
    answer: "No. DripGalore is a demo store built by Solomon Adepoju as a portfolio project. The products are made up, nothing is for sale, and checkout uses Stripe's test mode, so no real payments are ever taken.",
    keywords: ["real", "demo", "fake", "legit", "scam", "portfolio", "who made"],
  },
  {
    topic: "orders",
    question: "How can I pay?",
    answer: "Checkout runs on Stripe's secure payment page, which accepts debit and credit cards. On this demo store it's in test mode: use the test card 4242 4242 4242 4242 and no money is taken.",
    keywords: ["pay", "payment", "payments", "card", "paypal", "apple pay", "klarna", "checkout"],
  },
  {
    topic: "orders",
    question: "Can I change or cancel my order?",
    answer: "Orders can be changed or cancelled within 1 hour of being placed. After that they're packed for dispatch.",
    keywords: ["cancel", "change my order", "amend", "edit order"],
  },
  {
    topic: "orders",
    question: "Do I need an account to order?",
    answer: "No, you can check out as a guest. Accounts with order history are coming soon.",
    keywords: ["account", "sign up", "register", "login", "log in", "guest"],
  },
];

export const MEN_SIZES = [
  { size: "XS", chest: "86–91", waist: "71–76" },
  { size: "S", chest: "91–96", waist: "76–81" },
  { size: "M", chest: "96–101", waist: "81–86" },
  { size: "L", chest: "101–106", waist: "86–91" },
  { size: "XL", chest: "106–111", waist: "91–96" },
  { size: "XXL", chest: "111–116", waist: "96–101" },
];

export const WOMEN_SIZES = [
  { size: "XS", uk: "6", bust: "78–82", waist: "60–64" },
  { size: "S", uk: "8–10", bust: "82–88", waist: "64–70" },
  { size: "M", uk: "12", bust: "88–93", waist: "70–75" },
  { size: "L", uk: "14", bust: "93–98", waist: "75–80" },
  { size: "XL", uk: "16", bust: "98–104", waist: "80–86" },
];