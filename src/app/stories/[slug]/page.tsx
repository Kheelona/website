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
import { STORIES, getStory, getRelatedStories } from "@/lib/stories";
import { JOURNAL_REVIEWED } from "@/config/site";
import { graph, breadcrumbs, SITE_URL, pageMeta } from "@/lib/seo";

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
  if (!story) notFound();

  /* BlogPosting, not bare Article: it places the piece inside the journal as a
     publication, which is what an answer engine looks for when deciding whether
     a page is editorial or an ad. V3-f CLEARED 2026-07-31: every piece carries
     a named author from /team (founder assignment), which is the E-E-A-T win
     the Organization byline was holding a place for. Month precision on the
     date on purpose: per-article days would be invented. */
  const jsonLd = graph(
    {
      "@type": "BlogPosting",
      headline: story.title,
      description: story.description,
      articleSection: story.theme,
      wordCount: story.paragraphs.reduce((n, b) => n + b.p.split(/\s+/).length, 0),
      timeRequired: `PT${story.minutes}M`,
      inLanguage: "en-IN",
      author: { "@type": "Person", name: story.author, url: `${SITE_URL}/team` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      isPartOf: { "@id": `${SITE_URL}/stories#blog` },
      mainEntityOfPage: `${SITE_URL}/stories/${story.slug}`,
      dateModified: "2026-07-01",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            {story.minutes} minute read
            <span aria-hidden="true"> · </span>
            <span className="font-medium normal-case tracking-normal">
              Reviewed {JOURNAL_REVIEWED}
            </span>
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
            <div className="mt-10 flex items-center gap-5 rounded-(--radius-card) bg-cream p-6">
              <Image
                src={`/mascot/mascot-${story.pose}.png`}
                alt=""
                width={90}
                height={120}
                sizes="90px"
                className="h-[86px] w-auto"
              />
              <p className="text-[16px]">
                More reads like this on the{" "}
                <Link href="/stories" className="font-semibold text-ink-head underline">
                  journal
                </Link>
                , or meet the friend behind it on the{" "}
                <Link href="/products/lumi" className="font-semibold text-ink-head underline">
                  Lumi page
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
          say="Save your spot. I'll mind Lumi till launch."
          reveal="pop"
          className="overflow-x-clip"
        >
          <FinaleCTA bare variant="compact" />
        </Room>
      </RoomsTrack>
    </>
  );
}
