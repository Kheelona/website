import { wixClient } from "../client";

export async function getProductById(productId: string) {
  try {
    // Check if we have the required environment variable
    if (!process.env.NEXT_PUBLIC_WIX_CLIENT_ID) {
      console.warn("Wix client ID not configured, using fallback products");
      return [];
    }

    const res = await wixClient.products.queryProducts().eq("_id", productId).find();

    console.log("res.items: ", res.items, productId);
    return res.items?.[0];
  } catch (error) {
    // Log the error for debugging but don't crash the build
    console.error("Error fetching products from Wix:", error);
    console.warn("Using fallback products due to API error");
    return [];
  }
}
