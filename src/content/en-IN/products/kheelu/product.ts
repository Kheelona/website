import { KHEELU_LANGUAGES } from "@/config/site";
import type { IconRef, IconText, RichTextString, SitePath } from "@/content/types";
import { withoutHiddenRows } from "@/lib/content/placeholder";
import { seller } from "../../seller";

/**
 * Kheelu's product facts (architecture §6.1): the details panels and declarations of the product
 * page (mockup meet-kheelu.html fold 7, stacked as approved, N21), the languages and modes, and the
 * schema fields the Product JSON-LD takes (architecture §9.2). Owner page: wiki/product/facts.md;
 * D018 (wake-up button), D034 (origin, manufacturer, MRP), D036 (launch features). The parent app
 * runs on iPhone and Android (D055 item 26). The final specs still open are F4 slots, kept here in their
 * approved places under their approved labels: until the founder sends a value, `withoutHiddenRows`
 * takes its row or line off every list, so nothing of it renders on any environment and the production
 * build has nothing to refuse (D054 item 19; task 6.7); the box contents stay. A value replaces its slot
 * here and its row comes back. The page's own sections live in products/kheelu/page.ts (task 5.2).
 */

/** A definition-list row; an array value prints one line each. */
export interface SpecRow {
  readonly term: string;
  readonly value: RichTextString | readonly RichTextString[];
}

export interface Language {
  /** The English name, as KHEELU_LANGUAGES lists it. */
  readonly name: string;
  /** The language's own name, set in its own `lang`. */
  readonly native: string;
  readonly lang: string;
}

export interface Mode {
  readonly id: "ai" | "story" | "bluetooth";
  readonly name: string;
  readonly icon: IconRef;
  /** What the mode needs to work (connectivity is stated per mode, never as "works offline"). */
  readonly needs: string;
}

export interface ProductFacts {
  readonly slug: string;
  readonly name: string;
  readonly ages: { readonly min: number; readonly max: number };
  readonly modes: readonly Mode[];
  readonly languages: readonly Language[];
  /** "Up to 10 at launch". */
  readonly languageCeiling: number;
  readonly specs: readonly SpecRow[];
  readonly box: readonly IconText[];
  readonly safety: readonly IconText[];
  readonly declarations: readonly SpecRow[];
  readonly schema: {
    /** Never changes (lessons §6): the URL is the old product path on purpose. */
    readonly id: `https://kheelona.com/products/${string}#product`;
    readonly name: string;
    /** The former name, "Lumi" (architecture §6.1, §9.2; claims §4 row 19): allowed by the
     *  banned-phrases guard's `lumi` entry as the sentence `alternateName: "Lumi",` (task 2.13). */
    readonly alternateName?: string;
    readonly brand: string;
    readonly category: string;
    readonly countryOfOrigin: "IN";
    /** A stable machine image (public/media, task 1.5). */
    readonly image: SitePath;
  };
}

const ages = { min: 3, max: 7 } as const;

const modes = [
  { id: "ai", name: "AI mode", icon: "wifi-high", needs: "home Wi‑Fi" },
  { id: "story", name: "Story mode", icon: "book-open", needs: "no Wi‑Fi needed" },
  { id: "bluetooth", name: "Bluetooth mode", icon: "bluetooth", needs: "a paired phone" },
] as const satisfies readonly Mode[];

/** Native names as the language chips print them (Home fold 4, product fold 4). */
const NATIVE: Readonly<Record<(typeof KHEELU_LANGUAGES)[number], { native: string; lang: string }>> = {
  English: { native: "English", lang: "en" },
  Hindi: { native: "हिन्दी", lang: "hi" },
  Bengali: { native: "বাংলা", lang: "bn" },
  Telugu: { native: "తెలుగు", lang: "te" },
  Tamil: { native: "தமிழ்", lang: "ta" },
  Kannada: { native: "ಕನ್ನಡ", lang: "kn" },
  Spanish: { native: "Español", lang: "es" },
  French: { native: "Français", lang: "fr" },
};

const languages: readonly Language[] = KHEELU_LANGUAGES.map((name) => ({ name, ...NATIVE[name] }));
const languageCeiling = 10;
const names = languages.map((l) => l.name);

export const product = {
  slug: "kheelu",
  name: "Kheelu",
  ages,
  modes,
  languages,
  languageCeiling,
  specs: withoutHiddenRows([
    { term: "Ages", value: `${ages.min} to ${ages.max}` },
    { term: "What it is", value: "A cream plush rabbit with a speaker in its tummy and rainbow-lined ears" },
    { term: "Screen", value: "None" },
    { term: "Camera", value: "None" },
    {
      term: "Microphone",
      value: "On only after a press of the wake-up button; off after a couple of minutes of quiet; a light shows while it’s on",
    },
    { term: "Modes", value: modes.map((m) => `${m.name} (${m.needs})`).join(" · ") },
    { term: "Open internet", value: "It can’t browse it" },
    {
      term: "Languages",
      value: `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}; up to ${languageCeiling} at launch`,
    },
    /* What the app shows, as the live team's code check found it (D058 items 1 and 8; meet-kheelu.md fold 7): the
       weekly four-skills report and the new-word count come back when they ship. */
    {
      term: "Parent app",
      value:
        "Every conversation, word for word, a few minutes after it ends; a daily summary; search; a look back over the week or the month. On iPhone and Android.",
    },
    { term: "Size and weight", value: "{ph:F4 size and weight}" },
    { term: "Materials", value: "{ph:F4 outer fabric and filling}" },
    { term: "Battery", value: "{ph:F4 battery type, life per charge and charging time}" },
    { term: "Charger", value: "{ph:F4 charger type and its BIS registration number}" },
  ], "value"),
  box: [
    { icon: "package", text: "Kheelu plush toy" },
    { icon: "battery-charging", text: "Charger" },
    { icon: "book-open", text: "Quick-start card" },
  ],
  safety: withoutHiddenRows([
    /* The mechanism in the live team's words (D058 item 1): no age-graded layer. */
    {
      icon: "shield-check",
      text: "Every reply comes from an AI model given child-safety rules and the age you enter in the parent app, with Google’s safety filters on top.",
    },
    { icon: "check-circle", text: "Tested before launch by trying to make it say unsafe things." },
    {
      icon: "info",
      text: "Toy-safety certification (BIS): applied for, not yet granted. We show no mark until it is granted.",
    },
    { icon: "warning-circle", text: "Age grading and warnings: {ph:F4 toy-safety age grading and any required warnings}" },
    { icon: "battery-charging", text: "Battery safety: {ph:F4 battery safety certification}" },
  ], "text"),
  declarations: withoutHiddenRows([
    { term: "MRP", value: "{price:mrp} (incl. of all taxes)" },
    { term: "Country of origin", value: seller.origin.country },
    { term: "Manufacturer", value: seller.manufacturer },
    { term: "Net quantity", value: "{ph:F4 net quantity}" },
    { term: "Month and year of manufacture", value: "{ph:F4 month and year of manufacture}" },
    /* The consumer-care number the Legal Metrology (Packaged Commodities) Rules ask the declarations for (task Q2.10, the
       main session's ruling): WhatsApp or a call, as approved at Gate A, then the email; the one place outside /contact
       and the legal pages that shows the number (D063 item 2; test/guards/seller-facts-on-pages.test.ts). */
    {
      term: "Consumer care",
      value: [
        `[WhatsApp](${seller.support.whatsapp}) or {nowrap:[call ${seller.support.phone}](${seller.support.tel})}`,
        `[${seller.support.email}](mailto:${seller.support.email})`,
      ],
    },
  ], "value"),
  schema: {
    id: "https://kheelona.com/products/lumi#product",
    name: "Kheelu by Kheelona",
    alternateName: "Lumi",
    brand: seller.brand,
    category: "Screen-free AI toy",
    countryOfOrigin: seller.origin.countryCode,
    image: "/media/kheelu-front.jpg",
  },
} as const satisfies ProductFacts;
