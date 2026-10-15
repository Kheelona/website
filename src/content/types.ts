/**
 * Shared content shapes (ADR-004, architecture §6). Every module under
 * src/content/<locale>/ ends with `satisfies <Type>` against these, so a future
 * hi-IN folder must have the same shape.
 *
 * Type-only: nothing here runs. The placeholder build guard (task 2.9) skips this
 * file and src/lib/content/placeholder.ts because they define the syntax it hunts.
 */

import type { StaticImageData } from "next/image";
import type { JOURNAL_IMAGES } from "@/config/journal";
import type { OgImage } from "@/lib/seo/metadata";
import type { PreorderMode } from "@/lib/store/mode";

/* ── Text and modes ───────────────────────────────────────────────────────── */

/**
 * A content string in the one inline syntax (architecture §6.2): `{hand:…}`,
 * `{mark:…}`, `{nowrap:…}`, `[label](href)`, `[^1]`, `{price:token|balance|
 * headline|full|mrp|launch}`, `{delivery}` and `{ph:ID note}`. Parsed by
 * src/lib/content/rich-text.ts, rendered by `ui/RichText`, and turned into the
 * exact visible text by src/lib/content/plain-text.ts. Never a typed rupee amount.
 */
export type RichTextString = string;

/** The store's offer mode: token while the refundable advance reserves one of the
 *  capped units, then full (paid in full). Decided by the store, never the count:
 *  the store's own union (a type-only import, erased at build), so a new tier
 *  there cannot drift past the content. */
export type OfferMode = PreorderMode;

/** Anything that changes with the offer mode carries both versions. */
export interface ModeVariant<T = RichTextString> {
  readonly token: T;
  readonly full: T;
}

/** A value that is the same in both modes, or one that changes with the mode. */
export type ByMode<T> = T | ModeVariant<T>;

/** Copy as content modules hold it: one string, or one per offer mode. */
export type Copy = ByMode<RichTextString>;

/** A calendar date as stored: `2026-11-15`. Formatted by src/lib/format/date.ts. */
export type IsoDate = `${number}-${number}-${number}`;

/* ── The offer (ADR-005) ──────────────────────────────────────────────────── */

/** The amounts a content string may name, as `{price:<key>}`. `headline` follows the mode (LAUNCH, then FULL);
 *  `launch` is LAUNCH in both modes: a reservation's total, which a reservation made while the advance was open still
 *  owes after the store sells at the full price (task 4.7). */
export type PriceKey = "token" | "balance" | "headline" | "full" | "mrp" | "launch";

/** The phone buy bar's two lines: the amount line and the note under it. */
export interface OfferSticky {
  readonly big: RichTextString;
  readonly small: RichTextString;
}

/** One row of the offer card's token-mode split: what is paid when ("Today,
 *  refundable" with `token`, "Before delivery" with `balance`). */
export interface OfferSplitRow {
  readonly label: RichTextString;
  readonly price: PriceKey;
}

/** Where an offer card sits: Home's close (fold 9) and the product page (fold 3).
 *  Each lists its own perks; the product page's include Kheelona+. */
export type OfferCardPlacement = "home" | "product";

/**
 * The offer card (DS OfferCard, `kh-offer`) for the current mode. Its amount is
 * the offer's `prices.headline`, with no note beside it (D065 item 3: no "incl. GST" on
 * the selling pages; task Q2.8), its fine print the offer's `priceLine`, and its
 * button the placement's CTA; `ui/OfferCard` takes the perks for its placement.
 */
export interface OfferCard {
  /** The product line: "Kheelu". */
  readonly product: string;
  /** Token mode only; absent in full mode, whose composed block has no split (G-08). */
  readonly split?: readonly OfferSplitRow[];
  /** Token mode only (D061 item 3; task 8c.2): the later price as a plain line in the DS card's later-price place, under
   *  the amount: "{price:headline} for the first 500 units. {price:full} once they are gone." Absent in full mode. Never
   *  a struck-through price, a counter or "save" (PRICE-01, DARK-01). */
  readonly later?: RichTextString;
  /** The same in both modes. */
  readonly perks: Readonly<Record<OfferCardPlacement, readonly IconText[]>>;
}

/** The "Share Kheelu on WhatsApp" link under the offer cards (D061; task 8c.2), resolved for the live mode. */
export interface OfferShare {
  /** The link's words: the live site's WHATSAPP_SHARE_LABEL. */
  readonly label: string;
  /** WhatsApp's share link with the message: the mode's words, then the tagged kheelona.com address, encoded. */
  readonly href: `https://wa.me/?text=${string}`;
}

/** The share link as content/en-IN/share.ts holds it. */
export interface OfferShareCopy {
  readonly label: string;
  /** WhatsApp's own share link, with no number: the parent picks who gets the message. */
  readonly href: "https://wa.me/";
  /** The message's words, in both modes: every amount a `{price:…}` token. */
  readonly text: ModeVariant;
  /** The kheelona.com address the message ends with, tagged as docs/utm-conventions.md says (tools/utm/build-link.mjs). */
  readonly address: string;
}

/**
 * The offer view model, built by src/lib/offer/offer.ts (task 2.1) from the live
 * store mode, content/en-IN/offer.ts and the checkout's own amounts in
 * src/config/site.ts. Every price on a page, in JSON-LD and in machine files
 * resolves through one of these.
 */
export interface Offer {
  readonly mode: OfferMode;
  /** LAUNCH in token mode, FULL in full mode; Meta `ViewContent` value × 100. */
  readonly headlinePaise: number;
  /** Formatted amounts for `{price:…}`, each `formatInr` of a paise constant:
   *  token (TOKEN), balance (BALANCE), headline (LAUNCH in token mode, FULL in
   *  full mode), full (FULL), mrp (MRP, its own value per D034) and launch
   *  (LAUNCH in both modes: a reservation's total). */
  readonly prices: Readonly<Record<PriceKey, string>>;
  /** The D028 price sentence for this mode (it may carry price tokens): the checkout's, where GST and the payment
   *  breakdown stay (the store's first screen, the pre-order form, /terms, /pricing.md; D065 item 3). */
  readonly sentence: RichTextString;
  /** The short price line beside every button on the selling pages, for this mode (D065 item 3; task Q2.8): the
   *  advance and the total, no GST and no balance. */
  readonly priceLine: RichTextString;
  /** The phone buy bar's two lines for this mode. */
  readonly sticky: OfferSticky;
  /** The offer card for this mode. */
  readonly card: OfferCard;
  /** The Kheelona+ line under Home's card (D041 F7), in D058 item 3's words: "Every Kheelu comes with 6
   *  months of Kheelona+, our paid subscription, on top of the free parent app." */
  readonly plus: RichTextString;
  /** The visible delivery line, `DELIVERY_TEXT` (D023), for `{delivery}`. */
  readonly delivery: string;
  /** The schema date the delivery line stands for, `DELIVERY_SCHEMA_DATE` (D037). */
  readonly availabilityStarts: IsoDate;
  /** The share link under the offer cards, for this mode (D061; task 8c.2). Every offer built from the content carries
   *  it (src/lib/offer/offer.ts); a locale without share copy has none. */
  readonly share?: OfferShare;
}

/** The offer card as content/en-IN/offer.ts holds it: the split and the later price are written once and the view
 *  model leaves them out in full mode. */
export interface OfferCardCopy extends Omit<OfferCard, "split" | "later"> {
  readonly split: readonly OfferSplitRow[];
  /** The later-price line (token mode only, D061 item 3); a locale without one shows none. */
  readonly later?: RichTextString;
}

/** The shape of content/en-IN/offer.ts, both modes (architecture §6.1): the
 *  module ends with `satisfies OfferCopy`; src/lib/offer/offer.ts picks a mode. */
export interface OfferCopy {
  readonly sentence: ModeVariant;
  readonly priceLine: ModeVariant;
  readonly sticky: ModeVariant<OfferSticky>;
  readonly card: OfferCardCopy;
  readonly plus: RichTextString;
  /** The share link under the offer cards (content/en-IN/share.ts; D061). */
  readonly share?: OfferShareCopy;
}

/* ── Placeholders ─────────────────────────────────────────────────────────── */

declare const placeholderBrand: unique symbol;

/**
 * An unknown fact, waiting on the founder. Made only by `placeholder('F4', 'size
 * and weight')` in data or `{ph:F4 size and weight}` inside a content string; both
 * render `[PLACEHOLDER F4: size and weight]` in the dashed placeholder style on
 * every environment except production, whose build refuses them (ADR-004).
 *
 * `id` is the open item (F4, B24, C6, G-20, ARTICLE) or null when the copy page
 * names none: `[PLACEHOLDER: region]`. The brand stops a hand-written object from
 * passing as one; `kind` is the runtime tag, which survives serialisation.
 */
export interface Placeholder {
  readonly kind: "placeholder";
  readonly id: string | null;
  readonly note: string;
  readonly [placeholderBrand]: true;
}

/** A value that may still be waiting on the founder. */
export type OrPlaceholder<T> = T | Placeholder;

/* ── Proof gates (D038) ───────────────────────────────────────────────────── */

/** The open item whose proof must be filed in wiki/raw/ first, such as F11. */
export interface ProofGate {
  readonly proof: string;
}

/**
 * Proof-gated content (D038: founder bios, recognition). While `gated` is present
 * the item is never rendered, on any environment, and it is not a placeholder:
 * it is hidden, not marked. Delete `gated` once the proof is filed.
 */
export type Gated<T> = T & { readonly gated?: ProofGate };

/* ── References ───────────────────────────────────────────────────────────── */

/** A path on this site from its root, such as `/refund` or `/og/home.jpg`. */
export type SitePath = `/${string}`;

/**
 * One of the 76 design-system icons. A string until the generated `IconName`
 * union (src/assets/icons.generated.ts, task 1.5) is merged, then that union.
 */
export type IconRef = string;

/** One of the design-system doodles; `DoodleName` (src/assets/doodles.generated.tsx, task 1.5) once merged. */
export type DoodleName = string;

/** A CTA tracking value; `CtaId` (src/lib/tracking/cta.ts, task 1.4) once merged. Never invented. */
export type CtaRef = string;

/** The design system's three brand tones (`kh-tone-*`). */
export type Tone = "chilli" | "blue" | "sun";

/**
 * An image the admin dashboard uploaded for a journal post (ADR-014; journal-pipeline §6): its exact address under the
 * API's public image path, derived from `JOURNAL_IMAGES` in src/config/journal.ts (task 8b.2b), so the two cannot
 * drift. next/image's optimiser admits that path alone (next.config.ts `images.remotePatterns`), so the reader's
 * browser is only ever given this site's own `/_next/image` address for it.
 */
export type JournalImageUrl = `${typeof JOURNAL_IMAGES}${string}`;

/**
 * An image. A design-system or app-screen raster is a static import (its size
 * comes with it); a file under public/ with a stable URL (film posters, Open
 * Graph and JSON-LD images) is a site path with its real size, so nothing shifts;
 * a journal post's upload is its `JournalImageUrl` with its real size, likewise.
 * `alt` is empty only for a decorative image.
 */
export type ImageRef =
  | { readonly src: StaticImageData; readonly alt: string }
  | { readonly src: SitePath; readonly width: number; readonly height: number; readonly alt: string }
  | { readonly src: JournalImageUrl; readonly width: number; readonly height: number; readonly alt: string };

/** Doodles draw in up to five staggered steps (D049 pick 3). */
export type DrawOrder = 1 | 2 | 3 | 4 | 5;

/**
 * A design-system doodle. `draw` asks for the inline version that draws itself
 * below the first screen (D049 pick 3), in `order`; a hero always shows it still
 * (pick 2), whatever this says.
 */
export interface DoodleRef {
  readonly name: DoodleName;
  readonly draw?: boolean;
  readonly order?: DrawOrder;
}

interface ArtPlacement {
  /** Percent of the board, as the design system's scrapbook board places layers. */
  readonly left?: number;
  readonly right?: number;
  readonly top?: number;
  readonly bottom?: number;
  readonly width: number;
  /** Degrees. */
  readonly rotate?: number;
}

/** One layer of an art board: an image or a doodle, never both. */
export type ArtLayer = ArtPlacement &
  ({ readonly image: ImageRef; readonly doodle?: never } | { readonly doodle: DoodleRef; readonly image?: never });

/** A word sticker: `lines` break where the copy breaks; `lead` is set in bold first. */
export interface StickerRef {
  readonly tone: Tone;
  /** Degrees, the design system's `--kh-tilt`. */
  readonly tilt?: number;
  readonly variant?: "hand" | "round";
  readonly lead?: RichTextString;
  readonly lines: readonly RichTextString[];
}

/** The design system's scrapbook board (`kh-art`): one tone, layers, one sticker. */
export interface ArtBoardRef {
  readonly tone: Tone;
  /** The board's accessible name when it shows something a parent should know. */
  readonly label?: string;
  readonly layers: readonly ArtLayer[];
  readonly sticker?: StickerRef;
}

/** A link a content module names: a site path or an https address. */
export interface LinkRef {
  readonly label: string;
  readonly href: SitePath | `https://${string}`;
  readonly cta?: CtaRef;
}

/* ── Page meta ────────────────────────────────────────────────────────────── */

/** A page's metadata, exactly as its copy page words it. */
export interface Meta {
  /** At most 60 characters once serialised, unique across routes. */
  readonly title: Copy;
  /** At most 155 characters once serialised, unique; per mode when it names a price. */
  readonly description: Copy;
  readonly og: { readonly image: SitePath; readonly alt: string };
}

/* ── Short content ────────────────────────────────────────────────────────── */

/**
 * Text that may open with a bold label, as the mockups' list items do ("Data:"
 * then the rest): the renderer sets `lead` in bold, then a space, then `text`.
 */
export type LeadText =
  | { readonly lead: RichTextString; readonly text?: RichTextString }
  | { readonly lead?: undefined; readonly text: RichTextString };

/** One trust-line item: a short promise linked to its terms (strategy §3.2). */
export interface TrustItem {
  readonly id: string;
  readonly icon: IconRef;
  readonly label: RichTextString;
  readonly href: SitePath;
}

/** One item of a design-system trust list: icon, optional title, body. */
export interface TrustListItem {
  readonly icon: IconRef;
  readonly title?: RichTextString;
  readonly body: RichTextString;
}

/** An icon and a line: tick lists, offer-card perks. */
export interface IconText {
  readonly icon: IconRef;
  readonly text: RichTextString;
}

/** An answer-first block (architecture §9.5): the question, the answer, then detail. */
export interface Answer {
  readonly question: Copy;
  /** The answer itself; 40 to 60 words where the answer-length guard applies. */
  readonly answer: Copy;
  readonly detail?: readonly ProseBlock[];
}

/** One FAQ item. Each lives once in faqs.ts; pages list ids. */
export interface FaqItem extends Answer {
  /** Stable, kebab-case: `price-and-advance`. */
  readonly id: string;
}

/**
 * One of the parent films (D040). No `loading` here, though architecture §6.1
 * lists one: it changes with the page (Home loads its first three eagerly, the
 * store loads all of them lazily), so the page decides it, not the film.
 */
export interface Film {
  /** Also the file name under /video/moments/. */
  readonly id: string;
  readonly chip: string;
  /** The visible line under the tile; the play button reads "Play: {chip}. {caption}". */
  readonly caption: string;
  /** As printed on the tile: "0:30". */
  readonly duration: `${number}:${number}`;
  /** The still, shown at rest and with reduced motion. */
  readonly poster: ImageRef;
  readonly video: SitePath;
  /** Subtitles are burned into the file (WCAG 1.2.2). */
  readonly hasOpenCaptions: true;
  /** Written parental consent is held for every child in it (D040). */
  readonly consentOnFile: true;
}

/** Where the WhatsApp bubble sits (D050): marketing pages, the store, `/thanks`. */
export type SupportChatContext = "site" | "store" | "thanks";

/** The WhatsApp chat bubble's number and words (D050), held in seller.ts. */
export interface SupportChat {
  /** International digits only, for wa.me: `919187546483`. */
  readonly number: `${number}`;
  /** The link's accessible name. */
  readonly label: string;
  /** The laptop label that slides out on hover and focus. */
  readonly shortLabel: string;
  /** The pre-filled message per context; never an order number or personal data. */
  readonly texts: Readonly<Record<SupportChatContext, string>>;
}

/** The store's in-app browser note (ui/InAppBrowserNote): its words and its switch, as `store/in-app-note.ts`
 *  holds them (structure §3.3). Plain text: no inline syntax. */
export interface InAppBrowserNoteContent {
  /** False until QA's real-device check confirms the in-app payment problem (test plan §6.4; B12, N7). */
  readonly enabled: boolean;
  readonly title: string;
  /** The note prints the store address after this, in bold and unbroken, so it works without the button. */
  readonly body: string;
  readonly copyLabel: string;
  readonly copiedMessage: string;
}

/* ── Prose blocks (articles, legal documents, long FAQ answers) ───────────── */

export type ParagraphBlock = { readonly kind: "p"; readonly variant?: "gut" } & LeadText;

export interface SubheadingBlock {
  readonly kind: "h3";
  readonly text: RichTextString;
}

/** A list item: a line, or a line with a bold label and, for tips, its own icon. */
export type ListItem = RichTextString | (LeadText & { readonly icon?: IconRef });

export interface ListBlock {
  readonly kind: "list";
  /** bullets (default), numbered steps, ticked checks, or tips in a tinted card. */
  readonly variant?: "bullets" | "steps" | "checks" | "tips";
  readonly items: readonly ListItem[];
}

/** Questions a parent can ask, each answered in a paragraph or two. */
export interface QuestionsBlock {
  readonly kind: "questions";
  readonly items: readonly { readonly question: RichTextString; readonly answer: readonly RichTextString[] }[];
}

export interface QuoteBlock {
  readonly kind: "quote";
  readonly quote: RichTextString;
  readonly cite?: RichTextString;
}

/** A tinted card with an icon ("Try this:", "Faulty or not as described?"). */
export type CalloutBlock = { readonly kind: "callout"; readonly icon: IconRef; readonly tone?: Tone } & LeadText;

export interface FigureBlock {
  readonly kind: "figure";
  readonly image: ImageRef;
  readonly variant?: "wide" | "square";
  readonly caption?: RichTextString;
}

/** A trust list of facts, optionally with a photo inside the grid. */
export interface FactsBlock {
  readonly kind: "facts";
  readonly items: readonly TrustListItem[];
  readonly figure?: ImageRef;
}

/** The D025 line: a toy, not a therapy or treatment. */
export interface DisclaimerBlock {
  readonly kind: "disclaimer";
  readonly text: RichTextString;
}

/** The two hosts a journal post may embed a video from (D057 item 1; ADR-014). */
export type VideoProvider = "youtube" | "vimeo";

/**
 * A YouTube or Vimeo video in a journal post (D057 item 1; journal-pipeline §5.1, §7): a still until a reader presses
 * play (ui/VideoEmbed). No address: the player's and the still's are built from the provider and the id alone.
 */
export interface VideoBlock {
  readonly kind: "video";
  readonly provider: VideoProvider;
  /** An 11-character YouTube id, or a numeric Vimeo id. */
  readonly videoId: string;
  /** Plain words: the player frame's title and, after the content's play word, the play button's name. */
  readonly title: string;
  readonly caption?: RichTextString;
}

/** Every block type the approved article mockups use, and the journal's video (ADR-014). */
export type ProseBlock =
  | ParagraphBlock
  | SubheadingBlock
  | ListBlock
  | QuestionsBlock
  | QuoteBlock
  | CalloutBlock
  | FigureBlock
  | FactsBlock
  | DisclaimerBlock
  | VideoBlock;

/* ── Articles ─────────────────────────────────────────────────────────────── */

/** One part of an article: an optional heading and its blocks. */
export interface ArticlePart {
  readonly kind: "part";
  /** A fragment other pages link to (`#brain-development`). */
  readonly id?: string;
  readonly title?: RichTextString;
  /** A part that widens out of the reading column. */
  readonly variant?: "breakout";
  readonly blocks: readonly ProseBlock[];
}

/** The card the stories hub shows for an article; the hub holds slugs only. */
export interface ArticleCard {
  readonly title: RichTextString;
  readonly summary: RichTextString;
}

/** A numbered source; `[^n]` in the article's text links to source n (D026). */
export interface Source {
  readonly citation: RichTextString;
  readonly href: `https://${string}`;
}

/** One journal article: a dashboard post as the adapter writes it (ADR-014; src/lib/journal/to-article.ts), read from
 *  the registry (stories/journal.ts). */
export interface Article {
  readonly slug: string;
  /** The share card is an `OgImage`: a DS photo's 1200 x 630 card, or an uploaded cover at the size this site's
   *  optimiser serves it (journal-pipeline §6), so pageMeta tells share tools that size. */
  readonly meta: Omit<Meta, "og"> & { readonly og: OgImage };
  readonly card: ArticleCard;
  /** Exactly three, so every article keeps three incoming links. */
  readonly related: readonly [string, string, string];
  /** Stored from git history when the article changes, never computed at build. */
  readonly published: IsoDate;
  readonly updated: IsoDate;
  readonly head: {
    readonly title: RichTextString;
    readonly lead?: RichTextString;
    readonly author: string;
    readonly readMinutes?: number;
    readonly image?: ImageRef;
  };
  readonly answer?: Answer;
  readonly body: readonly (ArticlePart | FigureBlock)[];
  readonly sources: readonly Source[];
  /** journal: the close with the pre-order button; keep: keep-reading links, no button (B5). */
  readonly close: "journal" | "keep";
}

/* ── Legal pages (privacy, terms, refund, shipping) ───────────────────────── */
/* The shape a legal content module writes (`satisfies LegalPage`) and LegalTemplate renders: task 1.6's document with
 * what the four approved pages print, folded in here by task 4.5 (the template had held the additions, task 4.3), so a
 * legal module imports nothing from layouts (structure §6). layouts/LegalTemplate/legal-template.types.ts re-exports
 * every name it had. */

export type LegalStatus = "draft" | "approved";

/** A line that may open with a bold label (LeadText), where either part may change with the offer mode: terms' short
 *  version and its price paragraphs read differently once the reservations close (terms.md folds 2 and 4; task 5.12). */
export type LegalLeadText =
  | { readonly lead: Copy; readonly text?: Copy }
  | { readonly lead?: undefined; readonly text: Copy };

/**
 * A paragraph of a legal page. `id` where another page links into it (`/refund#chargeback`, the store footer's payments
 * line). Its words may change with the offer; a paragraph with no words in the live mode is left out, which is how a
 * "token mode only" paragraph of terms.md is written (`{ token: "…", full: "" }`).
 */
export type LegalParagraph = { readonly kind: "p"; readonly id?: string } & LegalLeadText;

/** The tools a policy names, one block each (privacy). */
export interface ToolsBlock {
  readonly kind: "tools";
  readonly tools: readonly { readonly name: RichTextString; readonly blocks: readonly ProseBlock[] }[];
}

/** Everyone who handles a parent's data: cards on phones, a table on laptops. */
export interface RecipientsBlock {
  readonly kind: "recipients";
  readonly label: string;
  readonly headings: { readonly who: string; readonly what: string; readonly where: string };
  /** The labels each phone row opens its lines with ("What:", "Where:"). */
  readonly keys: { readonly what: string; readonly where: string };
  readonly rows: readonly {
    readonly who: RichTextString;
    readonly what: RichTextString;
    readonly where: RichTextString;
  }[];
}

/** The shared grievance (D032) or seller block, rendered from seller.ts through src/lib/content/seller-lines.ts, never
 *  retyped; the seller card opens with its page's bold lead ("Who we are:", "Seller:"); refund and shipping print none. */
export interface SharedBlock {
  readonly kind: "grievance" | "seller";
  readonly lead?: RichTextString;
}

/** A plain DS card with a bold lead (terms: "Customer care:"). */
export type LegalCardBlock = { readonly kind: "card" } & LeadText;

export type LegalBlock = Exclude<ProseBlock, ParagraphBlock> | LegalParagraph | ToolsBlock | RecipientsBlock | SharedBlock | LegalCardBlock;

/** One numbered part; consecutive parts with the same `group` share a contents heading. */
export interface LegalPart {
  readonly id: string;
  readonly title: RichTextString;
  /** The contents list's words, where they are not the title without its full stop (privacy: "Who we are"). */
  readonly contents?: RichTextString;
  readonly group?: string;
  /** The answer-first line that opens the part. */
  readonly answer?: RichTextString;
  readonly blocks: readonly LegalBlock[];
}

/** A run of parts under one heading (terms: "Your pre-order"): the contents list prints `label`, the document prints
 *  `eyebrow` ("Part one · Your pre-order") above the run's first part. Parts name their run by `group` = `label`. */
export interface LegalGroup {
  readonly label: string;
  readonly eyebrow: RichTextString;
}

/** The short version: a trust list, or numbered points with bold labels (terms, whose points change with the offer). */
export type LegalSummary =
  | { readonly kind: "trust"; readonly title: RichTextString; readonly items: readonly TrustListItem[] }
  | { readonly kind: "points"; readonly title: RichTextString; readonly points: readonly LegalLeadText[] };

/** The close card. Its help line (privacy, terms) is not the page's: the template prints seller.help through
 *  LegalTemplateCopy, so no page retypes it. */
export interface LegalClose {
  readonly title?: RichTextString;
  readonly lead?: RichTextString;
  readonly actions: readonly LinkRef[];
  readonly also?: { readonly label: string; readonly links: readonly LinkRef[] };
}

/** The hero, with the eyebrow privacy and terms print above the title ("Privacy policy", "Terms"). */
export interface LegalHero {
  readonly eyebrow?: RichTextString;
  readonly title: RichTextString;
  readonly lead?: RichTextString;
  /** Kheelu's note on a board (refund, shipping), shown from 900 px. */
  readonly art?: ArtBoardRef;
}

interface LegalDocBase {
  readonly slug: string;
  readonly meta: Meta;
  readonly hero: LegalHero;
  readonly summary: LegalSummary;
  /** The help line under the short version (refund, shipping), in the page's own words. */
  readonly help?: RichTextString;
  /** The runs of parts the contents list and the document head (terms). */
  readonly groups?: readonly LegalGroup[];
  readonly parts: readonly LegalPart[];
  readonly close?: LegalClose;
}

/**
 * A policy page. A draft is a placeholder by definition: it shows the draft note
 * on beta and the production build refuses it (ADR-004). An approved document
 * carries the real date the founder approved it, its "Last updated" line (D029).
 */
export type LegalDoc =
  | (LegalDocBase & { readonly status: "draft"; readonly approvedOn: OrPlaceholder<IsoDate> })
  | (LegalDocBase & { readonly status: "approved"; readonly approvedOn: IsoDate });

/** A legal page as its content module writes it and LegalTemplate renders it (`satisfies LegalPage`): the document. */
export type LegalPage = LegalDoc;

/** A help line: a short lead, then the WhatsApp and call links (seller.ts `help`, `storeHelp`). */
export interface HelpLineCopy {
  readonly lead: string;
  readonly contact: RichTextString;
}

/** The words LegalTemplate prints around every legal document, the same on all four pages (content/en-IN/legal/shared.ts). */
export interface LegalTemplateCopy {
  /** The note above the hero while the document is a draft: "Draft for the founder’s approval; not legal advice." */
  readonly draftNote: RichTextString;
  /** Before the approval date: "Last updated:". */
  readonly updated: RichTextString;
  /** The contents list's heading: "On this page". */
  readonly contents: RichTextString;
  /** The second line of every grievance card: how a complaint gets its reference. Left out while no system issues one
   *  (D055 item 7), and the card is its D032 line alone. */
  readonly grievanceNote?: RichTextString;
  /** The reference close's help line (privacy, terms): seller.help, the line beside every chilli button. */
  readonly help: HelpLineCopy;
}
