-- Products shown in the shop (prices are in pence)
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  section TEXT NOT NULL CHECK (section IN ('men', 'women', 'accessories')),
  category TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  was_price INTEGER,                    -- original price if on sale
  colours TEXT NOT NULL,                -- JSON list, e.g. ["black","grey"]
  sizes TEXT NOT NULL,                  -- JSON list, e.g. ["S","M","L"]
  description TEXT NOT NULL,
  fit TEXT NOT NULL,
  fabric TEXT NOT NULL,
  is_new INTEGER NOT NULL DEFAULT 0,
  popularity INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,    -- 0 hides a product without deleting it
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_products_section_category ON products (section, category);
CREATE INDEX idx_products_price ON products (price);

-- Test orders from Stripe checkout (used in Phase 7B)
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT NOT NULL DEFAULT 'pending',   -- pending -> paid_test
  subtotal INTEGER NOT NULL,
  delivery INTEGER NOT NULL,
  total INTEGER NOT NULL,
  stripe_session_id TEXT
);

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  name TEXT NOT NULL,
  colour TEXT NOT NULL,
  size TEXT NOT NULL,
  qty INTEGER NOT NULL CHECK (qty BETWEEN 1 AND 10),
  unit_price INTEGER NOT NULL
);
CREATE INDEX idx_order_items_order ON order_items (order_id);