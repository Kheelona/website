import type { RichTextString } from "@/content/types";

/* The seller's words are the same in both offer modes and render without the offer, so each is one `RichTextString`,
   never the per-mode `Copy` shape (task 3.6; SellerBlock.test-d.tsx). */

/** The four seller lines as the footer prints them (partials/footer.html; ui/SellerLines), each a content string:
 *  the legal entity, "GSTIN …", the registered address, and the phone and email links. */
export interface SellerLinesCopy {
  readonly entity: RichTextString;
  readonly gstin: RichTextString;
  readonly address: RichTextString;
  readonly contact: RichTextString;
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
      readonly title: RichTextString;
      /** The sentence beside the card. */
      readonly intro: RichTextString;
      readonly lines: SellerLinesCopy;
    }
  | {
      readonly context: "legal";
      /** The registered seller in one sentence, with the page's bold lead where it has one. Refund and shipping wrap
       *  `No 51`, `(Old Site No 1)` and `Bengaluru 560041` in `{nowrap:…}` (4.3's seller-lines helper). */
      readonly line: { readonly lead?: RichTextString; readonly text: RichTextString };
      /** In a DS card (default) or a plain paragraph. */
      readonly card?: boolean;
      /** The legal template's card class. */
      readonly className?: string;
    };

export type SellerBlockProps = SellerBlockConfig;
