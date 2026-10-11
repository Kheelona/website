import type { Copy, Offer, Placeholder } from "@/content/types";
import { pickMode } from "./mode";
import { isPlaceholder, placeholderText } from "./placeholder";
import { leafText, parseRichText, type RichNode } from "./rich-text";

/**
 * The plain-text serialiser (ADR-004, architecture §6.2): any content string, as
 * the exact words a parent sees once `ui/RichText` has rendered it. JSON-LD (FAQ
 * answers word for word), meta descriptions, llms.txt and pricing.md use it, so
 * they can never disagree with the page.
 *
 * Accents and no-wrap phrases keep their words; links keep their label; a source
 * marker prints its visible number, "[1]"; prices and the delivery line come from
 * the offer; a placeholder prints its marker. Copy that changes with the offer
 * mode, and every amount, needs the offer: without it this throws rather than
 * guess a price.
 */
export function toPlainText(value: Copy | Placeholder, offer?: Offer): string {
  if (isPlaceholder(value)) return placeholderText(value);
  return nodesToPlainText(parseRichText(pickMode(value, offer?.mode)), offer);
}

/** The visible text of already parsed nodes. */
export function nodesToPlainText(nodes: readonly RichNode[], offer?: Offer): string {
  let text = "";
  for (const node of nodes) {
    text += "children" in node ? nodesToPlainText(node.children, offer) : leafText(node, offer);
  }
  return text;
}
