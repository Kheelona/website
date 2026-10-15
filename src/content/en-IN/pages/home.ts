import myraSticker from "@ds/assets/Cast/myra-sticker.png";
import kheeluBelly from "@ds/assets/Kheelu/kheelu-belly-module.png";
import kheeluSticker from "@ds/assets/Kheelu/kheelu-front-sticker.png";
import kheeluFront from "@ds/assets/Kheelu/kheelu-front.webp";
import advikWhispering from "@ds/assets/Photo library/advik-02-whispering-to-kheelu-web.webp";
import iraDragon from "@ds/assets/Photo library/ira-02-drawing-the-dragon-web.webp";
import taraEvening from "@ds/assets/Photo library/tara-02-evening-with-amma-web.webp";
import flowerChilli from "@ds/assets/Shapes/flower-chilli.svg";
import sunSun from "@ds/assets/Shapes/sun-sun.svg";
import appActivity from "@/assets/app/app-activity.webp";
import appPrivacy from "@/assets/app/app-privacy.webp";
import appTranscript from "@/assets/app/app-transcript.webp";
import kabirRocketPhone from "@/assets/hero/kabir-02-block-rocket-16x10.jpg";
import kabirRocketHero from "@/assets/hero/kabir-02-block-rocket-4x5.jpg";
import type { CtaBlockConfig, CtaSecondary } from "@/components/sections/CtaBlock/cta-block.types";
import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import { cta } from "../cta";
import { expertFold } from "../expert-video";
import { pickFaqs } from "../faqs";
import { filmQuotes, films, filmsStrip } from "../films";
import { PLUS_NOTE } from "../offer";
import { DEFAULT_OG } from "../organization";
import { RETENTION_MONTHS } from "../policies";
import { product } from "../products/kheelu/product";
import { recognitionLabel } from "../recognition";
import { TRUST_COMPACT, TRUST_OFFER_THIRD, trustItems, type TrustId } from "../trust";

/**
 * Home, `/`, since the selling update (task Q2.9; D064, D065; the main session's rulings of 2026-10-15): the D2C plan
 * v2's §2 (wiki/site/d2c-conversion-plan-2026-10-15.md, checked by the claims guard and the CMO), rendered by
 * PageTemplate from `src/app/(site)/page.tsx`. Eleven folds, in the plan's order: the hero, the films with two parents'
 * words and the recognition strip, why it matters, the languages, Kheelu asks (the sticky scroll), the expert clip, the
 * offer card moved up, the compact safety block, a day with Kheelu, the questions and the close. The compare table, the
 * guides and "What is Kheelu?" left the page ("What is Kheelu?" is the FAQ's first answer, the page's answer-first
 * block). Every line is the plan's; every amount a `{price:…}` token of the live offer, the delivery line and the
 * policy numbers their modules', the films' lengths and the languages read from films.ts and product.ts.
 *
 * Rules from the plan held here: no "incl. GST", balance or breakdown on the page but the offer card's two split rows,
 * "first 500" on the card only (D065 items 3-4); the short price line after every button but the card's (C1); the one
 * risk-reversal line first in every trust line; no help line and no phone number (the WhatsApp bubble replaces them,
 * plan §1.1); each cast child once, none beside a real film or a parent's quote (ruling 7): Kabir in the hero, Advik,
 * Ira and Tara in fold 5, Myra on the offer board, the close's board with none. The WhatsApp bubble stays persistent
 * (D050; the main session's ruling (a)): the hero's phone crop keeps Kheelu out of its corner (first-screen.spec.ts).
 *
 * Motion (D049): the hero stays still; below it the DS reveal, the headings' accents and the boards' doodles draw once;
 * the sticky scroll's crossfade and fill only where motion is welcome. Every picture below the first screen is lazy.
 */

const trust = (ids: readonly TrustId[]) => ids.map((id) => trustItems[id]);
const COMPACT = trust(TRUST_COMPACT);

/** The caption under the parent app's real screens (folds 8 and 9; D044). */
const APP_CAPTION = "The Kheelona app is live on Apple’s App Store and the Google Play Store.";

/** The hero photo's alt (the plan's fold 1, the CMO's m4, read on the crop). */
const KABIR_ROCKET_ALT =
  "A boy in glasses and an olive T-shirt stacking wooden blocks into a tall tower on a patterned rug, with Kheelu, the cream plush rabbit from Kheelona, beside him.";

type FilmId = (typeof films)[number]["id"];
const filmBy = (id: FilmId) => films.find((film) => film.id === id)!;

/** D064 item 1: Home's strip plays the films list's 1, 4, 7, 2, 5, 6, 3 (the 2nd film replaced by the 4th, the 3rd by
 *  the 7th); the list keeps the approved order for the product page and the store. */
const HOME_FILM_ORDER: readonly FilmId[] = [
  "learning-by-asking",
  "a-mother-joins-in",
  "a-father-speaks",
  "first-conversations",
  "counting-out-loud",
  "a-story-in-two-languages",
  "a-parent-speaks",
];

/** A film's length in seconds, from its duration ("0:30" → 30): the hero link's number is never typed. */
const seconds = (duration: string) => {
  const [m, s] = duration.split(":").map(Number);
  return m * 60 + s;
};
const FILM_ONE = filmBy("learning-by-asking");

/** The hero's link, laptops only (the plan's §2.0, the CMO's M1 and M2): it plays film 1 in fold 2's strip, which is
 *  anchored so the link can name the tile. */
const HERO_FILM: CtaSecondary = {
  label: `Watch Kheelu ask, in a ${seconds(FILM_ONE.duration)}-second film`,
  href: `#${FILM_ONE.id}`,
  cta: "hero-film",
  variant: "ghost",
  icon: "play",
  from: "laptop",
};

/** The languages' count as the lead says it ("Eight today"), from product.ts: refused past ten, where it would need
 *  another word. */
const COUNT_WORDS = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"] as const;
const count = COUNT_WORDS[product.languages.length];
if (!count) throw new Error(`home.ts: no word for ${product.languages.length} languages`);
const names = product.languages.map((l) => l.name);
const LANGUAGE_NAMES = `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
/** Each language in its own script with its English name; English, the page's own, alone. */
const LANGUAGE_CHIPS = product.languages.map(({ name, native, lang }) => (native === name ? { native } : { native, english: name, lang }));

/** Film 6, "Two languages", as the languages fold plays it: its chip with its length, the strip's play words. */
const TWO_LANGUAGES = filmBy("a-story-in-two-languages");

/** A CTA block under a centred heading or line (folds 3 and 5): the button, the price line, the trust line, centred, no
 *  help line. The button's shape is every block's (task Q2.15: full width on phones, with the arrow). */
const centred = (value: CtaBlockConfig["cta"], secondary?: CtaSecondary): CtaBlockConfig => ({ cta: value, align: "center", trust: COMPACT, secondary });

export const homePage = {
  meta: {
    title: "Kheelu by Kheelona: a screen-free plush toy that talks",
    description: {
      token:
        "Kheelu by Kheelona: a screen-free AI toy for ages 3 to 7 that answers every why, then asks one back. {price:headline} in total; reserve with a refundable {price:token}.",
      full: "Kheelu by Kheelona: a screen-free AI toy for ages 3 to 7 that answers every why, then asks one back. {price:full} in total, delivered anywhere in India.",
    },
    og: { image: "/og/kheelu.jpg", alt: DEFAULT_OG.alt },
  },
  sections: [
    /* Fold 1 · Hero (D065 item 1; the plan's §2.0 and fold 1). The Kabir photo's two crops (task Q2.1): the 4:5 from
       720 px, the 16:10 band under the trust line on phones, Kheelu out of the WhatsApp bubble's corner. No help line;
       the film link on laptops only. Still (D049 pick 2). */
    {
      kind: "hero-section",
      config: {
        variant: "art",
        heading: {
          eyebrow: "Screen-free AI toy · Ages 3 to 7",
          title: "The AI toy that answers every why, then asks your child {hand:one back.}",
          lead: "Kheelu by Kheelona is a soft plush rabbit. You can read every chat.",
          id: "hero-title",
        },
        photo: {
          image: { src: kabirRocketHero, alt: KABIR_ROCKET_ALT },
          phone: { src: kabirRocketPhone, alt: KABIR_ROCKET_ALT },
        },
      },
      cta: { cta: "hero", id: "hero-cta", priceId: "hero-price", layout: "stack", trust: COMPACT, secondary: HERO_FILM },
    },

    /* Fold 2 · The seven films in D064's order (D040), the product page's built heading, two parents' own words (D061
       item 4); posters lazy (ruling 9); no button (fold 3's is one screen below). Anchored: the hero's link plays film 1. */
    {
      kind: "films-strip",
      config: {
        id: "films",
        heading: {
          eyebrow: "Seven films",
          title: "Real children, {hand:real families.}",
          lead: "Watch the children do the thinking. Then hear from two of their parents.",
          id: "films-title",
        },
        films: HOME_FILM_ORDER.map(filmBy),
        labels: filmsStrip,
        proof: { text: "Kids doing the talking. Parents, in their own words.", size: "body-s" },
        posters: "lazy",
        quotes: filmQuotes,
        anchored: true,
      },
    },

    /* Fold 2, its foot · "Recognised by" as a small label under the quotes, on the films' band (ruling 1; CMO m10): the
       /team strip as built, names only. */
    { kind: "recognition-strip", config: { ...recognitionLabel, band: true } },

    /* Fold 3 · Why it matters (D016, D026: the one marked line and its source). No picture: Kabir is the hero. */
    {
      kind: "feature-split",
      config: {
        variant: "imagination",
        heading: { eyebrow: "Why it matters", title: "{mark:Conversation} helps a young brain grow.", id: "why-title", align: "center" },
        text: "Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young child and a caring adult help build and strengthen neural connections in the child’s brain.[^1]",
        card: {
          tone: "sun",
          tint: true,
          icon: "chat-circle-dots",
          title: "Where Kheelu comes in",
          body: "Kheelu is built around the same idea: it answers your child, then asks a question back. It doesn’t replace that time with you.",
        },
        sources: {
          label: "Sources",
          marker: "Source",
          items: [
            {
              citation: "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts).",
              href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
            },
          ],
        },
      },
      cta: centred("home-why"),
    },

    /* Fold 4 · Languages (D064 item 9; facts, Languages; D058 item 7 "at launch"; D017 switching). Film 6 plays in place,
       never a cast photo (ruling 1). No button. */
    {
      kind: "languages-section",
      config: {
        id: "languages",
        band: true,
        heading: {
          eyebrow: "Languages",
          title: `Kheelu speaks up to ${product.languageCeiling} {hand:languages} at launch.`,
          lead: `${count} today: ${LANGUAGE_NAMES}. In AI mode, it can switch between them mid-sentence: when your child changes language, Kheelu changes with them.`,
          id: "languages-title",
        },
        languages: LANGUAGE_CHIPS,
        film: {
          video: TWO_LANGUAGES.video,
          poster: TWO_LANGUAGES.poster,
          /* The poster's own still: the moments' .webp files are animated previews, never a poster (D049). */
          still: `/video/moments/${TWO_LANGUAGES.id}.jpg`,
          chip: `${TWO_LANGUAGES.chip} · ${TWO_LANGUAGES.duration}`,
          play: `${filmsStrip.play} ${TWO_LANGUAGES.chip}. ${TWO_LANGUAGES.caption}`,
          name: `${TWO_LANGUAGES.chip}. ${TWO_LANGUAGES.caption}`,
          caption: TWO_LANGUAGES.caption,
        },
      },
    },

    /* Fold 5 · Kheelu asks. Your child thinks. (D064 items 7 and 10; the plan's §1.6): six points, the pictures of
       points 3 and 4 swapped (CMO m3), point 6's age lines in what-ages' order (CMO m5); the labelled example under
       point 3 (AP-15); the line under the points; home-asks and the link to how it works. */
    {
      kind: "sticky-scroll",
      config: {
        id: "asks",
        heading: { eyebrow: "How it works", title: "Kheelu asks. {hand:Your child thinks.}", id: "asks-title" },
        points: [
          {
            title: "A soft plush rabbit. No screen.",
            body: "Kheelu is a cream plush rabbit with a speaker in its tummy. Your child talks and listens instead of watching.",
            picture: {
              image: { src: kheeluFront, alt: "Kheelu, the cream plush rabbit from Kheelona, with rainbow-lined ears and a speaker in its tummy." },
              fit: "contain",
            },
          },
          {
            title: "Press and ask.",
            body: "Your child presses the wake-up button and asks. A light shows Kheelu is listening.",
            picture: { image: { src: kheeluBelly, alt: "Kheelu’s tummy unit up close, with its speaker, light ring and buttons." }, fit: "contain" },
          },
          {
            title: "It answers, then asks one back.",
            body: "It answers the question first. Then it asks your child a question back, so they do the thinking.",
            picture: { image: { src: advikWhispering, alt: "A boy in a mustard shirt leaning close to whisper to Kheelu, on a cane chair by a tall window." } },
            example: {
              note: "Illustrative example, not a recording.",
              lines: [
                { who: "Your child", text: "“Why does the moon follow our car?”" },
                {
                  who: "Kheelu",
                  text: "“The moon is very, very far away. So when the trees zoom past, the moon seems to stay with you. What else looks like it follows you?”",
                },
                { who: "Your child", text: "“My shadow?”" },
              ],
            },
          },
          {
            title: "It can’t browse the internet.",
            body: "And when it doesn’t know something, it says so instead of guessing.",
            picture: { image: { src: iraDragon, alt: "A girl in a yellow printed frock drawing a dragon on a cotton dhurrie, with Kheelu beside her." } },
          },
          {
            title: "You read every conversation.",
            body: "Each one appears in the parent app, word for word, a few minutes after it ends. Kheelu remembers them too, so it can pick up where your child stopped.",
            picture: {
              image: {
                src: appTranscript,
                alt: "The parent app showing one conversation word for word: Kheelu greets Aarav, and when he asks for Hindi, Kheelu answers in Hindi.",
              },
              fit: "contain",
            },
          },
          {
            title: "From age 3. Still asking back at 7.",
            body: "Made for children aged 3 to 7. It is not a toy for children under 3. If your child is 3, keep a grown-up nearby. You set your child’s age in the parent app, and Kheelu’s AI is given child-safety rules for that age.",
            picture: { image: { src: taraEvening, alt: "A girl and her mother on a sofa in the evening lamp light, with Kheelu between them." } },
          },
        ],
        line: "Other AI gives answers. Kheelu asks questions.",
      },
      cta: centred("home-asks", { label: "See how it works", href: "/products/kheelu#modes", cta: "home-asks-learn", variant: "ghost", iconEnd: "arrow-right" }),
    },

    /* Fold 6 · The expert clip, moved here from the product page (D064 item 8; D061 items 12-13): its own fold, on the
       band between two plain folds; nothing in it names Kheelu. No button. */
    { kind: "films-strip", config: { ...expertFold, band: true } },

    /* Fold 7 · What you get, and what you pay: the offer card moved up (the plan's fold 7). The one perk list (CMO m8),
       the Kheelona+ note under it, the trust line and the card's third row under the button, the share link (D061 item 7,
       its approved text: the main session's ruling (b)); Myra's board, top-aligned with the card (D064 item 5). The same
       composition and the same two rows as the product page's offer since task Q2.15 (CON-3, QAL-2, CMO-2). */
    {
      kind: "offer-section",
      config: {
        variant: "home",
        /* The lead names its subject (task Q2.15; the CMO's built review, CMO-7; the founder signs, D015). */
        heading: { eyebrow: "Pre-order", title: "What you get, and {hand:what you pay.}", lead: "Kheelu is there every day at home, with no screen to switch off." },
        cta: "home-offer",
        cardLabel: "Kheelu offer",
        note: PLUS_NOTE,
        trust: COMPACT,
        third: trust(TRUST_OFFER_THIRD),
        art: {
          tone: "sun",
          label: "A curious girl in a mustard flowered frock beside Kheelu, the cream plush rabbit",
          layers: [
            { image: { src: flowerChilli, alt: "" }, left: 6, width: 30, top: 7 },
            { image: { src: myraSticker, alt: "" }, left: 44, width: 48, bottom: 0 },
            { image: { src: kheeluSticker, alt: "" }, left: 3, width: 42, bottom: 3, rotate: -5 },
            { doodle: { name: "ink-heart" }, left: 82, width: 12, top: 9, rotate: 14 },
          ],
        },
      },
    },

    /* Fold 8 · Safety you can check, compact (D064 item 2; Q2.2's four lines, claims-checked; D065 item 5's daily limit;
       G26's alt, D065 item 7): five lines beside the real privacy screen; safety, then the built link to /safety (CMO M3). */
    {
      kind: "feature-split",
      config: {
        variant: "app-screens",
        placement: "compact",
        id: "safety",
        band: true,
        heading: { eyebrow: "Safety", title: "Safety you can {hand:check.}", id: "safety-title" },
        items: [
          { icon: "microphone", body: "It listens only after someone presses the wake-up button." },
          { icon: "wifi-slash", body: "No web browsing." },
          { icon: "eye", body: "You read every conversation in the parent app." },
          { icon: "hand-heart", body: "We don’t sell your data." },
          { icon: "clock", body: "Each Kheelu has a daily limit on how long it talks." },
        ],
        screens: {
          images: [
            {
              src: appPrivacy,
              alt: `The parent app’s privacy centre: chats kept for ${RETENTION_MONTHS} months, a switch to save voice recordings, buttons to download your child’s data and to delete all chats, and links to the privacy policy, terms and the grievance officer.`,
            },
          ],
          caption: APP_CAPTION,
        },
      },
      /* Start-aligned, as its heading (task Q2.15; DS 10-pages.md:26 centres actions only under centred headings). */
      cta: { cta: "safety", trust: COMPACT, secondary: { ...cta.secondary["safety-learn"], variant: "secondary" } },
    },

    /* Fold 9 · A day with Kheelu (D065 item 5: the limit, never set by a parent; D044: talking time per day; D027: Story
       mode's words). No button. */
    {
      kind: "day-timeline",
      config: {
        id: "day",
        heading: {
          eyebrow: "Little moments",
          title: "A day with Kheelu, {hand:sunrise to bedtime.}",
          lead: "Not all day. A few moments, wherever the day goes.",
          id: "day-title",
        },
        moments: [
          { icon: "sun", tone: "sun", when: "Breakfast", line: "The first ‘why’ of the day. Kheelu answers, then asks one back.", mode: "AI mode · home Wi‑Fi" },
          {
            icon: "chat-circle-dots",
            tone: "blue",
            when: "After school",
            line: "Yesterday’s question, picked up where your child stopped: Kheelu remembers earlier conversations.",
            mode: "AI mode · home Wi‑Fi",
          },
          { icon: "question", tone: "chilli", when: "While you cook", line: "A question to think about, not a cartoon to watch.", mode: "AI mode · home Wi‑Fi" },
          { icon: "house", tone: "sun", when: "At Nani’s", line: "Stories, poems and jingles in Story mode, with no Wi‑Fi needed.", mode: "Story mode · no Wi‑Fi needed" },
          { icon: "moon", tone: "blue", when: "Bedtime", line: "One last story, lights low.", mode: "Story mode · no Wi‑Fi needed" },
        ],
        closing: "Each Kheelu has a daily limit on how long it talks. In the parent app, you can see how long your child talked each day.",
        screen: {
          image: {
            src: appActivity,
            alt: "The parent app’s activity screen for today: 22 minutes of talking, 3 chats and 9 questions asked, with today’s chats listed.",
          },
          caption: APP_CAPTION,
        },
      },
    },

    /* Fold 10 · Questions parents ask: the eight, decision questions first (the plan's fold 10; CMO m1, m2); the page's
       FAQPage. No "See all questions" (ruling 1). */
    {
      kind: "faq-section",
      config: {
        band: true,
        heading: { eyebrow: "Questions", title: "Questions parents {hand:ask.}", id: "faq-title" },
        items: pickFaqs(["what-is-kheelu", "not-right-for-us", "price-and-advance", "screen-time-in-disguise", "think-less", "what-ages", "when-arrive", "same-as-lumi"]),
      },
    },

    /* Fold 11 · Close: "It asks. They think." (messaging, EXTERNAL; D038), the product page's built lead, finale with the
       price line and the trust line; a board with no cast child (all five appear above), its heart drawing itself. */
    {
      kind: "close-section",
      config: {
        variant: "split",
        heading: {
          eyebrow: "Pre-order",
          title: "It asks. {hand:They think.}",
          lead: "For your own child, or as a gift for a 3 to 7 year old in the family.",
        },
        cta: { cta: "finale", trust: COMPACT },
        art: {
          tone: "blue",
          label: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy.",
          layers: [
            { image: { src: sunSun, alt: "" }, left: 8, width: 44, top: 8 },
            { image: { src: kheeluSticker, alt: "" }, left: 30, width: 50, bottom: 4, rotate: -4 },
            { doodle: { name: "ink-heart" }, left: 78, width: 13, top: 12, rotate: 12 },
          ],
        },
      },
    },
  ],
} satisfies PageContent;
