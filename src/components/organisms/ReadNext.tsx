import Link from "next/link";
import { Card } from "@/components/molecules/Card";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { PRESS_LIFT } from "@/lib/interactions";
import type { Story } from "@/lib/stories";

/** Three more reads at the foot of an article.
 *
 *  WHY THIS EXISTS. Every article was a dead end. Fifteen of the nineteen had
 *  exactly one incoming internal link, all from /stories, and no article linked
 *  to another — so the journal, which is the only part of this site written to
 *  rank, hung off the index as nineteen leaves while crawl equity pooled on
 *  Home. The fix is structural, not editorial: the block adds links without
 *  touching a word of the approved prose above it. Selection lives in
 *  `getRelatedStories`, which is deterministic on purpose.
 *
 *  Text-only cards on purpose. The /stories index leads every card with the
 *  story's own photography (V4-c) and that is right for a browsing page, but at
 *  the foot of a 1,200-word read it would mean three more images loading after
 *  the one the reader came for. These carry theme, headline and length.
 *
 *  No tilt: the whole card is a link, and a surface that moves under the cursor
 *  drops clicks (§8.18). `interactive` swaps in the shared press-and-lift so a
 *  tap answers on a phone, which is where the reader is. */
export function ReadNext({ stories }: { stories: readonly Story[] }) {
  if (stories.length === 0) return null;

  return (
    <>
      <Reveal>
        <SectionHeading level="minor" title="Read next" titleClassName="mb-7" />
      </Reveal>
      <ul className="grid gap-5 md:grid-cols-3">
        {stories.map((story, i) => (
          <Reveal as="li" key={story.slug} delay={i * 0.06}>
            <Link
              href={`/stories/${story.slug}`}
              className={`group block h-full rounded-(--radius-card) ${PRESS_LIFT} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2`}
            >
              <Card interactive className="h-full border border-line bg-white p-6">
                <Eyebrow className="mb-2">{story.theme}</Eyebrow>
                <h3 className="mb-2 font-display text-[20px] font-extrabold leading-tight text-ink-head">
                  {story.title}
                </h3>
                <p className="text-[15px] text-ink-muted">
                  {story.minutes} minute read
                </p>
              </Card>
            </Link>
          </Reveal>
        ))}
      </ul>
    </>
  );
}
