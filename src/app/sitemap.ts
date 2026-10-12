import type { MetadataRoute } from "next";
import { routes, type ArticleSlug, type RouteEntry } from "@/content/en-IN/routes";
import * as learningToysForAThreeYearOld from "@/content/en-IN/stories/articles/learning-toys-for-a-three-year-old";
import * as whatToLookForInASafeAiToy from "@/content/en-IN/stories/articles/what-to-look-for-in-a-safe-ai-toy";
import * as talkingToysAndLateTalkers from "@/content/en-IN/stories/articles/talking-toys-and-late-talkers";
import * as howMuchScreenTimeForA3To6YearOld from "@/content/en-IN/stories/articles/how-much-screen-time-for-a-3-to-6-year-old";
import * as screenTimeRulesParentsSwearBy from "@/content/en-IN/stories/articles/screen-time-rules-parents-swear-by";
import * as screenTimeAndTantrums from "@/content/en-IN/stories/articles/screen-time-and-tantrums";
import * as theGentleWayOffThePhone from "@/content/en-IN/stories/articles/the-gentle-way-off-the-phone";
import * as busyHandsNoScreens from "@/content/en-IN/stories/articles/busy-hands-no-screens";
import * as screenFreeDoesNotMeanSilent from "@/content/en-IN/stories/articles/screen-free-does-not-mean-silent";
import * as talkingLateOrTalkingLittle from "@/content/en-IN/stories/articles/talking-late-or-talking-little";
import * as howToGetYourChildTalking from "@/content/en-IN/stories/articles/how-to-get-your-child-talking";
import * as howChildrenLearnByTalking from "@/content/en-IN/stories/articles/how-children-learn-by-talking";
import * as howChildrenCollectWords from "@/content/en-IN/stories/articles/how-children-collect-words";
import * as raisingABilingualChildInIndia from "@/content/en-IN/stories/articles/raising-a-bilingual-child-in-india";
import * as aToyThatTalksVsAToyThatListens from "@/content/en-IN/stories/articles/a-toy-that-talks-vs-a-toy-that-listens";
import * as questionsParentsAskAboutAiToys from "@/content/en-IN/stories/articles/questions-parents-ask-about-ai-toys";
import * as shouldKidsUseAi from "@/content/en-IN/stories/articles/should-kids-use-ai";
import * as aiToysAndIndiasDataLaw from "@/content/en-IN/stories/articles/ai-toys-and-indias-data-law";
import * as doesAThreeYearOldNeedAnAiTutor from "@/content/en-IN/stories/articles/does-a-three-year-old-need-an-ai-tutor";
import * as whatActuallyBuildsASharpBrain from "@/content/en-IN/stories/articles/what-actually-builds-a-sharp-brain";
import * as whyThreeToSixAreTheYearsThatMatterMost from "@/content/en-IN/stories/articles/why-three-to-six-are-the-years-that-matter-most";
import type { Article, IsoDate } from "@/content/types";
import { absoluteUrl } from "@/lib/seo/urls";

/**
 * `/sitemap.xml` (architecture §9.3, ADR-012): the URL plan in `src/content/en-IN/routes.ts` and nothing else,
 * so the redirected `/playos` and 2-year-old article, the store host (noindex) and campaign pages never appear.
 * Every URL is canonical on the production origin, in every environment (`absoluteUrl`, D048).
 *
 * `lastModified` only where a route's content module stores a real date (lessons §6): each article's `updated`,
 * written from git history when the article changes. A marketing page joins the day its module carries one.
 * Never `new Date()`: on the old site every one of 31 URLs said "changed just now" on every deploy, and a
 * crawler that learns the field is noise stops trusting it on the day a page really changes.
 */

/**
 * The article modules by slug, for their stored dates. A bridge for wave 4 only: task 4.2 adds the one registry
 * of article modules (src/content/en-IN/stories/articles/index.ts, wave-3 close ruling) in parallel, and at the
 * wave-4 close this map becomes an import of it. Turbopack's `import.meta.glob` cannot replace it: it matches
 * nothing outside the calling file's own folder (tried with `../`, `@/`, `/src/` and `base`, next 16.3.8).
 * The `satisfies` refuses to compile while a slug in routes.ts has no module here.
 */
const ARTICLES = {
  "learning-toys-for-a-three-year-old": learningToysForAThreeYearOld.article,
  "what-to-look-for-in-a-safe-ai-toy": whatToLookForInASafeAiToy.article,
  "talking-toys-and-late-talkers": talkingToysAndLateTalkers.article,
  "how-much-screen-time-for-a-3-to-6-year-old": howMuchScreenTimeForA3To6YearOld.article,
  "screen-time-rules-parents-swear-by": screenTimeRulesParentsSwearBy.article,
  "screen-time-and-tantrums": screenTimeAndTantrums.article,
  "the-gentle-way-off-the-phone": theGentleWayOffThePhone.article,
  "busy-hands-no-screens": busyHandsNoScreens.article,
  "screen-free-does-not-mean-silent": screenFreeDoesNotMeanSilent.article,
  "talking-late-or-talking-little": talkingLateOrTalkingLittle.article,
  "how-to-get-your-child-talking": howToGetYourChildTalking.article,
  "how-children-learn-by-talking": howChildrenLearnByTalking.article,
  "how-children-collect-words": howChildrenCollectWords.article,
  "raising-a-bilingual-child-in-india": raisingABilingualChildInIndia.article,
  "a-toy-that-talks-vs-a-toy-that-listens": aToyThatTalksVsAToyThatListens.article,
  "questions-parents-ask-about-ai-toys": questionsParentsAskAboutAiToys.article,
  "should-kids-use-ai": shouldKidsUseAi.article,
  "ai-toys-and-indias-data-law": aiToysAndIndiasDataLaw.article,
  "does-a-three-year-old-need-an-ai-tutor": doesAThreeYearOldNeedAnAiTutor.article,
  "what-actually-builds-a-sharp-brain": whatActuallyBuildsASharpBrain.article,
  "why-three-to-six-are-the-years-that-matter-most": whyThreeToSixAreTheYearsThatMatterMost.article,
} satisfies Record<ArticleSlug, Article>;

/** The date a route's content stores, if any: an article's `updated`; no marketing page stores one yet. */
function storedDate(route: RouteEntry): IsoDate | undefined {
  if (route.kind !== "article") return undefined;
  return ARTICLES[route.path.slice("/stories/".length) as ArticleSlug].updated;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => {
    const lastModified = storedDate(route);
    return {
      url: absoluteUrl(route.path),
      ...(lastModified ? { lastModified } : {}),
      priority: route.priority,
    };
  });
}
