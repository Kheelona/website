/// <reference types="next/image-types/global" />
import kheeluFront from "@ds/assets/Kheelu/kheelu-front.webp";
import flowerChilli from "@ds/assets/Shapes/flower-chilli.svg";
import type { ArtBoardRef, Copy, IconRef, SitePath } from "@/content/types";
import type { CtaId } from "@/lib/tracking/cta";
import { navigation } from "../../navigation";
import type { ArticleSlug } from "../../routes";
import { TRUST_COMPACT, type TrustId } from "../../trust";

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
    readonly heading: { readonly title: Copy; readonly lead: Copy };
    readonly cta: CtaId;
    readonly trust: readonly TrustId[];
    /** The ghost link under the help line; a close's "See how it works" carries no tracking value. */
    readonly secondary: { readonly label: string; readonly href: SitePath; readonly variant: "ghost"; readonly iconEnd: IconRef };
    readonly art: ArtBoardRef;
  };
}

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
     price sentence, which the offer words. */
  close: {
    heading: {
      title: "A toy that {hand:asks back.}",
      lead: "Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It answers your child, then asks a question back.",
    },
    cta: "finale",
    trust: TRUST_COMPACT,
    secondary: { label: "See how it works", href: "/products/kheelu", variant: "ghost", iconEnd: "arrow-right" },
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
