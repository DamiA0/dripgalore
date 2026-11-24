import { COLOURS, type ColourKey, type Product } from "../data/products";

const SHAPES: Record<string, string[]> = {
  top: ["M36 14 Q50 24 64 14 L82 22 L94 46 L81 52 L75 42 L75 88 L25 88 L25 42 L19 52 L6 46 L18 22 Z"],
  bottom: ["M28 10 H72 L76 90 H57 L50 38 L43 90 H24 Z"],
  hat: [
    "M22 62 Q22 26 50 26 Q78 26 78 62 Z",
    "M14 62 H86 Q86 70 78 70 H22 Q14 70 14 62 Z",
  ],
  bag: [
    "M22 36 H78 L82 88 H18 Z",
    "M36 36 V28 Q50 10 64 28 V36 H58 V29 Q50 19 42 29 V36 Z",
  ],
  socks: ["M38 10 H62 V56 L78 70 Q86 84 72 88 H46 Q36 88 38 76 Z"],
};

function shapeFor(category: string): string {
  if (category === "trousers") return "bottom";
  if (category === "caps" || category === "beanies") return "hat";
  if (category === "bags") return "bag";
  if (category === "socks") return "socks";
  return "top";
}

interface Props {
  product: Product;
  colour?: ColourKey;
}

export default function ProductImage({ product, colour }: Props) {
  if (product.image) {
    return <img src={product.image} alt={product.name} loading="lazy" className="product-img" />;
  }

  const c = COLOURS[colour ?? product.colours[0]];
  return (
    <div className="product-img placeholder-img" role="img" aria-label={`${product.name} in ${c.name}`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {SHAPES[shapeFor(product.category)].map((d) => (
          <path key={d} d={d} fill={c.hex} stroke="rgba(0,0,0,.35)" strokeWidth="1.5" strokeLinejoin="round" />
        ))}
      </svg>
    </div>
  );
}