/**
 * The CTA value registry: every value of `data-ph-capture-attribute-cta`, which PostHog promotes to
 * a top-level `cta` property on `$autocapture` (ADR-006; architecture §8.3). The eight existing
 * values are owned by wiki/site/tracking-inventory.md §6 and never change; `home-arc` and `compare`
 * are reserved and never reused. The attribute is written only by the `Button` primitive from a
 * typed `cta` prop (`CtaId`), so no free-text value can reach a page.
 *
 * Data only; test/guards/tracking-registry.test.ts proves it equal to the inventory, to
 * architecture §8.3 and to the approved mockups.
 */

/** preorder: a pre-order button to the store; secondary: a ghost or secondary link; chat: the WhatsApp bubble. */
export type CtaRole = "preorder" | "secondary" | "chat";

/**
 * Where a value appears: a route path, or one of these groups.
 * - `every-marketing-page`: every page in the site shell (NavBar and NavDrawer).
 * - `every-page`: every page, the store and `/thanks` included.
 * - `articles-with-close`: story articles whose close carries the CTA (not the no-CTA close, B5).
 * - `not-found`: the 404 page.
 */
export type CtaPlacement = `/${string}` | "every-marketing-page" | "every-page" | "articles-with-close" | "not-found";

export interface CtaSpec {
  readonly status: "existing" | "new";
  /** Kept so the name is never reused for something else; no element carries it. */
  readonly reserved: boolean;
  readonly role: CtaRole;
  readonly element: string;
  readonly pages: readonly CtaPlacement[];
  readonly note?: string;
}

const HOME = ["/"] as const;
const PRODUCT = ["/products/kheelu"] as const;

const CTA_TABLE = {
  hero: {
    status: "existing",
    reserved: false,
    role: "preorder",
    element: 'Home hero button (id="hero-cta", arrow)',
    pages: HOME,
  },
  navbar: {
    status: "existing",
    reserved: false,
    role: "preorder",
    element: "Laptop nav button (shown from 1024 px; G-06, D041)",
    pages: ["every-marketing-page"],
  },
  "navbar-mobile": {
    status: "existing",
    reserved: false,
    role: "preorder",
    element: "Drawer button",
    pages: ["every-marketing-page"],
  },
  finale: {
    status: "existing",
    reserved: false,
    role: "preorder",
    element: "Close button",
    pages: [
      "/",
      "/safety",
      "/ai-toys-for-kids-in-india",
      "/stories",
      "articles-with-close",
      "/team",
      "/contact",
      "not-found",
    ],
  },
  "product-top": {
    status: "existing",
    reserved: false,
    role: "preorder",
    element: "Product hero button (no id, arrow)",
    pages: PRODUCT,
  },
  "product-foot": {
    status: "existing",
    reserved: false,
    role: "preorder",
    element: "Product close button",
    pages: PRODUCT,
  },
  "home-arc": {
    status: "existing",
    reserved: true,
    role: "preorder",
    element: "No equivalent button (A16); never reused",
    pages: [],
  },
  compare: {
    status: "existing",
    reserved: true,
    role: "preorder",
    element: "No equivalent button (A16); never reused",
    pages: [],
  },
  "sticky-bar": {
    status: "new",
    reserved: false,
    role: "preorder",
    element: "Phone sticky bar",
    pages: [
      "/",
      "/products/kheelu",
      "/safety",
      "/ai-toys-for-kids-in-india",
      "/stories",
      "articles-with-close",
      "/team",
      "/contact",
    ],
    note: "the mid version's name",
  },
  "see-it-ask": {
    status: "new",
    reserved: false,
    role: "preorder",
    element: "Home belief-fold button",
    pages: HOME,
  },
  safety: {
    status: "new",
    reserved: false,
    role: "preorder",
    element: "Home safety-fold button",
    pages: HOME,
  },
  "product-offer": {
    status: "new",
    reserved: false,
    role: "preorder",
    element: "Product offer-card button",
    pages: PRODUCT,
  },
  "product-safety": {
    status: "new",
    reserved: false,
    role: "preorder",
    element: "Product safety-fold button",
    pages: PRODUCT,
  },
  "hero-learn": {
    status: "new",
    reserved: false,
    role: "secondary",
    element: "Home hero ghost link",
    pages: HOME,
  },
  "see-it-ask-learn": {
    status: "new",
    reserved: false,
    role: "secondary",
    element: "Home belief-fold ghost link",
    pages: HOME,
  },
  "safety-learn": {
    status: "new",
    reserved: false,
    role: "secondary",
    element: "Home safety-fold secondary link",
    pages: HOME,
  },
  "compare-learn": {
    status: "new",
    reserved: false,
    role: "secondary",
    element: "Home comparison ghost link",
    pages: HOME,
  },
  "faq-more": {
    status: "new",
    reserved: false,
    role: "secondary",
    element: "Home FAQ ghost link",
    pages: HOME,
  },
  "product-safety-learn": {
    status: "new",
    reserved: false,
    role: "secondary",
    element: "Product safety secondary link",
    pages: PRODUCT,
  },
  "refund-learn": {
    status: "new",
    reserved: false,
    role: "secondary",
    element: '"Meet Kheelu" close link',
    pages: ["/refund"],
  },
  "shipping-learn": {
    status: "new",
    reserved: false,
    role: "secondary",
    element: '"Meet Kheelu" close link',
    pages: ["/shipping"],
  },
  "whatsapp-float": {
    status: "new",
    reserved: false,
    role: "chat",
    element: "The WhatsApp bubble (not a chilli button; D050)",
    pages: ["every-page"],
    note: "carries ph-no-capture on /thanks",
  },
} as const satisfies Record<string, CtaSpec>;

/** Every registered value, the reserved two included. */
export type CtaValue = keyof typeof CTA_TABLE;
export type ReservedCtaValue = {
  [V in CtaValue]: (typeof CTA_TABLE)[V]["reserved"] extends true ? V : never;
}[CtaValue];
/** A value an element may carry: every registered value except the reserved ones. */
export type CtaId = Exclude<CtaValue, ReservedCtaValue>;

export const CTAS: Readonly<Record<CtaValue, CtaSpec>> = CTA_TABLE;
export const CTA_VALUES = Object.keys(CTA_TABLE) as readonly CtaValue[];
export const RESERVED_CTA_VALUES: readonly ReservedCtaValue[] = CTA_VALUES.filter(
  (v): v is ReservedCtaValue => CTAS[v].reserved,
);
export const CTA_IDS: readonly CtaId[] = CTA_VALUES.filter((v): v is CtaId => !CTAS[v].reserved);
