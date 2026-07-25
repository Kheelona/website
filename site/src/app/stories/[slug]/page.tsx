import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { PageHero } from "@/components/templates/PageHero";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { STORIES, getStory } from "@/lib/stories";

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
  return {
    title: story.title,
    description: story.description,
    alternates: { canonical: `/stories/${story.slug}` },
  };
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.description,
    author: { "@type": "Organization", name: "Kheelona" },
    publisher: { "@type": "Organization", name: "Kheelona" },
    mainEntityOfPage: `https://kheelona.com/stories/${story.slug}`,
    ...(story.hero && { image: `https://kheelona.com${story.hero}` }),
  };

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
          <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
            {story.minutes} minute read
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

        <Room
          fill="orange"
          id="reserve"
          guide="silly"
          /* GATED:kheelu-line */
          say="Save your spot. I'll keep Lumi company until launch."
          reveal="pop"
          className="overflow-x-clip"
        >
          <FinaleCTA bare variant="compact" />
        </Room>
      </RoomsTrack>
    </>
  );
}
