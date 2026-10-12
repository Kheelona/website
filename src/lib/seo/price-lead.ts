/**
 * D028: everything machines read (page titles, meta descriptions, Product JSON-LD) leads with the
 * total, ₹4,999 (incl. GST) in token mode or ₹7,999 in full mode, never with the ₹499 advance.
 * Bing once told parents Kheelu costs ₹499 from "₹499 reserves it" wording.
 *
 * Returns the text unchanged when its first rupee amount is the offer's headline amount, or when it
 * names no amount; throws otherwise, so the build stops before such a line is published.
 */

/** The first rupee amount in a text: "₹4,999", "₹1,00,000". */
const AMOUNT = /₹\s?\d+(?:,\d+)*/;

export function leadWithHeadline(text: string, headline: string, what: string): string {
  const first = text.match(AMOUNT)?.[0].replace(/\s/g, "");
  if (first !== undefined && first !== headline) {
    throw new Error(`${what} must lead with ${headline} (D028), not ${first}: "${text}"`);
  }
  return text;
}

/** A typed amount in content source: the rupee sign, or digits with Rs, INR or "rupees" (the same
 *  forms src/content/en-IN/amounts.test.ts refuses in the content modules). */
const TYPED_AMOUNT = /₹|\bRs\.?\s?\d|\bINR\s?\d|\d\s?(?:rupees|INR)\b/i;

/**
 * Every amount in content is a `{price:…}` token (architecture §6.2), so it follows the checkout's
 * own paise constants and the offer mode. Returns the source text unchanged when it types no amount;
 * throws otherwise (task 2.13). Read the source, before serialising: a token prints as "₹4,999".
 */
export function noTypedAmount(source: string, what: string): string {
  const typed = source.match(TYPED_AMOUNT)?.[0];
  if (typed !== undefined) {
    throw new Error(`${what} has a typed rupee amount ("${typed}"); write it as a {price:…} token: "${source}"`);
  }
  return source;
}
