import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { CurveDivider } from "@/components/atoms/CurveDivider";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/molecules/Reveal";
import { KheeluSays } from "@/components/molecules/KheeluSays";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { STORIES } from "@/lib/stories";
import { StageGate } from "@/features/ambient-stage";

export const metadata: Metadata = {
  title: "Stories: raising curious kids",
  description:
    "Honest reads for parents who want more than a screen: brain development, screen-free living, talking toys, and how to judge AI toys for kids.",
  alternates: { canonical: "/stories" },
};

export default function StoriesPage() {
  const themes = [...new Set(STORIES.map((s) => s.theme))];

  return (
    <>
      <Section wash="cream">
        <Container className="py-16 md:py-20">
          <Reveal mode="rise">
            <KheeluSays
              line="My notebook. Take any story you like."
              pose="curious"
            />
            <SectionHeading
              as="h1"
              eyebrow="The journal"
              title="Raising curious kids."
              titleClassName="mb-4"
              lede="Ideas and honest reads for parents who want more than a screen. Useful first, always."
            />
          </Reveal>
        </Container>
      </Section>

      <Section wash="white">
        <CurveDivider from="cream" />
        <Container className="py-16 md:py-20">
          {themes.map((theme) => (
            <div key={theme} className="mb-14 last:mb-0">
              <Reveal>
                <h2 className="mb-7 font-display text-[clamp(24px,2.6vw,32px)] font-extrabold text-ink-head">
                  {theme}
                </h2>
              </Reveal>
              <div className="grid gap-6 md:grid-cols-2">
                {STORIES.filter((s) => s.theme === theme).map((s, i) => (
                  <Reveal key={s.slug} delay={i * 0.06}>
                    {/* no TiltCard: whole-card links must not move under the
                        cursor (TiltCard.tsx hard rule, R10) */}
                    <Link
                      href={`/stories/${s.slug}`}
                      className="flex h-full overflow-hidden rounded-(--radius-card) bg-cream transition-[transform,box-shadow] duration-300 ease-(--ease-bounce) hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(216,95,27,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                    >
                      <div className={`flex w-[130px] shrink-0 items-end justify-center ${s.tint}`}>
                        <Image
                          src={`/mascot/mascot-${s.pose}.png`}
                          alt=""
                          width={120}
                          height={160}
                          className="h-[110px] w-auto translate-y-1"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="mb-1 font-display text-[22px] font-extrabold leading-tight text-ink-head">
                          {s.title}
                        </h3>
                        <p className="mb-2 text-[15px] text-ink-muted">{s.description}</p>
                        <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
                          {s.minutes} minute read
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </Container>
      </Section>

      <FinaleCTA variant="compact" from="white" />
      <StageGate stage="ambient" />
    </>
  );
}
