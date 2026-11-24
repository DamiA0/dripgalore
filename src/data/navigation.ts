export type SectionSlug = "men" | "women" | "accessories";

export interface Category {
  slug: string;
  label: string;
}

export interface Section {
  slug: SectionSlug;
  label: string;
  categories: Category[];
}

export const SECTIONS: Section[] = [
  {
    slug: "men",
    label: "Men",
    categories: [
      { slug: "hoodies", label: "Hoodies" },
      { slug: "jumpers", label: "Jumpers" },
      { slug: "t-shirts", label: "T-shirts" },
      { slug: "trousers", label: "Trousers" },
      { slug: "jackets", label: "Jackets" },
    ],
  },
  {
    slug: "women",
    label: "Women",
    categories: [
      { slug: "hoodies", label: "Hoodies" },
      { slug: "jumpers", label: "Jumpers" },
      { slug: "t-shirts", label: "T-shirts" },
      { slug: "trousers", label: "Trousers" },
      { slug: "jackets", label: "Jackets" },
    ],
  },
  {
    slug: "accessories",
    label: "Accessories",
    categories: [
      { slug: "caps", label: "Caps" },
      { slug: "beanies", label: "Beanies" },
      { slug: "bags", label: "Bags" },
      { slug: "socks", label: "Socks" },
    ],
  },
];