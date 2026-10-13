/// <reference types="next/image-types/global" />
import kheeluFront from "@ds/assets/Kheelu/kheelu-front.webp";
import flowerChilli from "@ds/assets/Shapes/flower-chilli.svg";
import type { Article, ArtBoardRef, Copy, IconRef, SitePath } from "@/content/types";
import type { CtaId } from "@/lib/tracking/cta";
import { navigation } from "../../navigation";
import type { ArticleSlug } from "../../routes";
import { TRUST_COMPACT, type TrustId } from "../../trust";
import { article as aToyThatTalksVsAToyThatListens } from "./a-toy-that-talks-vs-a-toy-that-listens";
import { article as aiToysAndIndiasDataLaw } from "./ai-toys-and-indias-data-law";
import { article as busyHandsNoScreens } from "./busy-hands-no-screens";
import { article as doesAThreeYearOldNeedAnAiTutor } from "./does-a-three-year-old-need-an-ai-tutor";
import { article as howChildrenCollectWords } from "./how-children-collect-words";
import { article as howChildrenLearnByTalking } from "./how-children-learn-by-talking";
import { article as howMuchScreenTimeForA3To6YearOld } from "./how-much-screen-time-for-a-3-to-6-year-old";
import { article as howToGetYourChildTalking } from "./how-to-get-your-child-talking";
import { article as learningToysForAThreeYearOld } from "./learning-toys-for-a-three-year-old";
import { article as questionsParentsAskAboutAiToys } from "./questions-parents-ask-about-ai-toys";
import { article as raisingABilingualChildInIndia } from "./raising-a-bilingual-child-in-india";
import { article as screenFreeDoesNotMeanSilent } from "./screen-free-does-not-mean-silent";
import { article as screenTimeAndTantrums } from "./screen-time-and-tantrums";
import { article as screenTimeRulesParentsSwearBy } from "./screen-time-rules-parents-swear-by";
import { article as shouldKidsUseAi } from "./should-kids-use-ai";
import { article as talkingLateOrTalkingLittle } from "./talking-late-or-talking-little";
import { article as talkingToysAndLateTalkers } from "./talking-toys-and-late-talkers";
import { article as theGentleWayOffThePhone } from "./the-gentle-way-off-the-phone";
import { article as whatActuallyBuildsASharpBrain } from "./what-actually-builds-a-sharp-brain";
import { article as whatToLookForInASafeAiToy } from "./what-to-look-for-in-a-safe-ai-toy";
import { article as whyThreeToSixAreTheYearsThatMatterMost } from "./why-three-to-six-are-the-years-that-matter-most";

/**
 * The article registry (architecture §5.4, §6.1; wave-3 close ruling, task 4.2): the one list of the article modules.
 * The stories route (src/app/(site)/stories/[slug]) renders each entry through the article template, and the site
 * shell's sticky-bar paths read each entry's close, so a new article is its module, one line here and its slug in
 * routes.ts (plus its hub topic), never a shell edit. The `satisfies` refuses to compile until every slug of the URL
 * plan has its module here, and nothing else.
 */
export const articles = {
  "learning-toys-for-a-three-year-old": learningToysForAThreeYearOld,
  "what-to-look-for-in-a-safe-ai-toy": whatToLookForInASafeAiToy,
  "talking-toys-and-late-talkers": talkingToysAndLateTalkers,
  "how-much-screen-time-for-a-3-to-6-year-old": howMuchScreenTimeForA3To6YearOld,
  "screen-time-rules-parents-swear-by": screenTimeRulesParentsSwearBy,
  "screen-time-and-tantrums": screenTimeAndTantrums,
  "the-gentle-way-off-the-phone": theGentleWayOffThePhone,
  "busy-hands-no-screens": busyHandsNoScreens,
  "screen-free-does-not-mean-silent": screenFreeDoesNotMeanSilent,
  "talking-late-or-talking-little": talkingLateOrTalkingLittle,
  "how-to-get-your-child-talking": howToGetYourChildTalking,
  "how-children-learn-by-talking": howChildrenLearnByTalking,
  "how-children-collect-words": howChildrenCollectWords,
  "raising-a-bilingual-child-in-india": raisingABilingualChildInIndia,
  "a-toy-that-talks-vs-a-toy-that-listens": aToyThatTalksVsAToyThatListens,
  "questions-parents-ask-about-ai-toys": questionsParentsAskAboutAiToys,
  "should-kids-use-ai": shouldKidsUseAi,
  "ai-toys-and-indias-data-law": aiToysAndIndiasDataLaw,
  "does-a-three-year-old-need-an-ai-tutor": doesAThreeYearOldNeedAnAiTutor,
  "what-actually-builds-a-sharp-brain": whatActuallyBuildsASharpBrain,
  "why-three-to-six-are-the-years-that-matter-most": whyThreeToSixAreTheYearsThatMatterMost,
} as const satisfies Readonly<Record<ArticleSlug, Article>>;

/** The article for a URL slug, or undefined for anything not in the registry. */
export function getArticle(slug: string): Article | undefined {
  return Object.hasOwn(articles, slug) ? articles[slug as ArticleSlug] : undefined;
}

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
