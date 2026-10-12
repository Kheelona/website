import { ARTICLE_SLUGS, type ArticleSlug } from "@/content/en-IN/routes";
import { article as learningToysForAThreeYearOld } from "@/content/en-IN/stories/articles/learning-toys-for-a-three-year-old";
import { article as whatToLookForInASafeAiToy } from "@/content/en-IN/stories/articles/what-to-look-for-in-a-safe-ai-toy";
import { article as talkingToysAndLateTalkers } from "@/content/en-IN/stories/articles/talking-toys-and-late-talkers";
import { article as howMuchScreenTimeForA3To6YearOld } from "@/content/en-IN/stories/articles/how-much-screen-time-for-a-3-to-6-year-old";
import { article as screenTimeRulesParentsSwearBy } from "@/content/en-IN/stories/articles/screen-time-rules-parents-swear-by";
import { article as screenTimeAndTantrums } from "@/content/en-IN/stories/articles/screen-time-and-tantrums";
import { article as theGentleWayOffThePhone } from "@/content/en-IN/stories/articles/the-gentle-way-off-the-phone";
import { article as busyHandsNoScreens } from "@/content/en-IN/stories/articles/busy-hands-no-screens";
import { article as screenFreeDoesNotMeanSilent } from "@/content/en-IN/stories/articles/screen-free-does-not-mean-silent";
import { article as talkingLateOrTalkingLittle } from "@/content/en-IN/stories/articles/talking-late-or-talking-little";
import { article as howToGetYourChildTalking } from "@/content/en-IN/stories/articles/how-to-get-your-child-talking";
import { article as howChildrenLearnByTalking } from "@/content/en-IN/stories/articles/how-children-learn-by-talking";
import { article as howChildrenCollectWords } from "@/content/en-IN/stories/articles/how-children-collect-words";
import { article as raisingABilingualChildInIndia } from "@/content/en-IN/stories/articles/raising-a-bilingual-child-in-india";
import { article as aToyThatTalksVsAToyThatListens } from "@/content/en-IN/stories/articles/a-toy-that-talks-vs-a-toy-that-listens";
import { article as questionsParentsAskAboutAiToys } from "@/content/en-IN/stories/articles/questions-parents-ask-about-ai-toys";
import { article as shouldKidsUseAi } from "@/content/en-IN/stories/articles/should-kids-use-ai";
import { article as aiToysAndIndiasDataLaw } from "@/content/en-IN/stories/articles/ai-toys-and-indias-data-law";
import { article as doesAThreeYearOldNeedAnAiTutor } from "@/content/en-IN/stories/articles/does-a-three-year-old-need-an-ai-tutor";
import { article as whatActuallyBuildsASharpBrain } from "@/content/en-IN/stories/articles/what-actually-builds-a-sharp-brain";
import { article as whyThreeToSixAreTheYearsThatMatterMost } from "@/content/en-IN/stories/articles/why-three-to-six-are-the-years-that-matter-most";
import type { Article, SitePath } from "@/content/types";
import { CTAS, type CtaPlacement } from "@/lib/tracking/cta";

/**
 * Where the phone buy bar shows (structure §5, "Sticky bar" column). The site shell is a layout and cannot know its page,
 * so it hands the bar the list of paths it belongs on and the bar reads its own path (StickyBuyBar.client.tsx).
 *
 * The list is the CTA registry's placements for `sticky-bar` (src/lib/tracking/cta.ts, architecture §8.3; checked
 * against the approved mockups by test/guards/tracking-registry.test.ts), so the bar appears exactly where its tracking
 * value is registered, with the "articles-with-close" group resolved from each article's own `close`: an article whose
 * close carries the pre-order button carries the bar too; the keep-reading close (B5) carries neither. A new article is
 * its module and its slug in routes.ts; the `satisfies` below then refuses to compile until it is listed here.
 */

const ARTICLES = {
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
} satisfies Record<ArticleSlug, Article>;

/** Each article's close, by slug: "journal" carries the pre-order button, "keep" does not (B5). */
export const ARTICLE_CLOSES: Readonly<Record<ArticleSlug, Article["close"]>> = Object.fromEntries(
  ARTICLE_SLUGS.map((slug) => [slug, ARTICLES[slug].close]),
) as Record<ArticleSlug, Article["close"]>;

/** The paths that carry the bar: the registry's placements in its order, then the articles with a pre-order close. */
export function stickyBarPaths(placements: readonly CtaPlacement[] = CTAS["sticky-bar"].pages): SitePath[] {
  const paths: SitePath[] = [];
  for (const placement of placements) {
    if (placement.startsWith("/")) paths.push(placement as SitePath);
    else if (placement === "articles-with-close") {
      for (const slug of ARTICLE_SLUGS) if (ARTICLE_CLOSES[slug] === "journal") paths.push(`/stories/${slug}`);
    } else {
      throw new Error(`stickyBarPaths cannot place the sticky bar on "${placement}" (src/lib/tracking/cta.ts)`);
    }
  }
  return [...new Set(paths)];
}
