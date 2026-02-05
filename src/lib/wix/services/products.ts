import { wixClient } from "../client";

// Fallback products data for when Wix API is unavailable (build time, errors, etc.)
const fallbackProducts = [
  {
    id: 1,
    name: "Sky Blue",
    price: 5999,
    discountedPrice: 2999,
    images: ["/images/products/lumi-blue/front.png"],
  },
  {
    id: 2,
    name: "Mint Green",
    price: 5999,
    discountedPrice: 2999,
    images: ["/images/products/lumi-green/front.png"],
  },
  {
    id: 3,
    name: "Coral Pink",
    price: 5999,
    discountedPrice: 2999,
    images: ["/images/products/lumi-pink-2.png"],
  },
];

export async function getProducts() {
  try {
    // Check if we have the required environment variable
    if (!process.env.NEXT_PUBLIC_WIX_CLIENT_ID) {
      console.warn("Wix client ID not configured, using fallback products");
      return fallbackProducts;
    }

    const res = await wixClient.products.queryProducts().find();

    // If no products returned, use fallback
    if (!res.items || res.items.length === 0) {
      console.warn("No products from Wix API, using fallback products");
      return fallbackProducts;
    }

    return res.items;
  } catch (error) {
    // Log the error for debugging but don't crash the build
    console.error("Error fetching products from Wix:", error);
    console.warn("Using fallback products due to API error");
    return fallbackProducts;
  }
}
