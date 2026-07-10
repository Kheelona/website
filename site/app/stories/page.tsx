import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { KheeluSays } from "@/components/ui/KheeluSays";
import { TiltCard } from "@/components/ui/TiltCard";
import { FinaleCTA } from "@/components/sections/home/FinaleCTA";
import { STORIES } from "@/lib/stories";
import { StageGate } from "@/components/three/StageGate";

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
            <Eyebrow>The journal</Eyebrow>
            <h1 className="mb-4 font-display text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1.08] text-ink-head">
              Raising curious kids.
            </h1>
            <p className="max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              Ideas and honest reads for parents who want more than a screen.
              Useful first, always.
            </p>
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
                    <TiltCard>
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
                    </TiltCard>
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
