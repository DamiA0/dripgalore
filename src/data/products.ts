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
  photos: Partial<Record<string, string>>; // "default" photo and/or one per colour
  isNew: boolean;
  popularity: number;
}

// A product as it arrives from the API (photos are added in the browser)
export type ApiProduct = Omit<Product, "photos">;

// Finds photos in src/assets/products automatically:
//   men-boxy-logo-tee.webp         -> default photo
//   men-boxy-logo-tee--black.webp  -> photo for the black colour
const PHOTO_FILES = import.meta.glob<string>("../assets/products/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

export function photosFor(slug: string): Partial<Record<string, string>> {
  const photos: Partial<Record<string, string>> = {};
  for (const [path, url] of Object.entries(PHOTO_FILES)) {
    const name = path.split("/").pop()!.replace(".webp", "");
    if (name === slug) photos.default = url;
    else if (name.startsWith(`${slug}--`)) photos[name.slice(slug.length + 2)] = url;
  }
  return photos;
}

export function withPhotos(p: ApiProduct): Product {
  return { ...p, photos: photosFor(p.slug) };
}