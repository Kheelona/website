import type { RichTextString } from "@/content/types";

/* The seller's words are the same in both offer modes and render without the offer, so each is one `RichTextString`,
   never the per-mode `Copy` shape (task 3.6; SellerBlock.test-d.tsx). */

/** The seller lines in the footer's order (partials/footer.html; ui/SellerLines), each a content string: the legal
 *  entity, the registered address, and the phone and email links (the number stays on /contact, the E-Commerce Rules;
 *  the mockup's "GSTIN …" line came off the website, D063 items 2-3). */
export interface SellerLinesCopy {
  readonly entity: RichTextString;
  readonly address: RichTextString;
  readonly contact: RichTextString;
}

/**
 * The seller block in its two contexts (mockup-css-mapping §6.2):
 * - `contact`: the contact page's fold (band): heading and sentence beside the card holding the seller lines, entity
 *   and address character for character as the footer, the contact line with the number (D063 item 2); links in the
 *   DS link colour at 800 (contact.css:27);
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
