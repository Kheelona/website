import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { CurveDivider } from "@/components/atoms/CurveDivider";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/molecules/Reveal";
import { Card } from "@/components/molecules/Card";

/* PLACEHOLDER TESTIMONIALS — GATE V3-a (founder, 2026-07-27).
 *
 * The founder named the three pilot parents (Shweta, Priyamvada, Gaurav) and
 * asked for placeholder words until the real quotes and consent arrive. These
 * three `text` values are DRAFTED, not spoken — they ship on the preview only
 * and must be replaced verbatim before this branch merges to main. The names
 * are real; the words are not yet. Do not add a fourth, and do not restore the
 * old anonymous "Parent of a 4-year-old" set: the founder retired every
 * pilot-count and anonymous-tester claim in V3 (no "ten families" anywhere). */
const QUOTES = [
  {
    text: "The first thing she does after school is tell Lumi about her day. I listen from the kitchen and learn things she forgets to tell me.",
    who: "Shweta",
    meta: "Pilot parent",
  },
  {
    text: "It sings the same rhymes my mother sang to me, and then it asks him questions about them. He answers before I can.",
    who: "Priyamvada",
    meta: "Pilot parent",
  },
  {
    text: "We wanted less screen time without a fight. This is the first thing that worked without one.",
    who: "Gaurav",
    meta: "Pilot parent",
  },
] as const;

export function ParentQuotes({
  from = "cream",
  count = 3,
  eyebrow = "From the pilot families",
  title = "The first families are already talking.",
  bare = false,
}: {
  from?: "white" | "cream" | "cool";
  count?: 2 | 3;
  eyebrow?: string;
  title?: string;
  /** Revamp M2: content-only, for composition inside a Room. */
  bare?: boolean;
}) {
  const content = (
    <>
      <Reveal>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          titleClassName="mb-10 max-w-[20ch]"
        />
      </Reveal>
      <div className={count === 2 ? "grid gap-5 md:grid-cols-2" : "grid gap-5 md:grid-cols-3"}>
          {QUOTES.slice(0, count).map((q, i) => (
            <Reveal key={q.who} delay={i * 0.06}>
              <Card className="border border-line-soft bg-cream">
                <p
                  aria-hidden="true"
                  className="mb-2 font-display text-4xl font-extrabold leading-none text-orange"
                >
                  &ldquo;
                </p>
                <p className="mb-4 font-display text-[20px] leading-[1.4] text-ink-head">
                  {q.text}
                </p>
                <p className="font-display text-[16px] font-extrabold text-ink-head">
                  {q.who}
                </p>
                <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
                  {q.meta}
                </p>
              </Card>
            </Reveal>
          ))}
      </div>
    </>
  );

  if (bare) return content;

  return (
    <Section wash="white" id="parent-voices">
      <CurveDivider from={from} />
      <Container className="pb-16 pt-6 md:pb-20 md:pt-8">{content}</Container>
    </Section>
  );
}
