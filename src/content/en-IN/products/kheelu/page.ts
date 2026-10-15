/// <reference types="next/image-types/global" />
import iraSticker from "@ds/assets/Cast/ira-sticker.png";
import myraSticker from "@ds/assets/Cast/myra-sticker.png";
import bellyModule from "@ds/assets/Kheelu/kheelu-belly-module.png";
import kheeluSticker from "@ds/assets/Kheelu/kheelu-front-sticker.png";
import kheeluOnFur from "@ds/assets/Kheelu/kheelu-on-fur.jpg";
import advikWhisper from "@ds/assets/Photo library/advik-02-whispering-to-kheelu-web.webp";
import heartChilli from "@ds/assets/Shapes/heart-chilli.svg";
import starSun from "@ds/assets/Shapes/star-sun.svg";
import appActivity from "@/assets/app/app-activity.webp";
import appPrivacy from "@/assets/app/app-privacy.webp";
import appTranscript from "@/assets/app/app-transcript.webp";
import type { ModeCardCopy } from "@/components/sections/ModesSection/modes-section.types";
import type { IconName } from "@/components/ui/Icon/Icon";
import type { LanguageChip } from "@/components/ui/LanguageChips/LanguageChips";
import type { TrustItem } from "@/content/types";
import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import { withoutHiddenRows } from "@/lib/content/placeholder";
import { cta } from "../../cta";
import { expertFold } from "../../expert-video";
import { faqs, pickFaqs } from "../../faqs";
import { filmQuotes, films, filmsStrip } from "../../films";
import { offerCopy } from "../../offer";
import { RETENTION_LINE, RETURN_DAYS, RETURN_PICKUP_FREE, WARRANTY_MONTHS } from "../../policies";
import { recognitionStrip } from "../../recognition";
import { seller } from "../../seller";
import { SAFETY_FACTS, TRUST_COMPACT, TRUST_FULL, trustItems, type TrustId } from "../../trust";
import { product, type Mode } from "./product";

/**
 * The product page, /products/kheelu (task 5.2; structure §5): its meta and its nine folds in the approved order
 * (mockup/pages/meet-kheelu.html), rendered by PageTemplate from src/app/(site)/products/[slug]/page.tsx. Visible words
 * are the approved mockup's; meta, the full-mode variants and alt texts the copy page's (wiki/site/pages/meet-kheelu.md).
 * The product's facts (modes, languages, specs, the box, safety rows, declarations, schema identity) come from
 * products/kheelu/product.ts, every FAQ from faqs.ts, the trust items from trust.ts, the films from films.ts, the help
 * line from seller.ts and the CTA label and secondary links from cta.ts, so none is written twice. Amounts are
 * `{price:…}` tokens and the delivery line `{delivery}`: the template resolves them from the live offer (ADR-005).
 * Added after Gate A (task 8c.3; D061 item 4 and the main session's rulings; deviation rows to come): the parents' quotes
 * under the films (films.ts), the "Recognised by." strip after them (recognition.ts, the /team strip as built), and,
 * between the offer and "How it works", four plain steps and the labelled example conversation. Then task 8c.6 (D061 items
 * 12-13): the expert clip, its own fold right after the offer card and before the steps (expert-video.ts). Then task 8c.8
 * (the CMO's review of wave 8c, m2 and m11; the main session's rulings): the strip moves from before the offer to right
 * after the offer column, before the expert clip, and the example conversation ends on the child's answer, without its
 * closing sentence, which step 3 already says.
 */

const trust = (ids: readonly TrustId[]): TrustItem[] => ids.map((id) => trustItems[id]);
const COMPACT = trust(TRUST_COMPACT);

/** The close's full row: the delivery line, then the full four. The close draws "Delivery included anywhere in India"
 *  with the map pin, as meet-kheelu.html fold 9 does (wave-3 close ruling); the trust item keeps one icon for Home. */
const CLOSE_TRUST = trust(["deliveries-start", ...TRUST_FULL]).map((item) => (item.id === "delivery-included" ? { ...item, icon: "map-pin" } : item));

/** The parent app's real screens (D044, D046) carry the founder-confirmed caption on every page that shows them. */
const APP_CAPTION = "The Kheelona app is live on Apple’s App Store and the Google Play Store.";

/** Fold 4's lead: the page's answer-first statement of what Kheelu is, also the Product node's description. */
const WHAT_IT_IS =
  "Kheelu is a screen-free plush toy for ages 3 to 7 that holds a back-and-forth conversation. It answers your child, then asks a question back, so they do the thinking.";

/** Each mode's card: its look and the words the mockup gives it; the name and icon are the product's facts. */
const MODE_CARDS: Readonly<Record<Mode["id"], Omit<ModeCardCopy, "title" | "icon">>> = {
  ai: { tone: "blue", body: "Open conversation, on your home Wi‑Fi. It can’t browse the internet." },
  story: { id: "story-mode", tone: "sun", tint: true, body: "Stories, poems and jingles your child enjoys and learns from. No Wi‑Fi needed." },
  bluetooth: { tone: "chilli", body: "Pair your phone and use it as a speaker." },
};

/** A language chip: its own name in its own `lang`, the English name under it (English itself needs neither). */
const chip = ({ name, native, lang }: (typeof product.languages)[number]): LanguageChip =>
  native === name ? { native } : { native, english: name, lang };

export const kheeluPage = {
  meta: {
    title: "Kheelu by Kheelona: the toy that talks back, ages 3 to 7",
    description: {
      token:
        "Kheelu, the screen-free toy that talks back: it answers your child, then asks a question back. Ages 3 to 7. {price:headline} (incl. GST); {price:token} refundable advance.",
      full: "Kheelu, the screen-free toy that talks back: it answers your child, then asks a question back. Ages 3 to 7. {price:full} (incl. GST), delivery included.",
    },
    og: { image: "/og/kheelu.jpg", alt: "Kheelu, the cream plush rabbit that talks back" },
  },
  sections: [
    /* Fold 1 · Hero. No id on the button: the phone buy bar shows from first paint (strategy §3.4). */
    {
      kind: "hero-section",
      config: {
        variant: "product",
        heading: {
          id: "hero-title",
          eyebrow: "Ages 3 to 7",
          title: "Kheelu talks back. {hand:The good kind.}",
          lead: "A screen-free plush toy from Kheelona. It answers your child, then asks a question back, so they do the thinking.",
        },
        art: {
          tone: "blue",
          label: "Kheelu, the cream plush rabbit that talks back, beside a curious little girl in a mustard flowered frock.",
          layers: [
            { image: { src: starSun, alt: "" }, right: 4, width: 30, top: 6 },
            { image: { src: myraSticker, alt: "" }, left: 44, width: 48, bottom: 0 },
            { image: { src: kheeluSticker, alt: "" }, left: 3, width: 46, bottom: 2, rotate: -5 },
            { doodle: { name: "chalk-speech-bubble" }, left: 40, width: 15, top: 14, rotate: -8 },
          ],
          sticker: { tone: "sun", variant: "round", tilt: -8, lead: "It asks.", lines: ["They think."] },
        },
        /* D061 item 1 (task 8c.1): the same board on a phone, on a 4:3 board under the trust line (HeroSection), so
           Kheelu is wholly on the first screen at 390 x 844 and 412 x 915; the same files in the DS order (10-pages.md,
           the scrapbook board): the word sticker top left as on the approved board, the star top right as there, Myra
           bottom-aligned, Kheelu tilted beside her, clear of her face, and the speech bubble by their heads. Myra ends
           at 82 % of the board, so the right-hand column, which the WhatsApp bubble covers wherever a phone's screen
           ends, holds only the star and the blue. */
        phoneLayers: [
          { image: { src: starSun, alt: "" }, right: 3, width: 18, top: 5 },
          { image: { src: myraSticker, alt: "" }, left: 52, width: 30, bottom: 0 },
          { image: { src: kheeluSticker, alt: "" }, left: 32, width: 27, bottom: 4, rotate: -5 },
          { doodle: { name: "chalk-speech-bubble" }, left: 43, width: 11, top: 20, rotate: -8 },
        ],
      },
      cta: { cta: "product-top", arrow: true, block: true, layout: "stack", trust: COMPACT, helpLine: true },
    },
    /* Fold 2 · The seven parent films (D040), every poster lazy (N19). */
    {
      kind: "films-strip",
      config: {
        id: "films",
        heading: {
          id: "films-title",
          eyebrow: "Seven films",
          title: "Real children, {hand:real families.}",
          lead: "Watch the children do the thinking. Then hear from two of their parents.",
        },
        films,
        labels: filmsStrip,
        proof: { text: "Shared with each family’s written consent.", size: "caption" },
        posters: "lazy",
        /* Two parents' own words from the films, each playing its film (task 8c.3, D061 item 4). */
        quotes: filmQuotes,
        /* Each tile carries its film's id: the languages answer's film name links to film 6 and plays it here (task 8c.8,
           the CMO's wave 8c review m8). */
        anchored: true,
      },
    },
    /* Fold 3 · The offer card beside the product photo; the films lead straight to it (task 8c.8, m2). */
    {
      kind: "offer-section",
      config: {
        variant: "photo",
        heading: { eyebrow: "What you get", title: "Everything that {hand:comes with it.}" },
        cta: "product-offer",
        trust: trust(["returns-7-days", "warranty-6-months", "payment-methods"]),
        photo: { src: kheeluOnFur, alt: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy." },
      },
    },
    /* "Recognised by." (task 8c.3; D061's rulings): the /team strip as built (D054 item 20), read from the team page, names
       only. Since task 8c.8 (the CMO's wave 8c review, m2) right after the offer column, which ends on the share link, and
       before the expert clip: before the offer it pushed the offer card about 680 px down a phone page. */
    { kind: "recognition-strip", config: recognitionStrip },
    /* The expert clip, its own fold after the offer card and the strip (task 8c.6; D061 items 12-13; task 8c.8): 34 seconds
       on screens and talk, poster first and played on a tap, the credit and the disclosure under it (expert-video.ts). */
    { kind: "films-strip", config: expertFold },
    /* The loop in four plain steps, just before "How it works" (task 8c.3; D061's rulings, the CMO's AP-14): the button
       first (D018), answer then ask back (D017), and "remembers" beside the parent reading every conversation (D036 #2).
       On the band, so it stands apart from the offer above and the example below. */
    {
      kind: "steps-section",
      config: {
        variant: "four",
        band: true,
        heading: { id: "steps-title", title: "What happens when your child {hand:presses it.}" },
        steps: [
          {
            tone: "sun",
            title: "Press and ask.",
            body: "Your child presses the wake-up button and asks. A light shows Kheelu is listening.",
          },
          { tone: "blue", title: "Kheelu answers.", body: "It answers the question first." },
          { tone: "chilli", title: "Then it asks one back.", body: "A question back, so your child does the thinking." },
          {
            tone: "sun",
            title: "Next time, it remembers.",
            body: "It remembers earlier conversations, so it can pick up where your child stopped. You can read every one of them.",
          },
        ],
      },
    },
    /* Right after the steps: what asking back sounds like, home.md fold 2 variant b word for word (task 8c.3; the CMO's
       AP-15). The label sits above the exchange and is never removed: we wrote it, no child said it. Without the
       ImaginationFrame and its doodles, inside the page's HTML budget. Since task 8c.8 (the CMO's wave 8c review, m11)
       without variant b's closing sentence: step 3 above already says it answers first and asks back. */
    {
      kind: "example-conversation",
      config: {
        heading: { id: "example-title", title: "What {hand:asking back} sounds like." },
        note: "Illustrative example, not a recording.",
        lines: [
          { speaker: "child", who: "Your child", text: "“Why does the moon follow our car?”" },
          {
            speaker: "kheelu",
            who: "Kheelu",
            text: "“The moon is very, very far away. So when the trees zoom past, the moon seems to stay with you. What else looks like it follows you?”",
          },
          { speaker: "child", who: "Your child", text: "“My shadow?”" },
        ],
      },
    },
    /* Fold 4 · How it works: the three modes, the languages, Good to know. */
    {
      kind: "modes-section",
      config: {
        variant: "product",
        heading: {
          id: "modes-title",
          eyebrow: "How it works",
          title: "A toy that talks back, not a toy that {hand:repeats.}",
          lead: WHAT_IT_IS,
        },
        photo: {
          image: { src: advikWhisper, alt: "A boy in a mustard shirt leaning close to whisper to Kheelu, on a cane chair by a tall window." },
          wide: true,
        },
        modes: product.modes.map((mode) => ({ ...MODE_CARDS[mode.id], icon: mode.icon, title: mode.name })),
        languages: {
          title: `Up to ${product.languageCeiling} languages at launch`,
          items: product.languages.map(chip),
          note: "It can switch between them mid-sentence.",
        },
        know: {
          title: "Good to know",
          id: "know-title",
          /* The charging line's F4 slot (battery life and charging time) is hidden until the founder sends its value; the
             line keeps its confirmed half (D054 item 19; task 6.7). */
          items: withoutHiddenRows([
            { icon: "wifi-high", text: "AI mode needs your home Wi‑Fi. Story mode and Bluetooth mode work without it." },
            { icon: "wifi-slash", text: "It can’t browse the internet. When it doesn’t know something, it says so." },
            { icon: "microphone", text: "Each conversation starts with a press of the wake-up button. It switches itself off after a couple of minutes of quiet." },
            { icon: "sliders-horizontal", text: "At setup, you enter your child’s age in the parent app." },
            { icon: "battery-charging", text: "It charges with the charger in the box. {ph:F4 battery life per charge and charging time}" },
          ], "text"),
          image: { src: bellyModule, alt: "Kheelu’s tummy unit up close, with its speaker, light ring and buttons." },
        },
        link: { label: "How setup works", href: "/setup" },
      },
    },
    /* Fold 5 · The parent app, two real screens: every conversation word for word, as the live team's code check found the
       app (D058 items 1, 3 and 8; meet-kheelu.md fold 5). The weekly four-skills report and its chips come back when the
       report ships. */
    {
      kind: "feature-split",
      config: {
        variant: "app-screens",
        placement: "product",
        id: "app",
        heading: {
          id: "app-title",
          eyebrow: "The parent app",
          title: "Every conversation, {hand:word for word.}",
          lead: "Each one appears in the parent app a few minutes after it ends. Search them, read a daily summary, or look back over the week or the month.",
        },
        note: offerCopy.plus,
        screens: {
          images: [
            {
              src: appTranscript,
              alt: "A real parent-app screen showing a child’s conversation with Kheelu word for word, in Hindi and English.",
            },
            {
              src: appActivity,
              alt: "A real parent-app activity screen: a child’s talking time, chats and questions asked today, and each conversation listed by its first words.",
            },
          ],
          caption: APP_CAPTION,
        },
        link: { label: "See what we keep, and for how long", href: "#safety" },
      },
    },
    /* Fold 6 · Safety you can check, in D020's order, then the CTA block; in the live team's code-checked words (D058
       items 1 and 6; meet-kheelu.md fold 6), as Home's. */
    {
      kind: "trust-section",
      config: {
        variant: "safety",
        placement: "product",
        id: "safety",
        band: true,
        heading: { id: "safety-title", eyebrow: "Safety", title: "Safety you can {hand:check.}" },
        items: [
          {
            icon: "microphone",
            title: "You’ll always see when it’s listening.",
            body: "Its microphone turns on only when someone presses the wake-up button. It stays on while your child talks and switches itself off after a couple of minutes of quiet. A light on Kheelu shows whenever it’s listening. Left alone, it hears nothing and sends nothing.",
          },
          {
            icon: "lock-simple",
            title: "How it understands and answers.",
            body: "To understand and answer your child, Kheelu uses trusted speech and AI providers. They process your child’s voice only to produce Kheelu’s reply. They don’t keep it, and they never use it to train their AI. Our contracts with them say so.",
          },
          {
            icon: "eye",
            title: "You can read every conversation.",
            body: `${RETENTION_LINE} Removing a chat in the app hides it on that phone. Deleting your account deletes your child’s profile, conversations and recordings from our servers.`,
          },
          { icon: "hand-heart", title: "We don’t sell your data.", body: "Your child’s data is never used to advertise to them." },
        ],
        screens: {
          images: [
            {
              src: appPrivacy,
              /* Without "delete all chats": the button hides chats on that phone (D058 item 1; meet-kheelu.md question 11). */
              alt: "A real parent-app privacy screen: keep chats for 36 months, save voice recordings and download the child’s data.",
            },
          ],
          caption: APP_CAPTION,
        },
        /* trust.ts types its icons as content (IconRef) and the section's facts still take the DS IconName, so they are
           asserted here as Home asserts them; a page module imports no value from components (structure §6). The
           narrowing moves into TrustSection at the wave close (5.2 review). trust.test.ts holds each to a DS icon and
           this page's test to the mockup's glyph. */
        facts: SAFETY_FACTS.map(({ icon, text }) => ({ icon: icon as IconName, text })),
      },
      cta: {
        cta: "product-safety",
        align: "center",
        trust: COMPACT,
        secondary: { ...cta.secondary["product-safety-learn"], variant: "secondary" },
      },
    },
    /* Fold 7 · The details on tabs (3.5; P1), the declarations beside them. */
    {
      kind: "product-details",
      config: {
        heading: { eyebrow: "Details", title: "The details, {hand:in full.}" },
        tabsLabel: "Product details",
        specs: { title: "Specs", rows: product.specs },
        box: { title: "In the box", items: product.box },
        safety: { title: "Safety", items: product.safety },
        declarations: { title: "Declarations", rows: product.declarations },
        link: { label: "Read the returns and warranty terms", href: "/refund" },
      },
    },
    /* Fold 8 · The eight questions, then the D025 line, its source and the help line. */
    {
      kind: "faq-section",
      config: {
        band: true,
        heading: { id: "faq-title", eyebrow: "Questions", title: "Questions parents {hand:ask.}" },
        items: pickFaqs([
          "do-the-thinking",
          "talks-back",
          "right-for-a-three-year-old",
          "cost-and-advance",
          "delivery-start",
          "returns-and-warranty",
          "after-the-first-week",
          "languages",
          "speech",
        ]),
        sourceMarker: "Source",
        disclaimer: {
          icon: "info",
          text: "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician.",
        },
        sources: {
          label: "Sources",
          items: [
            {
              citation:
                "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts).",
              href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
              label: "developingchild.harvard.edu/key-concept/serve-and-return",
            },
          ],
        },
        help: { icon: "whatsapp-logo", lead: "Still have a question?", contact: seller.help.contact },
      },
    },
    /* Fold 9 · The close. Its button is `#reserve`, the fragment the old page's reserve fold carried (url-map §5a). */
    {
      kind: "close-section",
      config: {
        variant: "split",
        heading: {
          eyebrow: "Pre-order",
          title: "Bring home a toy that {hand:asks back.}",
          lead: "For your own child, or as a gift for a 3 to 7 year old in the family.",
        },
        cta: { cta: "product-foot", id: "reserve", layout: "full", trust: CLOSE_TRUST, helpLine: true },
        art: {
          tone: "sun",
          label: "A smiling girl in a peach kurta beside Kheelu, the cream plush rabbit.",
          layers: [
            { image: { src: heartChilli, alt: "" }, left: 6, width: 28, top: 7 },
            { image: { src: iraSticker, alt: "" }, left: 38, width: 58, bottom: 0 },
            { image: { src: kheeluSticker, alt: "" }, left: 3, width: 42, bottom: 3, rotate: -5 },
            { doodle: { name: "ink-star" }, left: 84, width: 11, top: 8, rotate: 14 },
          ],
        },
      },
    },
  ],
  schema: [
    {
      kind: "product",
      product: {
        id: product.schema.id,
        name: product.schema.name,
        alternateName: product.schema.alternateName,
        brand: product.schema.brand,
        category: product.schema.category,
        description: WHAT_IT_IS,
        images: [product.schema.image],
        countryOfOrigin: product.schema.countryOfOrigin,
        audience: { minAge: product.ages.min, maxAge: product.ages.max },
        properties: product.specs.map(({ term, value }) => ({ name: term, value })),
        /* The price question's answer, as the page shows it: it leads with the headline in both modes (D028). */
        offerDescription: faqs["cost-and-advance"].answer,
        eligibleRegion: "IN",
        returnPolicy: { days: RETURN_DAYS, country: "IN", freeReturn: RETURN_PICKUP_FREE, fullRefund: true },
        shipping: { destination: "IN", free: true },
        warrantyMonths: WARRANTY_MONTHS,
      },
    },
  ],
} as const satisfies PageContent;
