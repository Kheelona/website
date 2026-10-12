import type {
  ArtBoardRef,
  LeadText,
  LegalDoc,
  LegalPart,
  Offer,
  ParagraphBlock,
  ProseBlock,
  RecipientsBlock,
  RichTextString,
  SharedBlock,
  ToolsBlock,
} from "@/content/types";

/**
 * The two families of the approved legal pages (mockup-css-mapping §6.1): one template, one CSS file, a two-value
 * variant.
 * - `reference`: privacy and terms, the long documents. Plain hero with an eyebrow; the measure on each paragraph,
 *   list and card; numbered parts with a muted number; the contents list scrolls in its own box beside the text and
 *   takes compact rows under a mouse; the grievance and seller lines as cards; a blue close card with the related pages
 *   and the help line.
 * - `notice`: refund and shipping, the short customer notices. A hero with Kheelu's note on a board (from 900 px), a
 *   help line under the short version, the measure on the whole column, bigger part headings from 1024 px, the seller
 *   line as a plain paragraph with its phrases kept together, and a Sunshine close card with two buttons.
 * Unifying them would change two approved pages (needs the founder's OK).
 */
export type LegalVariant = "reference" | "notice";

/**
 * The words every legal page prints around its document, from content (the same on all four pages).
 */
export interface LegalTemplateCopy {
  /** The note above the hero while the document is a draft: "Draft for the founder’s approval; not legal advice." */
  readonly draftNote: RichTextString;
  /** Before the approval date: "Last updated:". */
  readonly updated: RichTextString;
  /** The contents list's heading: "On this page". */
  readonly contents: RichTextString;
  /** The second line of every grievance card: how a complaint gets its reference (an open fact, a placeholder). */
  readonly grievanceNote: RichTextString;
}

/* ── What the template renders ──────────────────────────────────────────────
 * src/content/types.ts's LegalDoc (task 1.6) lacks what the four approved pages print; these are its additions,
 * every one optional where a page goes without it. They belong in types.ts (reported to the main session, task 4.3). */

/** The hero, with the eyebrow privacy and terms print above the title ("Privacy policy", "Terms"). */
export interface LegalHero {
  readonly eyebrow?: RichTextString;
  readonly title: RichTextString;
  readonly lead?: RichTextString;
  /** Kheelu's note on a board (refund, shipping), shown from 900 px. */
  readonly art?: ArtBoardRef;
}

/** A paragraph another page links into (`/refund#chargeback`, the store footer's payments line). */
export type LegalParagraph = ParagraphBlock & { readonly id?: string };

/** The recipients list, with the labels each phone row opens its lines with ("What:", "Where:"). */
export interface LegalRecipients extends RecipientsBlock {
  readonly keys: { readonly what: string; readonly where: string };
}

/** The shared grievance (D032) or seller block, built from seller.ts by src/lib/content/seller-lines.ts; the seller
 *  card opens with its page's bold lead ("Who we are:", "Seller:"); refund and shipping print none. */
export type LegalShared = SharedBlock & { readonly lead?: RichTextString };

/** A plain DS card with a bold lead (terms: "Customer care:"). */
export type LegalCardBlock = { readonly kind: "card" } & LeadText;

export type LegalPageBlock = Exclude<ProseBlock, ParagraphBlock> | LegalParagraph | ToolsBlock | LegalRecipients | LegalShared | LegalCardBlock;

/** One numbered part. */
export interface LegalPagePart extends Omit<LegalPart, "blocks"> {
  /** The contents list's words, where they are not the title without its full stop (privacy: "Who we are"). */
  readonly contents?: RichTextString;
  readonly blocks: readonly LegalPageBlock[];
}

/** A run of parts under one heading (terms: "Your pre-order"): the contents list prints `label`, the document prints
 *  `eyebrow` ("Part one · Your pre-order") above the run's first part. Parts name their run by `group` = `label`. */
export interface LegalGroup {
  readonly label: string;
  readonly eyebrow: RichTextString;
}

type WithPageFields<D> = D extends unknown
  ? Omit<D, "hero" | "parts"> & {
      readonly hero: LegalHero;
      readonly groups?: readonly LegalGroup[];
      readonly parts: readonly LegalPagePart[];
    }
  : never;

/** A legal page as the template renders it: LegalDoc (draft or approved) with the additions above. */
export type LegalPage = WithPageFields<LegalDoc>;

export interface LegalTemplateProps {
  readonly doc: LegalPage;
  readonly variant: LegalVariant;
  readonly copy: LegalTemplateCopy;
  /** The page's offer: the documents name amounts as `{price:…}` and the delivery line as `{delivery}`. */
  readonly offer: Offer;
}
