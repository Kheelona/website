import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

/** R7: real early-tester quotes, verbatim from the founder-published
 *  kheelona.ai (content/site.ts QUOTES). This resolves the long-standing
 *  claims-testimonials blocker: these are published, attributed quotes from
 *  the live pilot, not invented copy. */
const QUOTES = [
  {
    text: "Her face lit up in the first sixty seconds, and now I can see the words adding up.",
    who: "Parent of a 4-year-old, early tester",
  },
  {
    text: "She asks for it before the TV now. I can literally hear her vocabulary growing.",
    who: "Parent of a 5-year-old, daily tester",
  },
  {
    text: "It's the first 'smart' thing in our house that made bedtime easier, not harder.",
    who: "Lumi pilot family",
  },
] as const;

export function ParentQuotes({
  from = "teal",
  count = 3,
  eyebrow = "From the pilot families",
  title = "Ten families test Lumi every day.",
}: {
  from?: "white" | "cream" | "cool" | "teal";
  count?: 2 | 3;
  eyebrow?: string;
  title?: string;
}) {
  return (
    <Section wash="white" id="parent-voices">
      <CurveDivider from={from} />
      <Container className="pb-16 pt-6 md:pb-20 md:pt-8">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mb-10 max-w-[20ch] font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
            {title}
          </h2>
        </Reveal>
        <div className={count === 2 ? "grid gap-5 md:grid-cols-2" : "grid gap-5 md:grid-cols-3"}>
          {QUOTES.slice(0, count).map((q, i) => (
            <Reveal key={q.who} delay={i * 0.06}>
              <TiltCard className="h-full rounded-(--radius-card) border border-line-soft bg-cream p-7">
                <p
                  aria-hidden="true"
                  className="mb-2 font-display text-4xl font-extrabold leading-none text-orange"
                >
                  &ldquo;
                </p>
                <p className="mb-4 font-accent text-[20px] leading-[1.4] text-ink-head">
                  {q.text}
                </p>
                <p className="text-[14px] font-semibold uppercase tracking-wide text-ink-muted">
                  {q.who}
                </p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
