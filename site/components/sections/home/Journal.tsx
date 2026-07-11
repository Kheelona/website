import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { KheeluSays } from "@/components/ui/KheeluSays";

/** Home S10. Card copy verbatim; cards link into /stories. */
const CARDS = [
  {
    slug: "why-three-to-six-are-the-years-that-matter-most",
    title: "Why three to six are the years that matter most",
    line: "A short, warm read on the window when a child's brain grows fastest.",
    img: "curious",
    bg: "bg-[linear-gradient(160deg,rgba(58,164,229,0.15),rgba(26,188,156,0.15))]",
  },
  {
    slug: "screen-free-does-not-mean-silent",
    title: "Screen-free does not mean silent",
    line: "What a rich, language-filled childhood actually looks like.",
    img: "silly",
    bg: "bg-[linear-gradient(160deg,rgba(241,162,59,0.15),rgba(239,118,47,0.15))]",
  },
] as const;

export function Journal() {
  return (
    <Section wash="sun" id="journal">
      <CurveDivider from="cream" flip />
      <Container className="py-16 md:py-20">
        <Reveal>
          <KheeluSays
            line="I collect stories too. Here are some for you."
            pose="joy"
          />
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
                className="block h-full overflow-hidden rounded-(--radius-card) bg-white transition-[transform,box-shadow] duration-300 ease-(--ease-bounce) hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(216,95,27,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                <div className={`flex h-[220px] items-end justify-center overflow-hidden ${c.bg}`}>
                  <Image
                    src={`/mascot/mascot-${c.img}.png`}
                    alt=""
                    width={240}
                    height={300}
                    className="h-[190px] w-auto translate-y-3"
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
          <Button href="/stories" variant="ghost">
            See all stories
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
