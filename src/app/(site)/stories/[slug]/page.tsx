import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { PageHero } from "@/components/templates/PageHero";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { ReadNext } from "@/components/organisms/ReadNext";
import {
  STORIES,
  getStory,
  getRelatedStories,
  readingMinutes,
  wordCount,
  formatStoryDate,
} from "@/lib/stories";
import { pageGraph, breadcrumbs, SITE_URL, pageMeta, jsonLd, authorRef } from "@/lib/seo";

/* An unknown slug is a ROUTING 404, not a thrown one (§8.34-a).
 *
 *  This one line is the difference between a 404 that renders and a 404 that
 *  does not. `notFound()` thrown from a page component takes Next's error path
 *  (`getErrorRSCPayload` in app-render), which abandons the server render and
 *  emits `<html id="__next_error__">` with an empty body and NO stylesheet —
 *  the visitor gets a blank white page until JavaScript loads, and a permanent
 *  blank one if it never does. A path that matches no route at all takes the
 *  normal render path instead and streams the full marketing 404.
 *
 *  With `dynamicParams = false`, every slug outside generateStaticParams stops
 *  at the router, so /stories/<anything-else> now serves the real 404 page.
 *  Measured, not reasoned about: before this, `curl /stories/no-such-slug`
 *  returned 404 with 0 stylesheets and 0 characters of body text. */
export const dynamicParams = false;

export function generateStaticParams() {
  return STORIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const story = getStory((await params).slug);
  if (!story) return {};
  return pageMeta({
    title: story.title,
    description: story.description,
    path: `/stories/${story.slug}`,
    article: {
      publishedTime: story.published,
      modifiedTime: story.updated,
      authors: [story.author],
    },
  });
}

/* Revamp M4 (theme B): the article reads inside one white room. No guide
   lines here on purpose — the reading page stays quiet, and Kheelu keeps his
   pose from the journal index. */
export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const story = getStory((await params).slug);
  /* Unreachable since dynamicParams = false: only prerendered slugs get here.
     Kept because TypeScript needs the narrowing, and because it is the correct
     behaviour if that export is ever removed. */
  if (!story) notFound();

  /* BlogPosting, not bare Article: it places the piece inside the journal as a
     publication, which is what an answer engine looks for when deciding whether
     a page is editorial or an ad. V3-f CLEARED 2026-07-31: every piece carries
     a named author from /team (founder assignment), which is the E-E-A-T win
     the Organization byline was holding a place for.
     Dates since 2026-09-05 (§8.35-a): `datePublished` and `dateModified` are the
     article's own, taken from git history. Before that every piece shared one
     hardcoded `dateModified: "2026-07-01"` and had no publication date at all,
     on the theory that per-article days "would be invented" — they were not,
     the commits had them. `timeRequired` is derived from the word count
     (§8.35-b); the typed 4 to 6 minutes it replaced overstated 300-word reads. */
  const articleGraph = pageGraph(
    {
      "@type": "BlogPosting",
      headline: story.title,
      description: story.description,
      articleSection: story.theme,
      wordCount: wordCount(story),
      timeRequired: `PT${readingMinutes(story)}M`,
      inLanguage: "en-IN",
      author: authorRef(story.author),
      publisher: { "@id": `${SITE_URL}/#organization` },
      isPartOf: { "@id": `${SITE_URL}/stories#blog` },
      mainEntityOfPage: `${SITE_URL}/stories/${story.slug}`,
      datePublished: story.published,
      dateModified: story.updated,
      ...(story.hero && { image: `${SITE_URL}${story.hero}` }),
    },
    breadcrumbs([
      { name: "Stories", path: "/stories" },
      { name: story.title, path: `/stories/${story.slug}` },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(articleGraph) }}
      />

      <PageHero>
        <div className="max-w-[760px]">
          {/* article titles ride the section scale on purpose — quieter
              than a page hero */}
          <SectionHeading
            as="h1"
            level="section"
            eyebrow={story.theme}
            title={story.title}
            titleClassName="mb-3"
          />
          <p className="text-[13px] font-semibold uppercase tracking-wide text-orange-ink">
            <span className="font-medium normal-case tracking-normal">
              By {story.author}
            </span>
            <span aria-hidden="true"> · </span>
            {readingMinutes(story)} minute read
            <span aria-hidden="true"> · </span>
            <span className="font-medium normal-case tracking-normal">
              Published <time dateTime={story.published}>{formatStoryDate(story.published)}</time>
            </span>
            {story.updated !== story.published && (
              <>
                <span aria-hidden="true"> · </span>
                <span className="font-medium normal-case tracking-normal">
                  Updated <time dateTime={story.updated}>{formatStoryDate(story.updated)}</time>
                </span>
              </>
            )}
          </p>
        </div>
      </PageHero>

      <RoomsTrack>
        <Room fill="white">
          <article className="mx-auto max-w-[720px]">
            {story.hero && (
              <Image
                src={story.hero}
                alt={story.heroAlt ?? ""}
                width={1440}
                height={803}
                sizes="(max-width: 768px) 90vw, 720px"
                priority
                className="mb-9 h-auto w-full rounded-(--radius-card-lg)"
              />
            )}
            {story.paragraphs.map((block, i) => (
              <div key={i}>
                {block.h && (
                  <h2 className="mb-3 mt-9 font-display text-[26px] font-extrabold text-ink-head">
                    {block.h}
                  </h2>
                )}
                <p className="mb-5 text-[18px] leading-[1.7]">{block.p}</p>
              </div>
            ))}
            {/* The age caveat, where the piece is about a child younger than
                Kheelu's band. Placed directly under the closing paragraph on
                purpose: that paragraph is the invitation, and this qualifies it
                in the same breath rather than three screens earlier. */}
            {story.ageNote && (
              <aside
                aria-label="Product age information"
                className="mt-8 rounded-(--radius-card) border border-line bg-orange/15 p-5"
              >
                <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-orange-ink">
                  Before you pre-order
                </p>
                <p className="text-[16.5px] leading-[1.65]">{story.ageNote}</p>
                <Link
                  href="/products/kheelu#faq"
                  className="mt-3 inline-block font-semibold text-ink-head underline"
                >
                  Read Kheelu&rsquo;s age guidance and product details
                </Link>
              </aside>
            )}

            <div className="mt-10 flex items-center gap-5 rounded-(--radius-card) bg-cream p-6">
              <Image
                src={`/mascot/mascot-${story.pose}.png`}
                alt=""
                width={90}
                height={120}
                sizes="90px"
                className="h-[86px] w-auto"
              />
              {/* /safety joined this block on 2026-09-05. Two reasons, and the
                  second is the stronger one. The agency asked for a contextual
                  safety link on the safe-AI-toy piece; but /safety has the
                  lowest exit rate on the whole site (12.9%, Ahrefs to
                  2026-09-05), so it is the page that answers the objection an
                  article leaves a parent holding. Every article gets it, not
                  just the one, which also deepens a journal that shipped as
                  nineteen dead-end leaves (test/internal-links.test.ts). */}
              <p className="text-[16px]">
                More reads like this on the{" "}
                <Link href="/stories" className="font-semibold text-ink-head underline">
                  journal
                </Link>
                , the mechanisms behind the promises on the{" "}
                <Link href="/safety" className="font-semibold text-ink-head underline">
                  Safety page
                </Link>
                , or meet the friend behind it on the{" "}
                <Link href="/products/kheelu" className="font-semibold text-ink-head underline">
                  Kheelu page
                </Link>
                .
              </p>
            </div>
          </article>
        </Room>

        {/* Structural internal linking (2026-08-12). Cool, not cream: the
            article room above ends on a cream Kheelu box, and cream on cream
            would read as one continuous panel. No `say` line — every Kheelu
            line is founder-gated and this change should not open that gate. */}
        <Room fill="cool">
          <ReadNext stories={getRelatedStories(story.slug)} />
        </Room>

        <Room
          fill="white"
          id="reserve"
          guide="silly"
          /* GATED:kheelu-line */
          say="Save your spot. I'll mind Kheelu till launch."
          reveal="pop"
          className="overflow-x-clip"
        >
          <FinaleCTA bare variant="compact" />
        </Room>
      </RoomsTrack>
    </>
  );
}
