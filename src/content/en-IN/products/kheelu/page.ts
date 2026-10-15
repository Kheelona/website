/// <reference types="next/image-types/global" />
import iraSticker from "@ds/assets/Cast/ira-sticker.png";
import myraSticker from "@ds/assets/Cast/myra-sticker.png";
import bellyModule from "@ds/assets/Kheelu/kheelu-belly-module.png";
import kheeluSticker from "@ds/assets/Kheelu/kheelu-front-sticker.png";
import kheeluOnFur from "@ds/assets/Kheelu/kheelu-on-fur.jpg";
import advikWhisper from "@ds/assets/Photo library/advik-02-whispering-to-kheelu-web.webp";
import heartChilli from "@ds/assets/Shapes/heart-chilli.svg";
import starSun from "@ds/assets/Shapes/star-sun.svg";
import type { ExampleConversationLines } from "@/components/sections/ExampleConversation/example-conversation.types";
import type { ModeCardCopy } from "@/components/sections/ModesSection/modes-section.types";
import type { LanguageChip } from "@/components/ui/LanguageChips/LanguageChips";
import type { TrustItem } from "@/content/types";
import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import { withoutHiddenRows } from "@/lib/content/placeholder";
import { cta } from "../../cta";
import { faqs, filmLink, pickFaqs } from "../../faqs";
import { filmQuotes, films, filmsStrip } from "../../films";
import { PLUS_NOTE } from "../../offer";
import { RETURN_DAYS, RETURN_PICKUP_FREE, WARRANTY_MONTHS } from "../../policies";
import { recognitionLabel } from "../../recognition";
import { seller } from "../../seller";
import { TRUST_COMPACT, TRUST_OFFER_THIRD, trustItems, type TrustId } from "../../trust";
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
 * Then task Q2.10, the selling update (D064 items 2 and 8, D065 items 1, 3-6 and 8, the main session's rulings of
 * 2026-10-15; the copy: wiki/site/d2c-conversion-plan-2026-10-15.md v2 §3 with the CMO's conditions): twelve folds in the
 * plan's order. The hero takes Home's eyebrow and the founder's lead, without the help line; the expert clip goes to Home
 * (task Q2.9) and the parent-app and safety folds to /safety (task Q2.11); the sample chats are three, on the DS Tabs, with
 * their own button (`product-ask`); "How it works" says "instead of guessing" and the daily limit; the comparison moves
 * here from Home; safety is one line with the built link to /safety; the price question leads with the total, without GST,
 * and the Kheelona+ question follows the first-week one. Deviation rows: the main session's (deviations.ts SELLING_UPDATE).
 */

const trust = (ids: readonly TrustId[]): TrustItem[] => ids.map((id) => trustItems[id]);
const COMPACT = trust(TRUST_COMPACT);

/** Fold 4's lead: the page's answer-first statement of what Kheelu is, also the Product node's description. */
const WHAT_IT_IS =
  "Kheelu is a screen-free plush toy for ages 3 to 7 that holds a back-and-forth conversation. It answers your child, then asks a question back, so they do the thinking.";

/** Each mode's card: its look and the words the mockup gives it; the name and icon are the product's facts. */
const MODE_CARDS: Readonly<Record<Mode["id"], Omit<ModeCardCopy, "title" | "icon">>> = {
  ai: { tone: "blue", body: "Open conversation, on your home Wi‑Fi. It can’t browse the internet." },
  story: { id: "story-mode", tone: "sun", tint: true, body: "Stories, poems and jingles your child enjoys and learns from. No Wi‑Fi needed." },
  bluetooth: { tone: "chilli", body: "Pair your phone and use it as a speaker." },
};

/** The sample chats' heading, which also names their tab row (the plan gives the row no words of its own). */
const CHATS_TITLE = "What {hand:asking back} sounds like.";
const CHATS_LABEL = "What asking back sounds like.";
/** One sample chat: the child asks, Kheelu answers and asks one back, the child answers (D017; AI mode only, ruling 6). */
const chat = (ask: string, answer: string, reply: string): ExampleConversationLines => [
  { speaker: "child", who: "Your child", text: ask },
  { speaker: "kheelu", who: "Kheelu", text: answer },
  { speaker: "child", who: "Your child", text: reply },
];

/** The product-safety-learn link after the safety line (the D2C plan v2 §3 fold 9): its built label, address and shield,
 *  the DS secondary button Home's "See how we built safety in" is (task Q2.15; the consistency review's CMO-3, CON-4). */
const SAFETY_LINK = cta.secondary["product-safety-learn"];

/** A language chip: its own name in its own `lang`, the English name under it (English itself needs neither). */
const chip = ({ name, native, lang }: (typeof product.languages)[number]): LanguageChip =>
  native === name ? { native } : { native, english: name, lang };

export const kheeluPage = {
  meta: {
    title: "Kheelu by Kheelona: the toy that talks back, ages 3 to 7",
    /* The D2C plan v2 §3 (task Q2.10; D065 item 3): the total, without "incl. GST". */
    description: {
      token:
        "Kheelu, the screen-free toy that talks back: it answers your child, then asks a question back. Ages 3 to 7. {price:headline} in total; {price:token} refundable advance.",
      full: "Kheelu, the screen-free toy that talks back: it answers your child, then asks a question back. Ages 3 to 7. {price:full} in total, delivery included.",
    },
    og: { image: "/og/kheelu.jpg", alt: "Kheelu, the cream plush rabbit that talks back" },
  },
  sections: [
    /* Fold 1 · Hero. No id on the button: the phone buy bar shows from first paint (strategy §3.4). */
    {
      kind: "hero-section",
      config: {
        variant: "product",
        /* The D2C plan v2 §3 fold 1 (task Q2.10; D065 item 1): Home's eyebrow, the built H1, the founder's lead. */
        heading: {
          id: "hero-title",
          eyebrow: "Screen-free AI toy · Ages 3 to 7",
          title: "Kheelu talks back. {hand:The good kind.}",
          lead: "A soft plush rabbit that answers every why, then asks one back.",
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
      /* No help line beside the hero's button (the D2C plan v2 §1.1: the closes and the store carry it). */
      cta: { cta: "product-top", layout: "stack", trust: COMPACT },
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
        /* Under the card's button, the offer cards' row (task Q2.8's review; the D2C plan v2 §1.1, product fold 3): the one
           risk-reversal line, the delivery line, then the card's third row, two lists since task Q2.15 (CON-3), so they
           wrap as Home's do. No help line (task Q2.13; §3 fold 3, CMO m9). */
        trust: COMPACT,
        third: trust(TRUST_OFFER_THIRD),
        /* In the card, after the perks and before the button: the same note as Home's card (task Q2.13; §3 fold 3). */
        note: PLUS_NOTE,
        /* The page's keyword in the alt, true of the picture (the D2C plan v2 §3 fold 3). */
        photo: { src: kheeluOnFur, alt: "Kheelu by Kheelona, the cream plush rabbit that talks back, with rainbow ears and a speaker in its tummy." },
      },
    },
    /* "Recognised by" (task 8c.3; D061's rulings): the /team strip's programmes (D054 item 20), read from the team page,
       names only. Since task 8c.8 (the CMO's wave 8c review, m2) right after the offer column, which ends on the share link:
       before the offer it pushed the offer card about 680 px down a phone page. Since task Q2.13 (the D2C plan v2 §3 fold 4,
       the CMO's m10) as Home shows it: the small label "Recognised by" over the row, no heading (RecognitionStrip `label`);
       on the page's own background, as the offer fold above it. The expert clip that followed it went to Home with task
       Q2.10 (task Q2.9; D064 item 8). */
    { kind: "recognition-strip", config: recognitionLabel },
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
    /* Right after the steps: what asking back sounds like (task 8c.3; the CMO's AP-15), since task Q2.10 three sample
       chats on the DS Tabs (the D2C plan v2 §3 fold 6, ruling 6): the moon (home.md fold 2 variant b, built), the dosa pan
       and spider legs, each child-led, answered then asked back, AI mode only (D017), no Story-mode pairing (D027), no
       skill named. The label sits above every chat and is never removed: we wrote them, no child said them. Then the line
       that plays film 6 in the strip, and the fold's own button (`product-ask`) with the price line and the trust line.
       Without the ImaginationFrame and its doodles, inside the page's HTML budget. */
    {
      kind: "example-conversation",
      config: {
        heading: { id: "example-title", title: CHATS_TITLE },
        note: "Illustrative example, not a recording.",
        tabs: {
          label: CHATS_LABEL,
          items: [
            {
              id: "chat-moon",
              label: "The moon",
              lines: chat(
                "“Why does the moon follow our car?”",
                "“The moon is very, very far away. So when the trees zoom past, the moon seems to stay with you. What else looks like it follows you?”",
                "“My shadow?”",
              ),
            },
            {
              id: "chat-dosa",
              label: "The dosa pan",
              lines: chat(
                "“Why does the dosa pan sizzle?”",
                "“The pan is very hot, and the batter has water in it. When the water touches the hot pan, it turns into steam, and that’s the sizzle. Why do you think the pan has to be hot first?”",
                "“So the dosa gets crispy?”",
              ),
            },
            {
              id: "chat-spider",
              label: "Spider legs",
              lines: chat(
                "“How many legs does a spider have?”",
                "“Eight. That’s two more than an ant, which has six. What else do you know that has more than four legs?”",
                "“A centipede?”",
              ),
            },
          ],
        },
        /* An in-page link that plays film 6 in the strip, as the languages answer's does (task 8c.8, m8), built the same
           way from films.ts (faqs.ts filmLink), so the film's chip and id are never typed here. */
        after: `Hear it in two languages: watch ${filmLink("a-story-in-two-languages")}.`,
      },
      cta: { cta: "product-ask", trust: COMPACT },
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
            /* "instead of guessing" (D065 item 8, G29's confirmed half; the D2C plan v2 §3 fold 7). */
            { icon: "wifi-slash", text: "It can’t browse the internet. When it doesn’t know something, it says so instead of guessing." },
            { icon: "microphone", text: "Each conversation starts with a press of the wake-up button. It switches itself off after a couple of minutes of quiet." },
            /* G28's other half in the founder's words (D066 item 7; task Q2.17), beside the wake-up line. */
            { icon: "moon", text: "Between conversations nothing is sent anywhere, and when Kheelu rests, its Wi‑Fi is switched off." },
            /* The daily limit in the founder's words (D065 item 5, G28): never that a parent sets it. */
            { icon: "clock", text: "Each Kheelu has a daily limit on how long it talks." },
            { icon: "sliders-horizontal", text: "At setup, you enter your child’s age in the parent app." },
            { icon: "battery-charging", text: "It charges with the charger in the box. {ph:F4 battery life per charge and charging time}" },
          ], "text"),
          image: { src: bellyModule, alt: "Kheelu’s tummy unit up close, with its speaker, light ring and buttons." },
        },
        link: { label: "How setup works", href: "/setup" },
      },
    },
    /* Compared by kind of product, never brands (B14), moved here from Home's fold 7 in its built words (task Q2.10; the
       D2C plan v2 §3 fold 8; messaging, "against the alternatives"; D044 the app column). No link: `compare-learn` stays
       Home's, and stops firing. */
    {
      kind: "compare-by-category",
      config: {
        heading: {
          eyebrow: "Compare",
          title: "Other AI gives answers. Kheelu {hand:asks questions.}",
          lead: "Thinking out loud, not tapping on a screen.",
          id: "compare-title",
        },
        label: "Comparison by kind of product",
        firstColumn: "What matters",
        columns: { us: "Kheelu", others: ["Puzzles and activity books", "Learning apps and videos", "Smart speakers and chatbots"] },
        rows: [
          {
            label: "Screen-free",
            us: { mark: "yes", text: "Yes" },
            others: [{ mark: "yes", text: "Yes" }, { mark: "no", text: "No" }, { mark: "some", text: "Varies" }],
            phone: { us: "Kheelu: Yes", others: ["Puzzles and activity books: yes", "Learning apps and videos: no", "Smart speakers and chatbots: varies"] },
          },
          {
            label: "Holds a back-and-forth conversation",
            us: { mark: "yes", text: "Yes" },
            others: [{ mark: "no", text: "No" }, { mark: "some", text: "Rarely: mostly tapping and watching" }, { mark: "yes", text: "Yes" }],
            phone: {
              us: "Kheelu: Yes",
              others: ["Puzzles and activity books: no", "Learning apps and videos: rarely, mostly tapping and watching", "Smart speakers and chatbots: yes"],
            },
          },
          {
            label: "Asks your child a question back",
            us: { mark: "yes", text: "Yes, after it answers" },
            others: [{ mark: "no", text: "No" }, { mark: "some", text: "Some ask quiz questions" }, { mark: "some", text: "Usually just answers" }],
            phone: {
              us: "Kheelu: Yes, after it answers",
              others: ["Puzzles and activity books: no", "Learning apps and videos: some ask quiz questions", "Smart speakers and chatbots: usually just answer"],
            },
          },
          {
            label: "You can read every conversation",
            us: { mark: "yes", text: "Yes, in the parent app" },
            others: [{ mark: "some", text: "Nothing to read" }, { mark: "some", text: "Nothing to read" }, { mark: "some", text: "Varies" }],
            phone: {
              us: "Kheelu: Yes, in the parent app",
              others: ["Puzzles and activity books: nothing to read", "Learning apps and videos: nothing to read", "Smart speakers and chatbots: varies"],
            },
          },
        ],
        caption: "Kinds of products, not brands: what each one usually does.",
      },
    },
    /* Safety in one line (task Q2.10; D064 item 2; the D2C plan v2 §3 fold 9, ruling 8): the facts live on /safety, which
       now carries the parent app's every-conversation fold too (task Q2.11). The built link "See how we built safety in"
       (`product-safety-learn`, approved at Gate A; CMO M3) as Home's: the DS secondary button with the shield (task Q2.15,
       CMO-3, CON-4; DS 07-selling.md:52). On the band, the page's `#safety` kept. */
    {
      kind: "trust-section",
      config: {
        variant: "pointer",
        id: "safety",
        band: true,
        pointer: "When the microphone is on, how Kheelu answers, and what you can read and delete, fact by fact:",
        link: { label: SAFETY_LINK.label, href: SAFETY_LINK.href, cta: SAFETY_LINK.cta, icon: SAFETY_LINK.icon },
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
    /* The questions (the D2C plan v2 §3 fold 11; task Q2.10): the price question with the total and no GST, then Home's
       "Isn’t this just screen time in disguise?" (task Q2.13: question 5, "As Home's question 4", the one faqs.ts entry),
       the Kheelona+ question after the first-week one; "When does delivery start?" left the page (the offer card and the
       trust line carry the date). Then the D025 line, its source and the help line. */
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
          "screen-time-in-disguise",
          "returns-and-warranty",
          "after-the-first-week",
          "after-six-months",
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
        /* The trust line, as beside every button (task Q2.8's review; the D2C plan v2 §1.1, product fold 12): in place of
           meet-kheelu.html's five-item row; the warranty and the ways to pay sit under the offer card's button. Since task
           Q2.15 (the consistency review's CON-2) the lines grouped beside the button, as every other close lays them out
           (the CTA block's default layout; meet-kheelu.html's "full" block left). */
        cta: { cta: "product-foot", id: "reserve", trust: COMPACT, helpLine: true },
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
