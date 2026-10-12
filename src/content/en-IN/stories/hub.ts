import type { TopicGuideCard, TopicGuideRow } from "@/components/sections/TopicSection/topic-section.types";
import type { Article, SitePath } from "@/content/types";
import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import type { SectionEntryOf } from "@/layouts/sections-registry";
import { DEFAULT_OG } from "../organization";
import { routes, type ArticleSlug } from "../routes";
import { trustItems } from "../trust";
import { articlePageCopy, articles } from "./articles";
import { topics, type TopicId } from "./topics";

/**
 * The stories hub, /stories (task 5.5; architecture §6.1; structure §5; mockup stories.html; stories.md): the page's
 * own words, and the guides as slug lists only. Which guide each topic features and which it lists is `hubTopics`, in
 * the approved order; every guide's title, summary, photo and read time are read from its own module (the article
 * registry, articles/index.ts), so rewriting an article never edits this file. Topics and their words are topics.ts;
 * the close is the journal close every article page shares (`articlePageCopy.close`), never retyped.
 */
export interface HubTopic {
  readonly topic: TopicId;
  /** The rewritten guide shown as a card with its photo; a topic with none leaves it out. */
  readonly featured?: ArticleSlug;
  /** The other guides, in the hub's order. */
  readonly slugs: readonly ArticleSlug[];
}

export const hubTopics: readonly HubTopic[] = [
  {
    topic: "screen-time",
    slugs: [
      "how-much-screen-time-for-a-3-to-6-year-old",
      "screen-time-rules-parents-swear-by",
      "screen-time-and-tantrums",
      "the-gentle-way-off-the-phone",
      "busy-hands-no-screens",
      "screen-free-does-not-mean-silent",
    ],
  },
  {
    topic: "talking",
    featured: "talking-toys-and-late-talkers",
    slugs: [
      "talking-late-or-talking-little",
      "how-to-get-your-child-talking",
      "how-children-learn-by-talking",
      "how-children-collect-words",
      "raising-a-bilingual-child-in-india",
      "a-toy-that-talks-vs-a-toy-that-listens",
    ],
  },
  {
    topic: "ai-and-safety",
    featured: "what-to-look-for-in-a-safe-ai-toy",
    slugs: [
      "questions-parents-ask-about-ai-toys",
      "should-kids-use-ai",
      "ai-toys-and-indias-data-law",
      "does-a-three-year-old-need-an-ai-tutor",
    ],
  },
  {
    topic: "learning",
    featured: "learning-toys-for-a-three-year-old",
    slugs: ["what-actually-builds-a-sharp-brain", "why-three-to-six-are-the-years-that-matter-most"],
  },
];

/* ── The page ────────────────────────────────────────────────────────────────────────────────────────────────────── */

/** A page of the URL plan (routes.ts) by its content module. */
function plannedPath(module: string): SitePath {
  const route = routes.find((r) => r.module === module);
  if (route === undefined) throw new Error(`routes.ts plans no page for src/content/en-IN/${module}.ts`);
  return route.path;
}

/** The hub's address: the URL plan's route whose content module is this one. */
export const hubPath: SitePath = plannedPath("stories/hub");

/** The hub's own words: stories.md "At a glance" (meta) and fold 1, and the card pattern of folds 2 to 5, as
 *  stories.html prints them. */
const words = {
  meta: {
    title: "Parenting guides for ages 3 to 7 · Kheelona",
    description:
      "Parenting guides for 3 to 7 year olds, in plain words: screen time, talking and language, learning toys, and AI toys and safety.",
    og: DEFAULT_OG,
  },
  heading: {
    eyebrow: "Parenting guides",
    title: "Guides for parents of {hand:3 to 7 year olds}",
    lead: "Plain-words parenting guides on screen time, talking, play and AI toys. Each one answers the question first, then shows its sources.",
    id: "stories-title",
  },
  written: "Written by the Kheelona team in Bengaluru.",
  /** The jump links' visible name; the links are the topics, by their own titles and anchors. */
  topics: { label: "Topics", id: "topics-label" },
  /** A featured guide's link ("Read the guide · 3 min read"); the read time is worded by the article pages. */
  readGuide: (readTime: string) => `Read the guide · ${readTime}`,
} as const;

/** The guide a topic features: its card words, head photo and read time from its own module, linked to its page. */
function featuredGuide(slug: ArticleSlug): TopicGuideCard {
  const { card, head }: Article = articles[slug];
  if (head.image === undefined || head.readMinutes === undefined) {
    throw new Error(`The hub features "${slug}" as a card with its head photo and read time, and its module has no ${head.image ? "read time" : "photo"}`);
  }
  return {
    title: card.title,
    summary: card.summary,
    href: plannedPath(`stories/articles/${slug}`),
    image: head.image,
    linkLabel: words.readGuide(articlePageCopy.byline.readTime(head.readMinutes)),
  };
}

/** Another guide of a topic: a row with its card words, linked to its page (every guide of the URL plan has one). */
function guideRow(slug: ArticleSlug): TopicGuideRow {
  const { card }: Article = articles[slug];
  return { title: card.title, summary: card.summary, href: plannedPath(`stories/articles/${slug}`) };
}

/** One topic band: the topic's anchor and words, its featured guide and its rows. The bands alternate from the
 *  hero's: the first topic on the page surface, the second on the band (stories.html folds 2-5). */
function topicFold(group: HubTopic, index: number): SectionEntryOf<"topic-section"> {
  const { id, title, lead } = topics.find((t) => t.id === group.topic)!;
  return {
    kind: "topic-section",
    config: {
      topic: { id, title, lead },
      band: index % 2 === 1,
      ...(group.featured !== undefined && { featured: featuredGuide(group.featured) }),
      items: group.slugs.map(guideRow),
    },
  };
}

const close = articlePageCopy.close;

/** The hub page (PageTemplate): the hero with the topic links, one band per topic, the journal close. */
export const hubPage = {
  meta: words.meta,
  sections: [
    {
      kind: "hero-section",
      config: {
        variant: "hub",
        heading: words.heading,
        written: words.written,
        topics: { ...words.topics, links: topics.map((t) => ({ label: t.title, href: `#${t.id}` })) },
      },
    },
    ...hubTopics.map(topicFold),
    {
      kind: "close-section",
      config: {
        variant: "journal",
        heading: close.heading,
        cta: { cta: close.cta, arrow: true, block: true, trust: close.trust.map((id) => trustItems[id]), helpLine: true, secondary: close.secondary },
        art: close.art,
      },
    },
  ],
} satisfies PageContent;
