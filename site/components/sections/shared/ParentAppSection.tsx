import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { KheeluSays } from "@/components/ui/KheeluSays";
import { PhoneFrame } from "@/components/ui/PhoneFrame";

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
}: {
  from?: "white" | "cream" | "cool" | "teal";
  /** Home mounts the narrator bubble; other pages keep their own single
   *  Kheelu moment, so it stays off by default. */
  kheelu?: boolean;
}) {
  return (
    <Section wash="cream" id="parent-app">
      <CurveDivider from={from} />
      <Container className="grid items-center gap-12 pb-16 pt-6 md:grid-cols-[0.85fr_1.15fr] md:pb-20 md:pt-8">
        <Reveal className="flex justify-center md:justify-start">
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
          <Eyebrow>For the grown-ups</Eyebrow>
          <h2 className="mb-5 max-w-[16ch] font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
            Parents stay in the loop.
          </h2>
          <p className="mb-6 max-w-[56ch] text-[clamp(18px,1.6vw,21px)]">
            Lumi ships with a parent app made for you. Watch the
            conversations, get a summary that tells you what mattered, and
            align Lumi to your family&apos;s values in a single prompt.
          </p>
          <ul className="mb-7 flex max-w-[560px] flex-wrap gap-2.5">
            {CHIPS.map((c) => (
              <li
                key={c}
                className="rounded-full border border-line-soft bg-white px-4 py-2 text-[14.5px] font-medium text-ink-head"
              >
                {c}
              </li>
            ))}
          </ul>
          <Link
            href="/products/lumi"
            className="inline-flex items-center gap-1.5 font-bold text-orange-deep underline-offset-4 hover:underline"
          >
            See what the app shows you
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
