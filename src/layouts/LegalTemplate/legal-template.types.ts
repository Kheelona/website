import type { LegalBlock, LegalPage, LegalPart, LegalTemplateCopy, Offer, RecipientsBlock, SharedBlock } from "@/content/types";

/* The legal shapes content writes live in src/content/types.ts (task 4.5 item 2; structure §6: a legal content module
 * imports nothing from layouts). They are re-exported here under every name this folder gave them (task 4.3), so each
 * existing import keeps working. */
export type {
  LegalCardBlock,
  LegalGroup,
  LegalHero,
  LegalLeadText,
  LegalPage,
  LegalParagraph,
  LegalTemplateCopy,
} from "@/content/types";

/**
 * The two families of the approved legal pages (mockup-css-mapping §6.1): one template, one CSS file, a two-value
 * variant.
 * - `reference`: privacy and terms, the long documents. Plain hero with an eyebrow; the measure on each paragraph,
 *   list and card; numbered parts with a muted number; the contents list scrolls in its own box beside the text and
 *   takes compact rows under a mouse; a promise's links in the link colour; the grievance and seller lines as cards; a
 *   blue close card with the related pages and the help line.
 * - `notice`: refund and shipping, the short customer notices. A hero with Kheelu's note on a board (from 900 px), a
 *   help line under the short version, the measure on the whole column, bigger part headings from 1024 px, the seller
 *   line as a plain paragraph with its phrases kept together, and a Sunshine close card with two buttons.
 * Unifying them would change two approved pages (needs the founder's OK).
 */
export type LegalVariant = "reference" | "notice";

/** The recipients list, with the labels each phone row opens its lines with ("What:", "Where:"). */
export type LegalRecipients = RecipientsBlock;

/** The shared grievance (D032) or seller block, with the seller card's bold lead. */
export type LegalShared = SharedBlock;

/** Any block of a legal page's part. */
export type LegalPageBlock = LegalBlock;

/** One numbered part. */
export type LegalPagePart = LegalPart;

export interface LegalTemplateProps {
  readonly doc: LegalPage;
  readonly variant: LegalVariant;
  /** The words around every document: content/en-IN/legal/shared.ts. */
  readonly copy: LegalTemplateCopy;
  /** The page's offer: the documents name amounts as `{price:…}` and the delivery line as `{delivery}`, and terms' copy
   *  changes with its mode. */
  readonly offer: Offer;
}
