import Image from "next/image";
import { TextLink } from "@/components/molecules/TextLink";
import Link from "next/link";
import { PRESS_LIFT } from "@/lib/interactions";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/molecules/Reveal";
import { getStory } from "@/lib/stories";

/** Home S10. Card copy verbatim; cards link into /stories.
 *
 *  CMO merge (2026-10-04): the cards show each article's OWN photograph
 *  instead of the mascot drawing. The guide that drawing belonged to is
 *  retired from Home, and all 19 articles have had real photography since
 *  2026-07-31, so the card now previews the page it opens. The mockup dropped
 *  this room entirely; it stays because it carries Home's internal links into
 *  the journal, which is what ranks. */
const CARDS = [
  {
    slug: "why-three-to-six-are-the-years-that-matter-most",
    title: "Why the early years matter most",
    line: "A short, warm read on the window when a child's brain grows fastest.",
  },
  {
    slug: "screen-free-does-not-mean-silent",
    title: "Screen-free does not mean silent",
    line: "What a rich, language-filled childhood actually looks like.",
  },
] as const;

/** The article's own hero photo; a missing slug fails the build, not the page. */
function heroOf(slug: string) {
  const story = getStory(slug);
  if (!story?.hero || !story.heroAlt) {
    throw new Error(`Journal card needs a story with a hero photo: ${slug}`);
  }
  return { src: story.hero, alt: story.heroAlt };
}

export function Journal({ bare = false }: { bare?: boolean }) {
  const content = (
    <>
      <Reveal>
        {/* one eyebrow rule site-wide (design panel 2026-07-10: per-page
            hues read as accidental) */}
        <SectionHeading
          eyebrow="From the journal"
          title="Raising curious kids."
          titleClassName="mb-2"
          lede="Ideas and honest reads for parents who want more than a screen."
          ledeClassName="mb-10"
        />
      </Reveal>
      <div className="mb-10 grid gap-6 md:grid-cols-2">
          {CARDS.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.08}>
              {/* no TiltCard: whole-card links must not move under the
                  cursor (TiltCard.tsx hard rule, R10) */}
              <Link
                href={`/stories/${c.slug}`}
                className={`block h-full overflow-hidden rounded-(--radius-card) bg-white ${PRESS_LIFT} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2`}
              >
                <div className="relative h-[220px] overflow-hidden bg-cream">
                  <Image
                    src={heroOf(c.slug).src}
                    alt={heroOf(c.slug).alt}
                    fill
                    sizes="(max-width: 768px) 90vw, 540px"
                    className="object-cover"
                  />
                </div>
                <div className="p-7">
                  <h3 className="mb-2 font-display text-[26px] font-extrabold leading-tight text-ink-head">
                    {c.title}
                  </h3>
                  <p className="text-[16px] text-ink-muted">{c.line}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      <Reveal>
        <TextLink href="/stories">See all stories</TextLink>
      </Reveal>
    </>
  );

  if (bare) return content;

  return (
    <Section wash="sun" id="journal">
      <Container className="py-16 md:py-20">
        {content}
      </Container>
    </Section>
  );
}
