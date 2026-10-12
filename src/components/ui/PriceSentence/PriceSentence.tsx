import { clsx } from "clsx";
import type { Offer, RichTextString } from "@/content/types";
import { nodesToPlainText } from "@/lib/content/plain-text";
import { parseRichText, type RichNode } from "@/lib/content/rich-text";

/**
 * The price sentence (architecture §5.2, D028): the exact sentence for the offer's current mode, with every amount
 * from the offer (never typed). Ports `kh-body-s mk-price` (mockup.css:18) and the three other places the same
 * sentence sits: the drawer note (`kh-drawer__note`, partials/drawer.html), the offer card's fine print
 * (`kh-offer__fine`) and the store's first screen (`kh-body`, store.html fold 1). It never moves on arrival
 * (architecture §11.2), so it takes no reveal hook.
 */
export type PriceSentenceVariant = "beside" | "drawer" | "offer-fine" | "store";

const VARIANT_CLASSES: Record<PriceSentenceVariant, string> = {
  beside: "kh-body-s ks-price",
  drawer: "kh-drawer__note",
  "offer-fine": "kh-offer__fine",
  store: "kh-body",
};

const WORD_NODES: ReadonlySet<RichNode["kind"]> = new Set(["text", "price", "delivery"]);

/**
 * An offer string (the sentence, the card's price note, a split label) as the words a parent reads. These strings
 * are words and amounts only; any other token (a link, an accent, a placeholder) would be flattened here, so it
 * is refused with the place that passed it, and the content is fixed instead.
 */
export function offerWords(text: RichTextString, offer: Offer, where: string): string {
  const nodes = parseRichText(text);
  const other = nodes.find((node) => !WORD_NODES.has(node.kind));
  if (other) {
    throw new Error(
      `${where}: an offer string is words and amounts only ({price:…}, {delivery}); found a ${other.kind} token in ${JSON.stringify(text)}`,
    );
  }
  return nodesToPlainText(nodes, offer);
}

export interface PriceSentenceProps {
  offer: Offer;
  variant?: PriceSentenceVariant;
  id?: string;
  /** The parent's composition class (a section's `ks-` element), added after the variant's classes. */
  className?: string;
}

export function PriceSentence({ offer, variant = "beside", id, className }: PriceSentenceProps) {
  return (
    <p id={id} className={clsx(VARIANT_CLASSES[variant], className)}>
      {offerWords(offer.sentence, offer, "PriceSentence")}
    </p>
  );
}
