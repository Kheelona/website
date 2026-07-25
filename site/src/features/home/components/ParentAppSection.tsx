import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { CurveDivider } from "@/components/atoms/CurveDivider";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/molecules/Reveal";
import { KheeluSays } from "@/components/molecules/KheeluSays";
import { PhoneFrame } from "@/components/molecules/PhoneFrame";

/** R7: the parent-app section from the kheelona.ai home page, adapted to
 *  second-person parent voice (B2B lines like "branded yours" and "turns a
 *  sale into a subscription" dropped). Chips verbatim; screenshot is the
 *  real parent-app dashboard from the founder's repo. */
const CHIPS = [
  "Summary & notifications",
  "Conversation log",
  "Filter topics",
  "Reinforce cultural values",
  "Parenting philosophy, in one prompt",
] as const;

export function ParentAppSection({
  from = "white",
  kheelu = false,
  bare = false,
}: {
  from?: "white" | "cream" | "cool" | "teal";
  /** Home mounts the narrator bubble; other pages keep their own single
   *  Kheelu moment, so it stays off by default. */
  kheelu?: boolean;
  /** Revamp M2: content-only, for composition inside a Room. */
  bare?: boolean;
}) {
  const content = (
    <div className="grid items-center gap-12 md:grid-cols-[0.85fr_1.15fr]">
        {/* min-w-0 (M4 mobile pass): without it this grid item sizes to the
            phone frame's fixed px width as its minimum, which pushes the whole
            room past a 320px screen — max-w-full on the frame caps the USED
            width but not the min-content it contributes to the track. */}
        <Reveal className="flex min-w-0 justify-center md:justify-start">
          <PhoneFrame
            src="/app/dashboard.png"
            alt="The Kheelona parent app dashboard showing a child's interests and conversation activity"
          />
        </Reveal>
        <Reveal>
          {kheelu && (
            <KheeluSays
              line="Lumi and I keep no secrets from grown-ups."
              pose="grumpy"
            />
          )}
          <SectionHeading
            eyebrow="For the grown-ups"
            title="Parents stay in the loop."
            titleClassName="mb-5 max-w-[16ch]"
            lede="Lumi ships with a parent app made for you. Watch the conversations, get a summary that tells you what mattered, and align Lumi to your family's values in a single prompt."
            ledeClassName="mb-6 max-w-[56ch]"
          />
          <ul className="mb-7 flex max-w-[560px] flex-wrap gap-2.5">
            {CHIPS.map((c) => (
              <li
                key={c}
                className="rounded-full border border-line-soft bg-white px-4 py-2 text-[15px] font-medium text-ink-head"
              >
                {c}
              </li>
            ))}
          </ul>
          {/* R11 audit: orange-deep is ~3.9:1 on the cream wash; orange-ink
              was minted for non-white washes (4.5:1 everywhere) */}
          <Link
            href="/products/lumi"
            className="inline-flex items-center gap-1.5 rounded font-bold text-orange-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
          >
            See what the app shows you
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
    </div>
  );

  if (bare) return content;

  return (
    <Section wash="cream" id="parent-app">
      <CurveDivider from={from} />
      <Container className="pb-16 pt-6 md:pb-20 md:pt-8">{content}</Container>
    </Section>
  );
}
