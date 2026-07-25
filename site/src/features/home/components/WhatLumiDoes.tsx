import Link from "next/link";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { CurveDivider } from "@/components/atoms/CurveDivider";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Card } from "@/components/molecules/Card";
import { KheeluSays } from "@/components/molecules/KheeluSays";
import { Shape } from "@/components/atoms/Shapes";
import type { ShapeKind } from "@/lib/shape-paths";

/** Home S06 (R8, founder-directed): replaces the "technology behind the
 *  talking" block with the parent-useful feature grid from kheelona.ai/lumi
 *  ("Not a speaker with a face. A companion with a memory."). Copy adapted to
 *  house voice (de-gendered, no contractions, 10 languages). Icons are the
 *  design-system shape-face characters (DS card 17), faces after the
 *  kheelona.ai kit's Character moods. */

function ShapeFace({
  kind,
  color,
  mouth = "smile",
}: {
  kind: ShapeKind;
  color: string;
  mouth?: "smile" | "grin" | "ooh";
}) {
  return (
    <div aria-hidden="true" className="relative h-14 w-14">
      <Shape kind={kind} color={color} opacity={1} className="h-full w-full" />
      <svg viewBox="0 0 100 100" className="absolute inset-0">
        <g transform="translate(24,30)">
          <circle cx="10" cy="10" r="10" fill="#fff" />
          <circle cx="10" cy="11" r="6.5" fill="#000" />
          <circle cx="14" cy="8" r="1.6" fill="#fff" />
        </g>
        <g transform="translate(56,30)">
          <circle cx="10" cy="10" r="10" fill="#fff" />
          <circle cx="10" cy="11" r="6.5" fill="#000" />
          <circle cx="14" cy="8" r="1.6" fill="#fff" />
        </g>
        {mouth === "smile" && (
          <path
            d="M40 66 Q50 76 60 66"
            fill="none"
            stroke="#000"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )}
        {mouth === "grin" && <path d="M37 64 Q50 78 63 64 Z" fill="#FF2A2A" />}
        {mouth === "ooh" && <circle cx="50" cy="68" r="4.5" fill="#FF2A2A" />}
      </svg>
    </div>
  );
}

const FEATURES = [
  {
    title: "Real conversation",
    body: "A continuous two-way dialogue. Lumi knows your child's name, their grade, their favourite dinosaur.",
    kind: "squircle" as ShapeKind,
    color: "#EF762F",
    mouth: "grin" as const,
  },
  {
    title: "Breathes",
    body: "A gentle breathing motion makes Lumi feel alive in a child's arms. Calm by design.",
    kind: "flower5" as ShapeKind,
    color: "#29A0D7",
    mouth: "smile" as const,
  },
  {
    title: "10 languages",
    body: "Hindi, English, and regional languages. Vocabulary that matches your child's age and grows with them.",
    kind: "triangle5" as ShapeKind,
    color: "#F1A23B",
    mouth: "smile" as const,
  },
  {
    title: "Answers every 'why?'",
    body: "Curiosity-led learning, all day, without a screen in sight.",
    kind: "polygon" as ShapeKind,
    color: "#29A0D7",
    mouth: "ooh" as const,
  },
  {
    title: "Parent app",
    body: "New words, milestones, and gentle wellbeing flags. Growth you can see.",
    kind: "flower4" as ShapeKind,
    color: "#F1A23B",
    mouth: "grin" as const,
  },
  {
    title: "Safe by design",
    body: "On-device and cloud safety filters, age-graded responses, no open internet.",
    kind: "flower3" as ShapeKind,
    color: "#EF762F",
    mouth: "smile" as const,
  },
] as const;

export function WhatLumiDoes() {
  return (
    <Section wash="cool" id="playos-home" className="overflow-x-clip">
      <CurveDivider from="white" flip />
      <Container className="pb-16 pt-6 md:pb-20 md:pt-8">
        <Reveal>
          <KheeluSays line="A whole day with Lumi looks like this." pose="bliss" />
          <SectionHeading
            eyebrow="What Lumi does all day"
            title="Not a speaker with a face. A companion with a memory."
            titleClassName="mb-4 max-w-[22ch]"
            lede="Lumi runs on PlayOS, Kheelona's own voice engine built from the ground up for children aged 3 to 6."
            ledeClassName="mb-11 max-w-[58ch]"
          />
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <Card className="border border-line-soft">
                <ShapeFace kind={f.kind} color={f.color} mouth={f.mouth} />
                <h3 className="mt-4 font-display text-[22px] font-extrabold text-ink-head">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-[15px]">{f.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        {/* R9: the B2B "Building on PlayOS?" invite left the parent flow
            (reviewer finding) — it lives in the footer's partners line. */}
        <Reveal className="mt-9">
          <p className="text-[16px] text-ink-muted">
            The technology behind the talking lives on the{" "}
            <Link href="/playos" className="font-semibold text-ink-head underline">
              PlayOS page
            </Link>
            .
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
