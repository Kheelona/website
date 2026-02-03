import { wixClient } from "../client";

export async function getProducts() {
  const res = await wixClient.products.queryProducts().find();
  return res.items;
}
