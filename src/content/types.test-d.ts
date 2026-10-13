/**
 * Type tests for the content shapes. `tsc --noEmit` checks this file (the
 * `.test-d.ts` suffix keeps it out of the runtime suite and inside the type
 * check): every fixture below must satisfy its type, and every line marked
 * @ts-expect-error must be refused, or the type check fails. The fixtures follow
 * the approved mockups, abridged.
 */
import type { StaticImageData } from "next/image";
import { placeholder as ph } from "@/lib/content/placeholder";
import type { PreorderMode } from "@/lib/store/mode";
import type {
  Answer,
  Article,
  ArtBoardRef,
  Copy,
  DoodleRef,
  FaqItem,
  Film,
  Gated,
  HelpLineCopy,
  IconText,
  ImageRef,
  LegalDoc,
  LegalPage,
  LegalTemplateCopy,
  Meta,
  Offer,
  OfferCard,
  OfferCopy,
  OfferMode,
  Placeholder,
  ProseBlock,
  SupportChat,
  TrustItem,
} from "./types";

const photo: StaticImageData = { src: "/_next/static/media/myra-04.webp", width: 1208, height: 1500 };

/** True only when A and B are the same type. */
type Equals<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

/* ── Mode variants and copy ── */

export const sentence = {
  token: "Reserve yours for {price:token} today, refundable until dispatch.",
  full: "{price:full} (incl. GST), paid in full when you order.",
} satisfies Copy;
// @ts-expect-error a mode variant needs both modes
export const halfVariant = { token: "Reserve yours today." } satisfies Copy;

/* ── The offer module, content/en-IN/offer.ts (Home fold 9, product fold 3) ── */

/* Home's card: the delivery line first, then three perks (mockup/pages/home.html, fold 9). */
const homePerks = [
  { icon: "truck", text: "{delivery}" },
  { icon: "package", text: "In the box: Kheelu plush toy, charger and quick-start card" },
  { icon: "map-pin", text: "Delivery anywhere in India, included" },
  { icon: "check-circle", text: "A GST invoice with every order" },
] satisfies readonly IconText[];

/* The product page's card lists five, Kheelona+ among them (mockup/pages/meet-kheelu.html, fold 3). */
const productPerks = [
  { icon: "package", text: "In the box: Kheelu plush toy, charger and quick-start card" },
  { icon: "star", text: "6 months of Kheelona+ included: stories, poems, jingles, languages and the parent app" },
  { icon: "map-pin", text: "Delivery anywhere in India, included" },
  { icon: "truck", text: "{delivery}" },
  { icon: "check-circle", text: "A GST invoice with every order" },
] satisfies readonly IconText[];

export const offerCopy = {
  sentence: {
    token:
      "Reserve yours for {price:token} today, refundable until dispatch, then pay {price:balance} before delivery: {price:headline} in total (incl. GST).",
    full: "{price:full} (incl. GST), paid in full when you order.",
  },
  sticky: {
    token: { big: "{price:token} today", small: "refundable · {price:headline} total (incl. GST)" },
    full: { big: "{price:full} (incl. GST)", small: "Paid in full · {delivery}" },
  },
  card: {
    product: "Kheelu",
    priceNote: "incl. GST",
    split: [
      { label: "Today, refundable", price: "token" },
      { label: "Before delivery", price: "balance" },
    ],
    perks: { home: homePerks, product: productPerks },
  },
  plus: "Every Kheelu comes with 6 months of Kheelona+: stories, poems, jingles, languages and the parent app.",
} satisfies OfferCopy;
// @ts-expect-error the price sentence changes with the mode (D028), so it always carries both
export const oneSentence: OfferCopy["sentence"] = "Reserve yours today.";
// @ts-expect-error the sticky bar's lines change with the mode too
export const oneSticky: OfferCopy["sticky"] = { big: "{price:token} today", small: "refundable" };

/* ── Offer view model ── */

export const offer = {
  mode: "token",
  headlinePaise: 499_900,
  prices: { token: "a", balance: "b", headline: "c", full: "d", mrp: "e", launch: "f" },
  sentence: offerCopy.sentence.token,
  sticky: offerCopy.sticky.token,
  card: { product: "Kheelu", priceNote: "incl. GST", split: offerCopy.card.split, perks: offerCopy.card.perks },
  plus: offerCopy.plus,
  delivery: "Deliveries start mid-November",
  availabilityStarts: "2026-11-15",
} satisfies Offer;

/* Full mode: the same perks, no split (G-08). */
export const fullOffer = {
  ...offer,
  mode: "full",
  headlinePaise: 799_900,
  sentence: offerCopy.sentence.full,
  sticky: offerCopy.sticky.full,
  card: { product: "Kheelu", priceNote: "incl. GST", perks: offerCopy.card.perks },
} satisfies Offer;

// @ts-expect-error the offer has no such price
export const unknownPrice: Offer["prices"] = { token: "a", balance: "b", headline: "c", full: "d", mrp: "e", launch: "f", tax: "g" };
// @ts-expect-error there is no third mode
export const thirdMode: Offer["mode"] = "sold-out";
// @ts-expect-error a split row names one of the offer's six amounts, never a typed one
export const unknownSplit: OfferCard["split"] = [{ label: "Today, refundable", price: "deposit" }];
// @ts-expect-error each placement has its own perks list, the product page's included
export const homeOnly: OfferCard["perks"] = { home: homePerks };

/* The offer's mode is the store's own union, so a new store tier cannot drift past it. */
export const storeMode: Equals<OfferMode, PreorderMode> = true;

/* ── Meta ── */

export const homeMeta = {
  title: "Kheelu by Kheelona: the screen-free AI toy, ages 3 to 7",
  description: {
    token: "A screen-free plush toy, ages 3 to 7. {price:headline} (incl. GST), delivered anywhere in India.",
    full: "A screen-free plush toy, ages 3 to 7. {price:full} (incl. GST), delivered anywhere in India.",
  },
  og: { image: "/og/home.jpg", alt: "Kheelu, the cream plush rabbit, beside a smiling boy." },
} satisfies Meta;
// @ts-expect-error an Open Graph image is a site path, not a page in the mockup
export const relativeOg = { title: "t", description: "d", og: { image: "og.png", alt: "" } } satisfies Meta;

/* ── FAQ, answers and trust ── */

export const ageFaq = {
  id: "age-three",
  question: "Is Kheelu OK for a 3-year-old?",
  answer: "Kheelu is made for children aged 3 to 7. For 3-year-olds, we advise having a grown-up nearby.",
} satisfies FaqItem;

export const groupsFaq = {
  id: "child-safety-groups",
  question: "What do child-safety groups say about AI toys?",
  answer: "In January 2026, Common Sense Media advised parents not to give AI toys to children aged 5 and under.[^1]",
  detail: [
    { kind: "p", text: "Here is what Kheelu does about each concern:" },
    {
      kind: "list",
      items: [
        { lead: "Attachment:", text: "Kheelu tells your child it’s a toy." },
        { lead: "Data:", text: "[the four facts at the top of this page](#facts). We don’t sell your data." },
      ],
    },
  ],
} satisfies FaqItem;
// @ts-expect-error every FAQ item has a stable id
export const anonymousFaq = { question: "q", answer: "a" } satisfies FaqItem;

export const lateTalkerAnswer = {
  question: "What helps a late talker?",
  answer: "Talk with your child, wait, and follow their lead.",
  detail: [{ kind: "disclaimer", text: "Kheelu is a toy, not a therapy or treatment." }],
} satisfies Answer;

export const returnsTrust = {
  id: "returns-7-days",
  icon: "arrow-counter-clockwise",
  label: "7-day returns, no questions asked",
  href: "/refund",
} satisfies TrustItem;
// @ts-expect-error a trust item links to the site's own terms, by path
export const offsiteTrust = { id: "x", icon: "x", label: "x", href: "https://example.org" } satisfies TrustItem;

/* ── Media ── */

export const dsPhoto = { src: photo, alt: "A little girl scribbling with an orange crayon." } satisfies ImageRef;
export const poster = {
  src: "/video/moments/learning-by-asking.jpg",
  width: 1080,
  height: 1920,
  alt: "A young girl on a playmat holding the cream Kheelu plush.",
} satisfies ImageRef;
// @ts-expect-error an image by path declares its size, so nothing shifts
export const sizelessPoster = { src: "/video/moments/x.jpg", alt: "" } satisfies ImageRef;

export const heart = { name: "chalk-heart", draw: true, order: 2 } satisfies DoodleRef;
// @ts-expect-error doodles draw in at most five steps
export const sixthStep = { name: "chalk-heart", draw: true, order: 6 } satisfies DoodleRef;

export const film = {
  id: "learning-by-asking",
  chip: "Learning by asking",
  caption: "Kheelu asks her to explain carrom, and thanks her for the reminder.",
  duration: "0:30",
  poster,
  video: "/video/moments/learning-by-asking.mp4",
  hasOpenCaptions: true,
  consentOnFile: true,
} satisfies Film;
// @ts-expect-error no film without written parental consent on file (D040)
export const unconsented = { ...film, consentOnFile: false } satisfies Film;

export const refundArt = {
  tone: "blue",
  layers: [
    { image: { src: "/brand/sun.svg", width: 120, height: 120, alt: "" }, right: 30, width: 24, bottom: 6 },
    { doodle: { name: "chalk-heart" }, left: 7, width: 10, top: 8, rotate: -12 },
  ],
  sticker: { tone: "sun", tilt: 4, variant: "hand", lines: ["Changed your mind?", "That’s allowed."] },
} satisfies ArtBoardRef;
// @ts-expect-error a layer is an image or a doodle, never both
export const bothLayer = { tone: "sun", layers: [{ image: poster, doodle: heart, width: 10 }] } satisfies ArtBoardRef;
// @ts-expect-error the design system has three tones
export const greenBoard = { tone: "green", layers: [] } satisfies ArtBoardRef;

/* ── Support chat (D050) ── */

export const chat = {
  number: "919187546483",
  label: "Chat with us on WhatsApp",
  shortLabel: "Chat with us on WhatsApp",
  texts: {
    site: "Hi Kheelona! I have a question about Kheelu.",
    store: "Hi Kheelona! I need help with my pre-order.",
    thanks: "Hi Kheelona! I have a question about my order.",
  },
} satisfies SupportChat;
// @ts-expect-error every context has its own text, including the confirmation page
export const twoTexts = { ...chat, texts: { site: "a", store: "b" } } satisfies SupportChat;

/* ── Proof gates (D038) ── */

type Bio = { name: string; bio: string };
export const gatedBio = { name: "A founder", bio: "A line that waits on its proof.", gated: { proof: "F11" } } satisfies Gated<Bio>;
export const liveBio = { name: "A founder", bio: "A line already approved." } satisfies Gated<Bio>;

/* ── Placeholders ── */

export const openFact: Placeholder = ph("F4", "size and weight");
// @ts-expect-error only the helper or the inline token makes a placeholder
export const forged: Placeholder = { kind: "placeholder", id: "F4", note: "size and weight" };

/* ── Articles ── */

export const learningToys = {
  slug: "learning-toys-for-a-three-year-old",
  meta: {
    title: "Learning toys for a 3-year-old, skill by skill",
    description: "What a 3-year-old is working on, and which kinds of toys serve each part of it.",
    og: { image: "/og/learning-toys.jpg", alt: "A little girl drawing at a low table." },
  },
  card: {
    title: "Learning toys for a 3-year-old, skill by skill",
    summary: "What a 3-year-old is working on, and which toys serve each part of it.",
  },
  related: ["what-to-look-for-in-a-safe-ai-toy", "talking-toys-and-late-talkers", "screen-free-play-ideas"],
  published: "2026-09-11",
  updated: "2026-10-12",
  head: {
    title: "Learning toys for a {nowrap:3-year-old,} {hand:skill by skill}",
    lead: "What a {nowrap:3-year-old} is working on, and which kinds of toys serve each part of it.",
    author: "The Kheelona team",
    readMinutes: 4,
    image: dsPhoto,
  },
  answer: {
    question: "What are the best learning toys for a {nowrap:3-year-old}?",
    answer: "Toys that get your child building, pretending and talking.[^1]",
    detail: [{ kind: "p", text: "The word “educational” on a box says little about the toy inside." }],
  },
  body: [
    {
      kind: "part",
      title: "Language: does the toy make a turn?",
      blocks: [
        { kind: "p", text: "So the test for a language toy is simple: does it make a turn?" },
        { kind: "callout", icon: "book-open", lead: "Try this:", text: "pause once or twice and ask what happens next." },
      ],
    },
    { kind: "figure", image: dsPhoto, variant: "wide" },
    {
      kind: "part",
      id: "brain-development",
      title: "Brain development toys for a {nowrap:3-year-old}: what the label means",
      blocks: [{ kind: "p", text: "The words “brain development” on a box prove nothing on their own." }],
    },
    {
      kind: "part",
      title: "A short rule for the toy shop",
      blocks: [
        { kind: "list", variant: "checks", items: ["Check the age on the box.", "Prefer anything that makes a turn."] },
        { kind: "p", text: "[Kheelu](/products/kheelu) is built around that last rule." },
      ],
    },
  ],
  sources: [
    {
      citation: "Ministry of Education, Government of India, “National Education Policy 2020”, chapter 4, para 4.1, p. 11.",
      href: "https://ncert.nic.in/pdf/nep/NEP_2020.pdf",
    },
  ],
  close: "journal",
} satisfies Article;

export const lateTalkers = {
  ...learningToys,
  slug: "talking-toys-and-late-talkers",
  answer: lateTalkerAnswer,
  body: [
    { kind: "part", blocks: [{ kind: "p", text: "Few silences are louder than a 3-year-old who says less." }] },
    {
      kind: "part",
      title: "When should you ask a professional?",
      blocks: [
        { kind: "list", items: ["at any age, your child loses words or skills they used to have.[^1]"] },
        { kind: "p", variant: "gut", text: "If your gut says ask, ask." },
        { kind: "list", variant: "tips", items: [{ icon: "clock", text: "Count to five in your head." }] },
        { kind: "h3", text: "Myth 1: a second home language causes speech delay." },
      ],
    },
  ],
  close: "keep",
} satisfies Article;

export const safeToy = {
  ...learningToys,
  slug: "what-to-look-for-in-a-safe-ai-toy",
  body: [
    {
      kind: "part",
      title: "What to look for, warning by warning",
      blocks: [{ kind: "questions", items: [{ question: "When is the microphone on?", answer: ["Look for a toy that tells you."] }] }],
    },
    {
      kind: "part",
      variant: "breakout",
      title: "How is Kheelu built against each worry?",
      blocks: [
        {
          kind: "facts",
          items: [{ icon: "smiley", title: "A toy, and it says so.", body: "It tells your child it’s a toy." }],
          figure: { src: photo, alt: "Kheelu’s belly, where the wake-up button sits." },
        },
      ],
    },
  ],
} satisfies Article;

/* An article waiting for its rewrite: title and card from the hub, body open. */
export const stub = {
  slug: "screen-free-play-ideas",
  meta: { title: "Screen-free play ideas", description: "Ideas for play without a screen.", og: { image: "/og.png", alt: "" } },
  card: { title: "Screen-free play ideas", summary: "Ideas for play without a screen." },
  related: ["learning-toys-for-a-three-year-old", "talking-toys-and-late-talkers", "what-to-look-for-in-a-safe-ai-toy"],
  published: "2026-07-28",
  updated: "2026-07-28",
  head: { title: "Screen-free play ideas", author: "The Kheelona team" },
  body: [{ kind: "part", blocks: [{ kind: "p", text: "Rewrite pending." }] }],
  sources: [],
  close: "journal",
} satisfies Article;

// @ts-expect-error every article links to exactly three related articles
export const twoRelated = { ...stub, related: ["a", "b"] } satisfies Article;
// @ts-expect-error an article's dates are stored calendar dates
export const computedDate = { ...stub, updated: "July 2026" } satisfies Article;
// @ts-expect-error a block kind the article mockups do not use
export const tableBlock = { kind: "table", rows: [] } satisfies ProseBlock;

/* ── Legal documents ── */

export const twoStatuses: Equals<LegalDoc["status"], "draft" | "approved"> = true;

export const refundDoc = {
  slug: "refund",
  status: "approved",
  approvedOn: "2026-10-30",
  meta: { title: "Refunds, returns and warranty", description: "How to cancel, return or claim.", og: { image: "/og.png", alt: "" } },
  hero: {
    title: "Refunds, returns and warranty, in {hand:plain words.}",
    lead: "Kheelu’s refund policy: you can change your mind.",
    art: refundArt,
  },
  summary: {
    kind: "trust",
    title: "The {hand:short version.}",
    items: [{ icon: "arrow-counter-clockwise", title: "Before dispatch: a full refund.", body: "Cancel any time before we ship." }],
  },
  help: "To cancel, return or claim: [message us on WhatsApp](https://wa.me/919187546483).",
  parts: [
    {
      id: "returns",
      title: "7-day returns, no questions asked.",
      blocks: [
        { kind: "h3", text: "How a return works" },
        { kind: "list", variant: "steps", items: ["Message us within 7 days of delivery.", "We collect it from your door, free."] },
      ],
    },
    {
      id: "faulty",
      title: "Faulty, damaged or not as described.",
      blocks: [{ kind: "callout", icon: "shield-check", lead: "Faulty or not as described? You can have a replacement or a full refund." }],
    },
    { id: "complaints", title: "Complaints.", blocks: [{ kind: "grievance" }] },
    { id: "seller", title: "Who you’re buying from.", blocks: [{ kind: "seller" }] },
  ],
  close: {
    title: "Still {hand:deciding?}",
    lead: "See what Kheelu does, what you get and what you pay.",
    actions: [
      { label: "Meet Kheelu", href: "/products/kheelu", cta: "refund-learn" },
      { label: "Shipping and delivery", href: "/shipping" },
    ],
  },
} satisfies LegalDoc;

/* Spelled through a constant: the production placeholder scan (task 2.9) treats a
   draft status in src/ as open content. */
const DRAFT = "draft" as const;

export const termsDoc = {
  ...refundDoc,
  slug: "terms",
  status: DRAFT,
  approvedOn: ph(null, "the date the founder approves this text"),
  hero: { title: "Terms, in {hand:plain words.}" },
  summary: {
    kind: "points",
    title: "The {hand:short version.}",
    points: [{ lead: "What you pay.", text: "{price:headline} in total (incl. GST)." }],
  },
  parts: [
    { id: "scope", group: "Your pre-order", title: "What these terms cover.", blocks: [{ kind: "p", text: "These terms cover your pre-order." }] },
    { id: "ages", group: "Using Kheelu", title: "Who Kheelu is for.", answer: "Kheelu is made for children aged 3 to 7.", blocks: [] },
  ],
} satisfies LegalDoc;

const recipients = {
  kind: "recipients",
  label: "Everyone who handles your data, and where",
  headings: { who: "Who", what: "What they do for us", where: "Where" },
  keys: { what: "What:", where: "Where:" },
  rows: [{ who: "Razorpay", what: "Takes your payment", where: "India" }],
} as const;

export const privacyParts = [
  {
    id: "measuring",
    title: "How we measure visits and advertising.",
    blocks: [{ kind: "tools", tools: [{ name: "Vercel Web Analytics", blocks: [{ kind: "p", text: "Counts page views." }] }] }],
  },
  {
    id: "who-else",
    title: "Everyone who handles your data, and where.",
    contents: "Who handles your data",
    blocks: [recipients, { kind: "grievance" }, { kind: "seller", lead: "Who we are:" }],
  },
] satisfies LegalDoc["parts"];

// @ts-expect-error a legal document is a draft or approved, nothing else
export const reviewDoc = { ...refundDoc, status: "in review" } satisfies LegalDoc;
// @ts-expect-error an approved document carries the real approval date, never a placeholder
export const undatedApproval = { ...refundDoc, approvedOn: ph(null, "the date") } satisfies LegalDoc;

/* ── Legal pages as LegalTemplate renders them (task 4.3; moved into this file by task 4.5 item 2) ── */

/* The page shape is the document shape: a legal module writes `satisfies LegalPage` and imports nothing from layouts
   (structure §6, wave-4 close). */
export const pageIsDoc: Equals<LegalPage, LegalDoc> = true;

/* Terms, as it reads in both offer modes (terms.md folds 2 and 4): the hero's eyebrow, a run of parts under one group,
   the short version's points and the price paragraphs per mode, and a paragraph that is there in token mode only (its
   full-mode words empty, so the template leaves it out); the close's help line is the template's, not the page's. */
export const termsPage = {
  ...termsDoc,
  hero: { eyebrow: "Terms", title: "Terms, in {hand:plain words.}" },
  groups: [{ label: "Your pre-order", eyebrow: "Part one · Your pre-order" }],
  summary: {
    kind: "points",
    title: "The {hand:short version.}",
    points: [
      { lead: "What you pay.", text: { token: "Reserve yours for {price:token} today.", full: "{price:full} (incl. GST), paid in full when you order." } },
      { lead: "Changed your mind before dispatch?", text: { token: "Cancel any time for a full refund.", full: "Cancel any time before dispatch for a full refund." } },
    ],
  },
  parts: [
    {
      id: "price",
      group: "Your pre-order",
      title: "The price.",
      blocks: [
        { kind: "p", id: "first-500", text: { token: "While the first 500 units last, Kheelu costs {price:headline}.", full: "Kheelu costs {price:full} (incl. GST)." } },
        { kind: "p", text: { token: "The {price:balance} balance is paid by a payment link.", full: "" } },
        { kind: "card", lead: "Customer care:", text: "[WhatsApp](https://wa.me/919187546483)." },
      ],
    },
  ],
} satisfies LegalPage;

export const sharedWords = {
  draftNote: "Draft for the founder’s approval; not legal advice.",
  updated: "Last updated:",
  contents: "On this page",
  grievanceNote: "{ph:how you get a complaint reference to track your complaint; not set up yet}",
  help: { lead: "Questions?", contact: "[WhatsApp](https://wa.me/919187546483)" },
} satisfies LegalTemplateCopy;
export const helpLine = sharedWords.help satisfies HelpLineCopy;

// @ts-expect-error a part's title is the same in both modes: the contents list prints it, and it never names a price
export const titleByMode = { id: "price", title: { token: "The price.", full: "The price, paid in full." }, blocks: [] } satisfies LegalPage["parts"][number];
// @ts-expect-error the recipients rows open with their labels ("What:", "Where:"), so the block names them
export const keyless = { ...recipients, keys: undefined } satisfies LegalPage["parts"][number]["blocks"][number];
// @ts-expect-error the close's help line is the template's (seller.help through LegalTemplateCopy), never retyped
export const retypedHelp = { ...termsPage, close: { actions: [], help: "Questions? [WhatsApp](https://wa.me/919187546483)" } } satisfies LegalPage;
// @ts-expect-error the template's words carry the help line from seller.ts
export const noHelp = { draftNote: "a", updated: "b", contents: "c", grievanceNote: "d" } satisfies LegalTemplateCopy;
