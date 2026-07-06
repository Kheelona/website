import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FinaleCTA } from "@/components/sections/home/FinaleCTA";
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
      <Section wash="cream">
        <Container className="py-14 md:py-16">
          <div className="mx-auto max-w-[760px]">
            <Eyebrow>{story.theme}</Eyebrow>
            <h1 className="mb-3 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.1] text-ink-head">
              {story.title}
            </h1>
            <p className="text-[15px] font-semibold uppercase tracking-wide text-ink-muted">
              {story.minutes} minute read
            </p>
          </div>
        </Container>
      </Section>
      <Section wash="white">
        <CurveDivider from="cream" />
        <Container className="py-12 md:py-16">
          <article className="mx-auto max-w-[720px]">
            {story.hero && (
              <Image
                src={story.hero}
                alt={story.heroAlt ?? ""}
                width={1440}
                height={803}
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
                className="h-[86px] w-auto"
              />
              <p className="text-[16px]">
                More reads like this on the{" "}
                <Link href="/stories" className="font-semibold text-blue underline">
                  journal
                </Link>
                , or meet the friend behind it on the{" "}
                <Link href="/products/lumi" className="font-semibold text-blue underline">
                  Lumi page
                </Link>
                .
              </p>
            </div>
          </article>
        </Container>
      </Section>
      <FinaleCTA variant="compact" from="white" />
    </>
  );
}
