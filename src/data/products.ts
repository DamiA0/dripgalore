import type { SectionSlug } from "./navigation";

export interface Colour {
  name: string;
  hex: string;
}

export const COLOURS = {
  black: { name: "Black", hex: "#1a1a1a" },
  white: { name: "White", hex: "#f4f4f2" },
  grey: { name: "Grey", hex: "#9a9a9a" },
  navy: { name: "Navy", hex: "#1f2a44" },
  olive: { name: "Olive", hex: "#5b6b3a" },
  sand: { name: "Sand", hex: "#d8c7a6" },
  brown: { name: "Brown", hex: "#6b4a32" },
  cream: { name: "Cream", hex: "#efe6d2" },
  lime: { name: "Lime", hex: "#c6ff3d" },
  red: { name: "Red", hex: "#c8312b" },
  blue: { name: "Blue", hex: "#3a6fd8" },
  pink: { name: "Pink", hex: "#efb7c8" },
} satisfies Record<string, Colour>;

export type ColourKey = keyof typeof COLOURS;

export const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "S/M", "L/XL", "One size"];

export interface Product {
  id: string;
  slug: string;
  name: string;
  section: SectionSlug;
  category: string;
  price: number;      // in pence: 4500 = £45.00
  wasPrice?: number;  // original price if it's on sale
  colours: ColourKey[];
  sizes: string[];
  description: string;
  fit: string;
  fabric: string;
  image?: string;     // e.g. "/products/men-heavyweight-logo-hoodie.webp" (added later)
  isNew: boolean;
  popularity: number; // used by "Most popular" sort
}

// Shared details for each category
const DETAILS: Record<string, { fit: string; fabric: string; blurb: string }> = {
  hoodies: {
    fit: "Relaxed fit with dropped shoulders",
    fabric: "80% cotton, 20% recycled polyester brushed-back fleece",
    blurb: "A heavyweight hoodie with a double-layer hood, kangaroo pocket and ribbed cuffs.",
  },
  jumpers: {
    fit: "Regular fit",
    fabric: "100% cotton knit",
    blurb: "A soft knitted jumper that layers easily over a tee or under a jacket.",
  },
  "t-shirts": {
    fit: "Boxy fit",
    fabric: "100% organic cotton jersey, 220gsm",
    blurb: "A thick, structured tee with a ribbed crew neck that keeps its shape wash after wash.",
  },
  trousers: {
    fit: "Relaxed through the leg with an elasticated waist",
    fabric: "98% cotton, 2% elastane twill",
    blurb: "Everyday trousers with deep pockets and a clean finish at the ankle.",
  },
  jackets: {
    fit: "Regular fit with room to layer",
    fabric: "Nylon shell with recycled polyester lining",
    blurb: "A water-resistant jacket with a two-way zip, built for cold UK mornings.",
  },
  caps: {
    fit: "Adjustable strap at the back",
    fabric: "100% cotton twill",
    blurb: "A six-panel cap with an embroidered DripGalore drop on the front.",
  },
  beanies: {
    fit: "One size, stretchy rib knit",
    fabric: "Acrylic and wool blend",
    blurb: "A warm ribbed beanie with a fold-over cuff and woven label.",
  },
  bags: {
    fit: "Adjustable strap",
    fabric: "Recycled polyester with water-resistant coating",
    blurb: "A practical bag with a zipped main compartment and inner pocket for your phone.",
  },
  socks: {
    fit: "Cushioned sole with arch support",
    fabric: "Cotton blend with elastane",
    blurb: "Comfortable everyday socks with a reinforced heel and toe.",
  },
};

// [name, section, category, price in pence, colours, wasPrice?, isNew?]
type Row = [
  name: string,
  section: SectionSlug,
  category: string,
  price: number,
  colours: ColourKey[],
  wasPrice?: number,
  isNew?: boolean,
];

const ROWS: Row[] = [
  // ---- Men ----
  ["Heavyweight Logo Hoodie", "men", "hoodies", 6500, ["black", "grey", "lime"], undefined, true],
  ["Essential Zip Hoodie", "men", "hoodies", 5500, ["navy", "black", "olive"]],
  ["Drip Graphic Hoodie", "men", "hoodies", 6000, ["white", "black"], 7500],
  ["Washed Oversized Hoodie", "men", "hoodies", 5800, ["brown", "sand"]],
  ["Waffle Knit Jumper", "men", "jumpers", 4800, ["cream", "navy"]],
  ["Crew Neck Jumper", "men", "jumpers", 4200, ["grey", "black", "olive"]],
  ["Quarter Zip Jumper", "men", "jumpers", 5200, ["navy", "brown"], 6000],
  ["Boxy Logo Tee", "men", "t-shirts", 2200, ["white", "black", "lime"], undefined, true],
  ["Heavyweight Pocket Tee", "men", "t-shirts", 2500, ["sand", "olive", "black"]],
  ["Drip Script Tee", "men", "t-shirts", 2000, ["white", "red"], 2600],
  ["Long Sleeve Tee", "men", "t-shirts", 2800, ["black", "grey"]],
  ["Relaxed Cargo Trousers", "men", "trousers", 5500, ["olive", "black", "sand"], undefined, true],
  ["Tapered Joggers", "men", "trousers", 4000, ["grey", "black", "navy"]],
  ["Straight Leg Chinos", "men", "trousers", 4500, ["sand", "navy"]],
  ["Parachute Trousers", "men", "trousers", 5000, ["black", "olive"], 6200],
  ["Puffer Jacket", "men", "jackets", 11000, ["black", "olive"], undefined, true],
  ["Coach Jacket", "men", "jackets", 7500, ["navy", "black"]],
  ["Windbreaker Jacket", "men", "jackets", 6500, ["lime", "black"], 8000],
  ["Sherpa Fleece Jacket", "men", "jackets", 8500, ["cream", "brown"]],

  // ---- Women ----
  ["Cropped Logo Hoodie", "women", "hoodies", 5500, ["pink", "black", "white"], undefined, true],
  ["Oversized Zip Hoodie", "women", "hoodies", 6000, ["grey", "sand"]],
  ["Boyfriend Graphic Hoodie", "women", "hoodies", 5800, ["black", "cream"], 7000],
  ["Cable Knit Jumper", "women", "jumpers", 5200, ["cream", "pink"]],
  ["Ribbed Crew Jumper", "women", "jumpers", 4500, ["black", "brown", "blue"]],
  ["Mock Neck Jumper", "women", "jumpers", 4800, ["grey", "navy"], 5800],
  ["Baby Tee", "women", "t-shirts", 1800, ["white", "pink", "black"], undefined, true],
  ["Oversized Logo Tee", "women", "t-shirts", 2400, ["white", "lime"]],
  ["Ribbed Long Sleeve Top", "women", "t-shirts", 2600, ["black", "cream"], 3200],
  ["Wide Leg Joggers", "women", "trousers", 4200, ["grey", "black", "pink"], undefined, true],
  ["High Waist Cargo Trousers", "women", "trousers", 5200, ["olive", "sand", "black"]],
  ["Straight Leg Trousers", "women", "trousers", 4600, ["black", "navy"], 5500],
  ["Cropped Puffer Jacket", "women", "jackets", 9500, ["black", "cream"], undefined, true],
  ["Oversized Denim Jacket", "women", "jackets", 7000, ["blue"]],
  ["Longline Windbreaker", "women", "jackets", 6800, ["olive", "pink"], 8200],

  // ---- Accessories ----
  ["Drip Logo Cap", "accessories", "caps", 2200, ["black", "lime", "navy"], undefined, true],
  ["Washed Dad Cap", "accessories", "caps", 2000, ["sand", "olive"]],
  ["Ribbed Beanie", "accessories", "beanies", 1800, ["black", "red", "grey"]],
  ["Fisherman Beanie", "accessories", "beanies", 2000, ["cream", "navy"], 2500],
  ["Crossbody Bag", "accessories", "bags", 3500, ["black", "olive"], undefined, true],
  ["Everyday Backpack", "accessories", "bags", 5500, ["black", "grey"]],
  ["Canvas Tote Bag", "accessories", "bags", 1500, ["cream", "black"]],
  ["Sports Socks 3-Pack", "accessories", "socks", 1200, ["white", "black"]],
  ["Logo Crew Socks", "accessories", "socks", 900, ["lime", "grey"], 1200],
  ["Ribbed Ankle Socks 3-Pack", "accessories", "socks", 1000, ["white", "pink"]],
];

function sizesFor(section: SectionSlug, category: string): string[] {
  if (category === "socks") return ["S/M", "L/XL"];
  if (section === "accessories") return ["One size"];
  if (section === "women") return ["XS", "S", "M", "L", "XL"];
  return ["XS", "S", "M", "L", "XL", "XXL"];
}

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const PRODUCTS: Product[] = ROWS.map(
  ([name, section, category, price, colours, wasPrice, isNew], i) => {
    const d = DETAILS[category];
    return {
      id: String(i + 1),
      slug: `${section}-${slugify(name)}`,
      name,
      section,
      category,
      price,
      wasPrice,
      colours,
      sizes: sizesFor(section, category),
      description: d.blurb,
      fit: d.fit,
      fabric: d.fabric,
      isNew: isNew ?? false,
      popularity: (i * 37) % 100, // stable "fake" popularity for sorting
    };
  }
);