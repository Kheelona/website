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
  /**
   * Placements a founder decision added to this value after Gate A, kept apart from `pages` because no approved
   * mockup carries them (tracking inventory §6, with the decision's id).
   */
  readonly added?: { readonly pages: readonly CtaPlacement[]; readonly decision: string };
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
    element: "Laptop nav button (the nav sticks to the top from 900 px; G-06, D041; Q2.5, D064)",
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
    added: { pages: ["/setup"], decision: "D065" },
    note: "/setup's close (the selling update) was added after Gate A",
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
    note: "stops firing with the selling update (D065): Home's films fold has no button; kept registered, never reused",
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
    note: "stops firing with the selling update (D065): the product page's safety fold moved to /safety; kept registered, never reused",
  },
  "hero-learn": {
    status: "new",
    reserved: false,
    role: "secondary",
    element: "Home hero ghost link",
    pages: HOME,
    note: "stops firing with the selling update (D065): the hero's link is hero-film; kept registered, never reused",
  },
  "see-it-ask-learn": {
    status: "new",
    reserved: false,
    role: "secondary",
    element: "Home belief-fold ghost link",
    pages: HOME,
    note: "stops firing with the selling update (D065): Home's exits go; kept registered, never reused",
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
    note: "stops firing with the selling update (D065): the compare table moved to the product page; kept registered, never reused",
  },
  "faq-more": {
    status: "new",
    reserved: false,
    role: "secondary",
    element: "Home FAQ ghost link",
    pages: HOME,
    note: "stops firing with the selling update (D065): Home's exits go; kept registered, never reused",
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
  "share-whatsapp": {
    status: "new",
    reserved: false,
    role: "secondary",
    element: 'The "Share Kheelu on WhatsApp" ghost link under the offer card (D061, task 8c.2)',
    pages: ["/", "/products/kheelu"],
    note: "placed after Gate A: no approved mockup carries it (tracking inventory §6)",
  },
  "hero-film": {
    status: "new",
    reserved: false,
    role: "secondary",
    element: 'Home hero link "Watch Kheelu ask, in a 30-second film" (plays film 1 in the strip)',
    pages: HOME,
    note: "laptops only (from 900 px): phones have no hero link; placed after Gate A (D065, the selling update): no approved mockup carries it (tracking inventory §6)",
  },
  "home-why": {
    status: "new",
    reserved: false,
    role: "preorder",
    element: '"Why it matters" button',
    pages: HOME,
    note: "placed after Gate A (D065, the selling update): no approved mockup carries it (tracking inventory §6)",
  },
  "home-asks": {
    status: "new",
    reserved: false,
    role: "preorder",
    element: "The sticky-scroll section's button (Kheelu asks. Your child thinks.)",
    pages: HOME,
    note: "placed after Gate A (D065, the selling update): no approved mockup carries it (tracking inventory §6)",
  },
  "home-asks-learn": {
    status: "new",
    reserved: false,
    role: "secondary",
    element: 'The sticky-scroll section\'s link "See how it works" to /products/kheelu#modes',
    pages: HOME,
    note: "placed after Gate A (D065, the selling update): no approved mockup carries it (tracking inventory §6)",
  },
  "home-offer": {
    status: "new",
    reserved: false,
    role: "preorder",
    element: "Home offer-card button (the offer moved up)",
    pages: HOME,
    note: "placed after Gate A (D065, the selling update): no approved mockup carries it (tracking inventory §6)",
  },
  "product-ask": {
    status: "new",
    reserved: false,
    role: "preorder",
    element: 'Product button after "What asking back sounds like."',
    pages: PRODUCT,
    note: "placed after Gate A (D065, the selling update): no approved mockup carries it (tracking inventory §6)",
  },
  "product-compare": {
    status: "new",
    reserved: false,
    role: "preorder",
    element: 'Product button after the comparison ("Other AI gives answers. Kheelu asks questions.")',
    pages: PRODUCT,
    note: "placed after Gate A (D066 item 3, task Q2.17): no approved mockup carries it (tracking inventory §6)",
  },
  "safety-facts": {
    status: "new",
    reserved: false,
    role: "preorder",
    element: "/safety button after the four facts",
    pages: ["/safety"],
    note: "placed after Gate A (D065, the selling update): no approved mockup carries it (tracking inventory §6)",
  },
  "guide-answers": {
    status: "new",
    reserved: false,
    role: "preorder",
    element: 'Guide button after "How Kheelu meets each check."',
    pages: ["/ai-toys-for-kids-in-india"],
    note: "placed after Gate A (D065, the selling update): no approved mockup carries it (tracking inventory §6)",
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
