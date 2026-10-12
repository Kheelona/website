import type { Copy } from "@/content/types";

/** The four seller lines as the footer prints them (partials/footer.html; ui/SellerLines), each a content string:
 *  the legal entity, "GSTIN …", the registered address, and the phone and email links. */
export interface SellerLinesCopy {
  readonly entity: Copy;
  readonly gstin: Copy;
  readonly address: Copy;
  readonly contact: Copy;
}

/**
 * The seller block in its two contexts (mockup-css-mapping §6.2):
 * - `contact`: the contact page's fold (band): heading and sentence beside the card holding the four seller lines,
 *   character for character as the footer; links in the DS link colour at 800 (contact.css:27);
 * - `legal`: the seller line a legal page prints in its part: a card with a bold lead (privacy "Who we are:", terms
 *   "Seller:") or a plain paragraph (refund, shipping: `card: false`); links at the legal template's 700.
 */
export type SellerBlockConfig =
  | {
      readonly context: "contact";
      readonly title: Copy;
      /** The sentence beside the card. */
      readonly intro: Copy;
      readonly lines: SellerLinesCopy;
    }
  | {
      readonly context: "legal";
      /** The registered seller in one sentence, with the page's bold lead where it has one. */
      readonly line: { readonly lead?: Copy; readonly text: Copy };
      /** In a DS card (default) or a plain paragraph. */
      readonly card?: boolean;
      /** The legal template's card class. */
      readonly className?: string;
    };

export type SellerBlockProps = SellerBlockConfig;
