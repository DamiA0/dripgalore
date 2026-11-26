export interface PhotoCredit {
  product: string;      // which product the photo is used for
  photographer: string;
  source: "Pexels" | "Unsplash";
  url: string;          // link to the photo's page
}

// Example:
// { product: "Boxy Logo Tee", photographer: "Jane Smith", source: "Pexels", url: "https://www.pexels.com/photo/..." },
export const PHOTO_CREDITS: PhotoCredit[] = [];