import advikSticker from "@ds/assets/Cast/advik-sticker.png";
import myraSticker from "@ds/assets/Cast/myra-sticker.png";
import kheeluSticker from "@ds/assets/Kheelu/kheelu-front-sticker.png";
import iraStory from "@ds/assets/Photo library/ira-01-story-on-the-bed-web.webp";
import kabirImagining from "@ds/assets/Photo library/kabir-01-imagining-space-web.webp";
import flowerChilli from "@ds/assets/Shapes/flower-chilli.svg";
import sunSun from "@ds/assets/Shapes/sun-sun.svg";
import appActivity from "@/assets/app/app-activity.webp";
import appPrivacy from "@/assets/app/app-privacy.webp";
import appTranscript from "@/assets/app/app-transcript.webp";
import type { CtaBlockConfig } from "@/components/sections/CtaBlock/cta-block.types";
import type { IconName } from "@/components/ui/Icon/Icon";
import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import { cta } from "../cta";
import { pickFaqs } from "../faqs";
import { films, filmsStrip } from "../films";
import { DEFAULT_OG } from "../organization";
import { RETENTION_LINE } from "../policies";
import { product } from "../products/kheelu/product";
import { topics, type TopicId } from "../stories/topics";
import { SAFETY_FACTS, TRUST_COMPACT, TRUST_FULL, trustItems, type TrustId } from "../trust";

/**
 * Home, `/` (task 5.1; structure §5): the approved page's ten folds (mockup/pages/home.html, Gate A approved D046,
 * the hero D045), rendered by PageTemplate from `src/app/(site)/page.tsx`. Visible words are the mockup's; the meta,
 * the full-mode words and the three untracked links' targets are the copy page's (wiki/site/pages/home.md;
 * architecture §6.3). Shared facts come from their one module: the films, the FAQ answers, the trust items and the
 * safety facts line, the CTA links, the retention line, the modes and languages, the stories topics.
 *
 * Motion (D049): the hero board's doodle stays still (pick 2: a hero never draws); the imagination frame's doodles and
 * the close board's heart draw themselves below the first screen (pick 3). The hero board's largest sticker is the
 * page's one LCP image (HeroSection). FAQPage = fold 4's answer-first block (`faq: true`) and the six answers of fold 8
 * (wave-4 close; home.md fold 8).
 */

const trust = (ids: readonly TrustId[]) => ids.map((id) => trustItems[id]);
const COMPACT = trust(TRUST_COMPACT);

/** The caption under the parent app's real screens (folds 5 and 6). */
const APP_CAPTION = "The Kheelona app is live on Apple’s App Store and the Google Play Store.";

/** A stories topic by its anchor id: the guides cards print its title and lead, and link to its place on the hub. */
const topic = (id: TopicId) => topics.find((t) => t.id === id)!;

/** The three modes as the product facts name them (the cards' words are the page's). */
const [aiMode, storyMode, bluetoothMode] = product.modes;

/** The language chips: each language in its own script with its English name; English, the page's own, alone. */
const LANGUAGE_CHIPS = product.languages.map(({ name, native, lang }) => (native === name ? { native } : { native, english: name, lang }));

/** The checkable facts line under the safety fold, shared with the product page and llms.txt (trust.ts). Every icon is
 *  a DS icon (trust.test.ts), which the line's DS icon name requires. */
const SAFETY_FACTS_LINE = SAFETY_FACTS.map(({ icon, text }) => ({ icon: icon as IconName, text }));

const heroCta: CtaBlockConfig = {
  cta: "hero",
  id: "hero-cta",
  priceId: "hero-price",
  arrow: true,
  block: true,
  layout: "stack",
  trust: COMPACT,
  helpLine: true,
  secondary: { ...cta.secondary["hero-learn"], variant: "ghost" },
};

export const homePage = {
  meta: {
    title: "Kheelu by Kheelona: a screen-free plush toy that talks",
    description: {
      token:
        "Kheelu by Kheelona: a screen-free plush toy, ages 3 to 7, that answers your child, then asks back. {price:headline} (incl. GST); reserve with a refundable {price:token}.",
      full: "Kheelu by Kheelona: a screen-free plush toy, ages 3 to 7, that answers your child, then asks back. {price:full} (incl. GST), delivered anywhere in India.",
    },
    // home.md "At a glance": the Kheelu card (kheelu-on-fur.jpg, public/og/kheelu.jpg), alt as the hero product alt.
    og: { image: "/og/kheelu.jpg", alt: DEFAULT_OG.alt },
  },
  sections: [
    /* Fold 1 · Hero (D045). */
    {
      kind: "hero-section",
      config: {
        variant: "art",
        heading: {
          eyebrow: "Ages 3 to 7",
          title: "Kheelu answers every why. Then it {hand:asks one back.}",
          lead: "A screen-free plush toy by Kheelona. It answers your child first, then asks a question back, so they do the thinking.",
          id: "hero-title",
        },
        art: {
          tone: "blue",
          label: "Kheelu by Kheelona, the cream plush rabbit with rainbow ears, beside a smiling boy",
          layers: [
            { image: { src: sunSun, alt: "" }, left: 6, width: 30, top: 8 },
            { image: { src: advikSticker, alt: "" }, left: 38, width: 54, bottom: 0 },
            { image: { src: kheeluSticker, alt: "" }, left: 2, width: 44, bottom: 2, rotate: -6 },
            { doodle: { name: "chalk-question-mark" }, left: 43, width: 13, top: 2, rotate: 10 },
          ],
          sticker: { tone: "sun", variant: "round", tilt: 8, lead: "It asks.", lines: ["They think."] },
        },
        /* D061 item 1 (task 8c.1): the same board on a phone, on a 4:3 board under the trust line (HeroSection), so
           Kheelu is wholly on the first screen at 390 x 844 and 412 x 915; the same files in the DS order (10-pages.md,
           the scrapbook board): the word sticker in the top left corner (HeroSection), the shape in the top right one,
           the boy bottom-aligned, Kheelu tilted beside him, clear of his face and raised so it ends inside 844 px, and
           the question mark between their heads. The boy ends at 82 % of the board, so the right-hand column, which the
           WhatsApp bubble covers wherever a phone's screen ends, holds only the shape and the blue. */
        phoneLayers: [
          { image: { src: sunSun, alt: "" }, right: 3, width: 18, top: 5 },
          { image: { src: advikSticker, alt: "" }, left: 52, width: 30, bottom: 0 },
          { image: { src: kheeluSticker, alt: "" }, left: 32, width: 27, bottom: 16, rotate: -6 },
          { doodle: { name: "chalk-question-mark" }, left: 45, width: 8, top: 22, rotate: 10 },
        ],
      },
      cta: heroCta,
    },

    /* Fold 2 · See it ask: the seven parent films (D040). */
    {
      kind: "films-strip",
      config: {
        heading: {
          eyebrow: "See it ask",
          title: "Kheelu asks. Watch them {hand:think.}",
          lead: "Real children, real families. Press play on any of them.",
          id: "ask-title",
        },
        films,
        labels: filmsStrip,
        proof: { text: "Kids doing the talking. Parents, in their own words.", size: "body-s" },
        posters: "eager-low",
      },
      cta: { cta: "see-it-ask", align: "center", trust: COMPACT, secondary: { ...cta.secondary["see-it-ask-learn"], variant: "ghost" } },
    },

    /* Fold 3 · Why conversation matters (D016, D026: the one marked line and its source). */
    {
      kind: "feature-split",
      config: {
        variant: "imagination",
        heading: { eyebrow: "Why it matters", title: "{mark:Conversation} helps a young brain grow.", id: "why-title", align: "center" },
        text: "Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young child and a caring adult help build and strengthen neural connections in the child’s brain. They also support the early language and social skills that later, more complex thinking builds on.[^1]",
        card: {
          tone: "sun",
          tint: true,
          icon: "chat-circle-dots",
          title: "Where Kheelu comes in",
          body: "Kheelu is built around the same idea: it answers your child, then asks a question back.",
        },
        aside: "You can do it anywhere, too: answer your child, then ask one back.",
        frame: {
          photo: {
            src: kabirImagining,
            alt: "A boy in glasses and a rust T-shirt holding Kheelu against a dark wall, looking up at a chalk planet, stars and a thought cloud drawn around his question.",
          },
          zoom: true,
          question: "why does the moon follow our car?",
          doodles: [
            { doodle: { name: "chalk-planet" }, left: 4, top: 30, width: 20, rotate: -10 },
            { doodle: { name: "chalk-star" }, left: 16, top: 22, width: 8, rotate: -18 },
            { doodle: { name: "chalk-star" }, left: 86, top: 48, width: 7, rotate: 12 },
            { doodle: { name: "chalk-thought-cloud" }, left: 72, top: 22, width: 20 },
          ],
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
        link: { label: "Read more: how children learn by talking", href: "/stories/how-children-learn-by-talking" },
      },
    },

    /* Fold 4 · What is Kheelu? Its heading and lead are an answer-first block of the page's FAQPage. */
    {
      kind: "modes-section",
      faq: true,
      config: {
        variant: "home",
        heading: {
          eyebrow: "Modes and languages",
          title: "What is {hand:Kheelu?}",
          lead: "Kheelu by Kheelona is a screen-free plush rabbit that talks with children aged 3 to 7. It answers your child, then asks a question back. It has three modes: AI mode for open conversation on home Wi‑Fi, Story mode for stories, poems and jingles with no Wi‑Fi needed, and Bluetooth mode, which makes it a speaker for your phone.",
          id: "what-title",
        },
        photo: {
          image: {
            src: iraStory,
            alt: "A laughing girl in a peach kurta sitting cross-legged on a block-print bedsheet, telling Kheelu a story with both hands.",
          },
        },
        modes: [
          { tone: "blue", icon: aiMode.icon, title: aiMode.name, body: "Open conversation, on your home Wi‑Fi. It can’t browse the internet." },
          {
            tone: "sun",
            tint: true,
            icon: storyMode.icon,
            title: storyMode.name,
            body: "Stories, poems and jingles your child enjoys and learns from. No Wi‑Fi needed.",
          },
          { tone: "chilli", icon: bluetoothMode.icon, title: bluetoothMode.name, body: "Pair your phone and use it as a speaker." },
        ],
        languages: {
          title: `Up to ${product.languageCeiling} languages at launch`,
          items: LANGUAGE_CHIPS,
          note: "It can switch between them mid-sentence.",
        },
        link: { label: "See what each mode does", href: "/products/kheelu#modes" },
      },
    },

    /* Fold 5 · What parents see: the parent app beside two real screens (D044, D046). The bullets follow the live team's
       code check (D058 items 1 and 8; home.md fold 5): no weekly report or new-word count until they ship. */
    {
      kind: "feature-split",
      config: {
        variant: "app-screens",
        placement: "home",
        id: "app",
        heading: { eyebrow: "The parent app", title: "You see {hand:every conversation.}", id: "see-title" },
        items: [
          { icon: "eye", body: "Read every conversation in the parent app, word for word." },
          {
            icon: "chart-line-up",
            body: "Each conversation appears a few minutes after it ends. Search them, read a daily summary, or look back over the week or the month.",
          },
          {
            icon: "sliders-horizontal",
            body: "You set your child’s age in the app. The AI model that answers your child gets child-safety rules for that age, with Google’s safety filters on top.",
          },
          { icon: "trash", body: RETENTION_LINE },
        ],
        screens: {
          images: [
            {
              src: appTranscript,
              alt: "The parent app showing one conversation word for word: Kheelu greets Aarav, and when he asks for Hindi, Kheelu answers in Hindi.",
            },
            {
              src: appActivity,
              alt: "The parent app's activity screen for today: 22 minutes of talking, 3 chats and 9 questions asked, with today's chats listed.",
            },
          ],
          caption: APP_CAPTION,
        },
        link: { label: "See what the app shows you", href: "/products/kheelu#app", icon: "eye" },
      },
    },

    /* Fold 6 · Safety you can check (D020 order), in the live team's code-checked words (D058 items 1 and 6; home.md
       fold 6): a couple of minutes of quiet, no place on the providers line, what removing a chat and deleting the
       account do. */
    {
      kind: "trust-section",
      config: {
        variant: "safety",
        placement: "home",
        band: true,
        heading: { eyebrow: "Safety", title: "Safety you can {hand:check.}", id: "safety-title" },
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
            body: "In the parent app. Removing a chat there hides it on that phone. Deleting your account deletes your child’s profile, conversations and recordings from our servers.",
          },
          { icon: "hand-heart", title: "We don’t sell your data.", body: "Your child’s data is never used to advertise to them." },
        ],
        screens: {
          images: [
            {
              src: appPrivacy,
              /* Without "delete all chats": the button hides chats on that phone (D058 item 1; home.md fold 6). */
              alt: "The parent app's privacy centre: keep chats for 36 months, a switch to save voice recordings, download your child's data, and links to the privacy policy, terms and the grievance officer.",
            },
          ],
          caption: APP_CAPTION,
        },
        facts: SAFETY_FACTS_LINE,
      },
      cta: { cta: "safety", align: "center", trust: COMPACT, secondary: { ...cta.secondary["safety-learn"], variant: "secondary" } },
    },

    /* Fold 7 · Compared by category: kinds of products, never brands (B14). */
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
        link: cta.secondary["compare-learn"],
      },
    },

    /* Fold 7b · Guides for parents (D046): three stories topics, each linked to its place on the hub. */
    {
      kind: "card-grid",
      config: {
        variant: "guides",
        band: true,
        heading: {
          eyebrow: "Guides for parents",
          title: "How we can {nowrap:{hand:help},} from 3 to 7.",
          lead: "Short, sourced guides from the Kheelona team, for the questions every parent of a young child asks.",
          id: "guides-title",
          align: "center",
        },
        items: (
          [
            ["screen-time", "blue", "clock", "Read the screen-time guides"],
            ["talking", "sun", "translate", "Read the talking guides"],
            ["learning", "chilli", "puzzle-piece", "Read the learning guides"],
          ] as const
        ).map(([id, tone, icon, label]) => ({
          tone,
          icon,
          title: topic(id).title,
          body: topic(id).lead,
          links: [{ label, href: `/stories#${id}` }],
        })),
      },
    },

    /* Fold 8 · Questions parents ask: six answers from faqs.ts, the page's FAQPage. */
    {
      kind: "faq-section",
      config: {
        heading: { eyebrow: "Questions", title: "Questions parents {hand:ask.}", id: "faq-title" },
        items: pickFaqs(["think-less", "what-ages", "price-and-advance", "not-right-for-us", "when-arrive", "same-as-lumi"]),
        more: cta.secondary["faq-more"],
      },
    },

    /* Fold 9 · Close: the offer card, the Kheelona+ line (D041 F7), the full trust row, Myra's board. */
    {
      kind: "offer-section",
      config: {
        variant: "close",
        heading: { eyebrow: "Pre-order", title: "What you get, and {hand:what you pay.}" },
        cta: "finale",
        cardLabel: "Kheelu offer",
        trust: trust(TRUST_FULL),
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
  ],
} satisfies PageContent;
