import { HOSTS } from "@/config/env";
import { cta } from "@/content/en-IN/cta";
import { faqs, type FaqId } from "@/content/en-IN/faqs";
import { navigation } from "@/content/en-IN/navigation";
import { offerCopy } from "@/content/en-IN/offer";
import { PAYMENT_TERMS } from "@/content/en-IN/policies";
import { product } from "@/content/en-IN/products/kheelu/product";
import { seller } from "@/content/en-IN/seller";
import { trustItems } from "@/content/en-IN/trust";
import type { Copy, Offer } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import { getOffer } from "@/lib/offer/get-offer";
import { absoluteUrl } from "@/lib/seo/urls";

/**
 * `/pricing.md` (architecture §9.3, ADR-012): the price of Kheelu for agents that compare products for a buyer
 * and skip what they cannot parse.
 *
 * HARD RULES, as for llms.txt: visible copy only (the price answer, the price sentence beside the button, the
 * offer card's perks, the trust items, the product page's MRP and Manufacturer declarations, two FAQ answers and the
 * seller's lines, joined only by list marks, links, ": " and " · "); every amount from the live offer, so the first is
 * the total (incl. GST) in both modes and the advance, in token mode, comes second (D028).
 * `test/machine-files.test.ts` checks both modes.
 *
 * Prerendered and revalidated with the offer mode (ADR-005), like the pages that show a price.
 */
export const dynamic = "force-static";
export const revalidate = 300;

/** The day this file's body last changed in substance: its prices, its terms or its words. Bump it in the
 *  same commit (the sell-out sweep's Redeploy republishes the full-mode prices under it). */
export const PRICING_UPDATED = "2026-10-14";

/** The entity facts an agent needs beside the price (architecture §9.3): who it is for and the rename note. */
const ABOUT: readonly FaqId[] = ["what-ages", "same-as-lumi"];

export function pricingText(offer: Offer): string {
  const plain = (value: Copy) => toPlainText(value, offer);
  const mrp = product.declarations.find((row) => typeof row.value === "string" && row.value.includes("{price:mrp}"));
  if (!mrp) throw new Error("pricing.md: the product page declares no MRP (src/content/en-IN/products/kheelu/product.ts)");
  // Who makes it, as the product page declares it (D034; architecture §9.3 "made in India by Kheelona Robotics").
  const maker = product.declarations.find((row) => typeof row.value === "string" && row.value === seller.manufacturer);
  if (!maker) throw new Error("pricing.md: the product page declares no manufacturer (src/content/en-IN/products/kheelu/product.ts)");
  const meet = navigation.main.find((link) => link.href === "/products/kheelu");
  if (!meet) throw new Error("pricing.md: the nav no longer links the product page (src/content/en-IN/navigation.ts)");

  return [
    `# Pricing: ${product.schema.name}`,
    "",
    plain(faqs["how-much"].answer),
    "",
    "## What you pay",
    "",
    `- ${plain(offer.sentence)}`,
    `- ${plain(trustItems["payment-methods"].label)}`,
    `- ${PAYMENT_TERMS}`,
    `- ${mrp.term}: ${plain(mrp.value as string)}`,
    "",
    "## Included with every Kheelu",
    "",
    ...offerCopy.card.perks.product.map((perk) => `- ${plain(perk.text)}`),
    "",
    "## Returns and warranty",
    "",
    `- ${plain(trustItems["returns-7-days"].label)}`,
    `- ${plain(trustItems["warranty-6-months"].label)}`,
    `- ${plain(faqs["change-my-mind"].answer)}`,
    "",
    "## Where to pre-order",
    "",
    `- [${cta.preorder}](https://${HOSTS.production.store})`,
    `- [${meet.label}](${absoluteUrl(meet.href)})`,
    "",
    "## About Kheelu",
    "",
    ...ABOUT.flatMap((id) => [`### ${plain(faqs[id].question)}`, "", plain(faqs[id].answer), ""]),
    `- ${seller.origin.line}`,
    `- ${maker.term}: ${plain(maker.value as string)}`,
    `- ${plain(seller.help.contact)} · ${seller.support.email}`,
    "",
    `Last updated: ${PRICING_UPDATED}`,
    "",
  ].join("\n");
}

export async function GET() {
  /* No cache-control of its own: Next sends the ISR header (s-maxage=300, stale-while-revalidate), so no
     browser or shared cache keeps a body past the offer window (ADR-005). */
  return new Response(pricingText(await getOffer()), { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
