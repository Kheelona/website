/// <reference types="next/image-types/global" />
import kheeluFront from "@ds/assets/Kheelu/kheelu-front.webp";
import flowerChilli from "@ds/assets/Shapes/flower-chilli.svg";
import type { ArtBoardRef, Copy, IconRef, SitePath } from "@/content/types";
import type { CtaId } from "@/lib/tracking/cta";
import { navigation } from "../../navigation";
import type { ArticleSlug } from "../../routes";
import { TRUST_COMPACT, type TrustId } from "../../trust";
import type { TopicId } from "../topics";

/**
 * The article registry (architecture §5.4, §6.1; wave-3 close ruling, task 4.2; ADR-014, task 8b.2e): the journal's
 * articles, read from the committed snapshot of the admin dashboard's published posts and adapted by journal.ts. The
 * stories route (src/app/(site)/stories/[slug]) renders each entry through the article template, the hub lists each
 * under its topic, and the site shell's sticky-bar paths read each entry's close, so a new article is a published post,
 * never a code edit. Re-exported here, beside the words and the close every article page shares.
 */
export { articles, getArticle } from "../journal";

/** The words and the close every article page shares, as the approved article mockups print them. */
export interface ArticlePageCopy {
  readonly crumbs: {
    /** The trail's accessible name. */
    readonly label: string;
    /** The first crumb: the hub, as the nav names and links it. The second is the article's topic (topics.ts). */
    readonly hub: { readonly name: string; readonly path: SitePath };
  };
  readonly byline: {
    /** Before the first-published date. */
    readonly published: string;
    /** The read time, from the article's own minutes; left out while an article has none. */
    readonly readTime: (minutes: number) => string;
  };
  readonly sources: {
    /** The notes' subtitle at the foot of the reading column. */
    readonly title: string;
    /** The word before a marker's number, which names it ("Source 1"). */
    readonly marker: string;
  };
  /** The band of related guides above the journal close. */
  readonly related: { readonly title: string };
  /** The word before a video's own title on its play button ("Play video: <title>"), for a journal post that embeds a
   *  video (D057 item 1; journal-pipeline §7). */
  readonly videoLabel: string;
  /** The keep-reading close of an article with no pre-order button (B5): its heading and the link to the hub. */
  readonly keep: { readonly title: string; readonly action: { readonly label: string; readonly href: SitePath } };
  /** The journal close (identical to the hub's, stories.md fold 6): the pre-order button with the price beside it. */
  readonly close: {
    /** The hub's heading, and every guide's whose topic has none of its own below. Each heading carries the eyebrow every
     *  selling close carries, "Pre-order" (task Q2.15; the consistency review's CON-6). */
    readonly heading: JournalCloseHeading;
    /** The heading by the article's topic (the D2C plan v2 §7; task Q2.12): a topic named here closes in its own words,
     *  any other in `heading`. A talking guide has no such close (B5). */
    readonly topicHeadings: Readonly<Partial<Record<TopicId, JournalCloseHeading>>>;
    readonly cta: CtaId;
    readonly trust: readonly TrustId[];
    /** The ghost link under the help line, worded as /team's and /contact's (task Q2.15, CON-7); it carries no tracking
     *  value. */
    readonly secondary: { readonly label: string; readonly href: SitePath; readonly variant: "ghost"; readonly iconEnd: IconRef };
    readonly art: ArtBoardRef;
  };
}

/** A journal close's heading: the eyebrow, the title with its one accent, the lead. */
interface JournalCloseHeading {
  readonly eyebrow: Copy;
  readonly title: Copy;
  readonly lead: Copy;
}

/** The eyebrow over every selling close (Home, the product page, /safety, /setup, the guide; task Q2.15, CON-6). */
const CLOSE_EYEBROW = "Pre-order";

const HUB_PATH: SitePath = "/stories";
const hubLink = navigation.main.find((link) => link.href === HUB_PATH);
if (hubLink === undefined) throw new Error(`navigation.ts links no ${HUB_PATH}: the article crumbs lead with the hub`);

export const articlePageCopy = {
  /* story-*.html fold 1: `nav.mk-crumbs[aria-label="Breadcrumb"]`, "Stories" then the topic. */
  crumbs: { label: "Breadcrumb", hub: { name: hubLink.label, path: hubLink.href } },
  /* story-*.html fold 1 byline: "<author> · First published <date> · <n> min read". */
  byline: { published: "First published", readTime: (minutes) => `${minutes} min read` },
  /* story-*.html, the sources fold: `h2#sources-title` "Sources"; each marker `aria-label="Source <n>"`. */
  sources: { title: "Sources", marker: "Source" },
  /* story-learning-toys-for-a-three-year-old.html fold 14, story-what-to-look-for-in-a-safe-ai-toy.html fold 7. */
  related: { title: "Related guides" },
  /* No approved mockup shows a video: journal-pipeline §7 words the button, and stories.md records it ("Changes after
     approval (task 8b.2d)"). */
  videoLabel: "Play video:",
  /* story-talking-toys-and-late-talkers.html fold 9 (story-talking-toys-and-late-talkers.md fold 9). */
  keep: { title: "Keep reading", action: { label: "All guides for parents of 3 to 7 year olds", href: HUB_PATH } },
  /* The journal close block, identical to the hub's (stories.md fold 6; story-*.html close). Full mode changes only the
     price sentence, which the offer words. Since task Q2.15 (the consistency review's CON-6, CON-7) each heading carries
     the "Pre-order" eyebrow every selling close carries, and the ghost link reads as /team's and /contact's. */
  close: {
    heading: {
      eyebrow: CLOSE_EYEBROW,
      title: "A toy that {hand:asks back.}",
      lead: "Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It answers your child, then asks a question back.",
    },
    /* The selling update's close by topic (the D2C plan v2 §7, the CMO's review of v2; task Q2.12). The learning guides
       keep the shared heading: they cite adult-child talk research, and a close about more back-and-forth would make
       Kheelu the caring adult (source verification C08; the CMO's F1). The talking guides keep their keep-reading close
       (D054 item 16). Claims §1 (no camera, no browsing, every conversation), D017, D065 item 5 (the daily limit, never
       one a parent sets). */
    topicHeadings: {
      "screen-time": {
        eyebrow: CLOSE_EYEBROW,
        title: "A toy that talks, {hand:with no screen.}",
        lead: "Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It answers your child, then asks a question back, and each Kheelu has a daily limit on how long it talks.",
      },
      "ai-and-safety": {
        eyebrow: CLOSE_EYEBROW,
        title: "A toy you can {hand:check.}",
        lead: "Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It has no camera and can’t browse the internet, and you can read every conversation in the parent app.",
      },
    },
    cta: "finale",
    trust: TRUST_COMPACT,
    secondary: { label: "See how Kheelu works", href: "/products/kheelu", variant: "ghost", iconEnd: "arrow-right" },
    art: {
      tone: "sun",
      label: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy.",
      layers: [
        { image: { src: flowerChilli, alt: "" }, left: 7, width: 24, top: 9 },
        { image: { src: kheeluFront, alt: "" }, left: 29, width: 42, bottom: 3, rotate: -5 },
        { doodle: { name: "ink-heart" }, left: 72, width: 12, top: 12, rotate: 14 },
      ],
    },
  },
} as const satisfies ArticlePageCopy;

/**
 * Articles whose close art stays plain, without the doodle: the safety and data guides (DS 02-imagery, "Where not to
 * use it: safety"; story-what-to-look-for-in-a-safe-ai-toy.html: "No imagination layer and no doodle: a safety page";
 * the copy pages of the hard-questions, should-kids and data-law guides ask the same, task 5.19).
 */
export const PLAIN_CLOSE_ART: readonly ArticleSlug[] = [
  "what-to-look-for-in-a-safe-ai-toy",
  "questions-parents-ask-about-ai-toys",
  "should-kids-use-ai",
  "ai-toys-and-indias-data-law",
];
