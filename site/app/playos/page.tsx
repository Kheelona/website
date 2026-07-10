import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { MascotScene } from "@/components/mascot/MascotScene";
import { FinaleCTA } from "@/components/sections/home/FinaleCTA";
import { StageGate } from "@/components/three/StageGate";

export const metadata: Metadata = {
  title: "PlayOS: the voice engine behind Lumi",
  description:
    "PlayOS is Kheelona's own voice engine for children aged 3 to 6. On-device first, age-graded safety, no open internet. The platform behind every brain development toy we make.",
  alternates: { canonical: "/playos" },
};

/* Copy drafted per prompt §5.2: confident, clear, technology made legible.
   Keywords: brain development toys, cognitive development toy for toddlers,
   smart toys, interactive learning toy for curious kids. */

const VOICE_PATH = [
  { n: "01", title: "Your child says the wake word.", body: "Until then, the microphone is off. Lumi starts listening only when it is invited to.", color: "text-blue" },
  { n: "02", title: "The device thinks first.", body: "Speech is processed on the toy before anything goes anywhere. Low latency. No long waits. No sending everything to a distant server.", color: "text-teal" },
  { n: "03", title: "The feeling gets read.", body: "PlayOS hears more than words. Curious, Grumpy, Sad, Silly, Joy: the answer meets the mood.", color: "text-purple" },
  { n: "04", title: "The right response comes back.", body: "Every reply passes through an age-graded safety layer before it is spoken. On-device and cloud filters work together. No open internet. No surprises.", color: "text-orange-deep" },
] as const;

const PRIVACY_CARDS = [
  { title: "Region-pinned", body: "Your family's conversations stay in your region." },
  { title: "Parent-consented", body: "Nothing is collected without your say-so. If you have not said yes, it does not happen." },
  { title: "Deletable in one tap", body: "Any conversation, gone the moment you decide." },
  { title: "Never sold", body: "Your child's voice data is never sold. Full stop." },
] as const;

const FAMILY = [
  { name: "Lumi", note: "Here first. The friend who listens.", color: "bg-white" },
  { name: "Lori", note: "Next in line.", color: "bg-blue/15" },
  { name: "Lua", note: "In the workshop.", color: "bg-purple/15" },
  { name: "Robu", note: "Worth the wait.", color: "bg-teal/15" },
] as const;

export default function PlayOSPage() {
  return (
    <>
      {/* Hero */}
      <Section wash="cool">
        <Container className="grid items-center gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-20">
          <Reveal mode="rise">
            {/* default orange-deep: text-blue on the cool wash is 2.68:1,
                under the 3:1 large-text floor (Eyebrow.tsx deviation note) */}
            <Eyebrow>How it works</Eyebrow>
            <h1 className="mb-5 font-display text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1.08] text-ink-head">
              How does Lumi talk with your child?
            </h1>
            <p className="max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              PlayOS is Kheelona&apos;s own voice engine, built from the ground
              up for children aged 3 to 6. It is what makes Lumi a cognitive
              development toy instead of a gadget: one platform, one set of
              safety rules, in every product we will ever make.
            </p>
          </Reveal>
          <Reveal className="flex justify-center">
            <MascotScene pose="curious" width={320} parallax={36} priority />
          </Reveal>
        </Container>
      </Section>

      {/* The voice path */}
      <Section wash="white">
        <CurveDivider from="cool" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <h2 className="mb-3 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
              The path of one sentence.
            </h2>
            <p className="mb-12 max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              From your child&apos;s question to Lumi&apos;s answer, in four
              careful steps.
            </p>
          </Reveal>
          <ol className="space-y-0 border-t border-line">
            {VOICE_PATH.map((s) => (
              <Reveal as="li" key={s.n} className="grid items-start gap-5 border-b border-line py-8 md:grid-cols-[90px_1fr_1.4fr] md:gap-7">
                  <span aria-hidden="true" className={`font-display text-4xl font-extrabold ${s.color}`}>
                    {s.n}
                  </span>
                  <h3 className="font-display text-[24px] font-extrabold leading-tight text-ink-head">
                    {s.title}
                  </h3>
                <p className="text-[16.5px]">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Data & privacy */}
      <Section wash="cream">
        <CurveDivider from="white" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <h2 className="mb-3 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
              Where a child&apos;s voice goes.
            </h2>
            <p className="mb-11 max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              Short answer: almost nowhere. And never anywhere you did not
              approve.
            </p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRIVACY_CARDS.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05}>
                <TiltCard className="h-full rounded-(--radius-card) bg-white p-7">
                  <h3 className="mb-2 font-display text-[22px] font-extrabold text-ink-head">{c.title}</h3>
                  <p className="text-[15.5px]">{c.body}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <p className="text-[16px] text-ink-muted">
              The full picture, including how we built the safety layer, lives
              on the <Link href="/safety" className="font-semibold text-ink-head underline">Safety page</Link>.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* The family roadmap (cream, so the finale stays the page's one orange) */}
      <Section wash="cream">
        <CurveDivider from="cream" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <h2 className="mb-3 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
              One soul. Many bodies.
            </h2>
            <p className="mb-11 max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              Made to be kept, not outgrown. Lumi is the first of a family.
              Every friend that follows runs on the same PlayOS soul, learns
              the same safety rules, and grows with your child instead of
              gathering dust.
            </p>
          </Reveal>
          <div className="mb-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FAMILY.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.05}>
                <div className={`h-full rounded-(--radius-card) p-7 ${m.color}`}>
                  <h3 className="mb-1 font-display text-[26px] font-extrabold text-ink-head">
                    {m.name}
                  </h3>
                  <p className="text-[15.5px] text-ink-head/85">{m.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="flex flex-wrap items-center justify-between gap-5">
            <p className="text-[16px] text-ink-muted">
              Building on PlayOS?{" "}
              <a href="https://kheelona.ai" className="font-semibold text-ink-head underline">
                See kheelona.ai
              </a>
            </p>
            <Button href="/products/lumi" variant="ghost">
              Meet Lumi, the first friend
            </Button>
          </Reveal>
        </Container>
      </Section>

      <FinaleCTA variant="compact" from="cream" />
      <StageGate stage="ambient" />
    </>
  );
}
