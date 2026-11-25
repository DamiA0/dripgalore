import { PRODUCTS, type Product } from "../data/products";
import type { BasketItem } from "../context/BasketContext";

export const FREE_DELIVERY_FROM = 5000; // £50.00
export const DELIVERY_FEE = 399;        // £3.99

export interface BasketLine extends BasketItem {
  product: Product;
  lineTotal: number;
}

// Join each basket item with its product (skips anything no longer in the catalogue)
export function basketLines(items: BasketItem[]): BasketLine[] {
  return items.flatMap((item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    return product ? [{ ...item, product, lineTotal: product.price * item.qty }] : [];
  });
}

export function basketTotals(lines: BasketLine[]) {
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const savings = lines.reduce(
    (sum, l) => sum + ((l.product.wasPrice ?? l.product.price) - l.product.price) * l.qty,
    0
  );
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  return {
    subtotal,
    savings,
    delivery,
    total: subtotal + delivery,
    toFreeDelivery: Math.max(0, FREE_DELIVERY_FROM - subtotal),
  };
}