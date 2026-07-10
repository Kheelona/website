import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { KheeluSays } from "@/components/ui/KheeluSays";
import { SETUP_STEPS } from "@/lib/setup-steps";

/** R9 (reviewer finding: skeptical parents want the concrete step sequence
 *  on the buying journey, not only behind the nav). The four steps are the
 *  published /setup copy, verbatim, from lib/setup-steps.ts. Rides the same
 *  cool wash as the feature grid above it, so Compare's divider still reads
 *  from cool. */
export function HowItWorks() {
  return (
    <Section wash="cool" id="how-it-works">
      <Container className="pb-16 pt-2 md:pb-20">
        <Reveal>
          <KheeluSays
            line="From the box to the first hello, here is how it goes."
            pose="curious"
          />
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mb-10 max-w-[18ch] font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
            Four steps. No manual required.
          </h2>
        </Reveal>
        <div className="mb-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SETUP_STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <TiltCard className="h-full rounded-(--radius-card) border border-line-soft bg-white p-6">
                <span
                  aria-hidden="true"
                  className={`font-display text-4xl font-extrabold ${s.color}`}
                >
                  {s.n}
                </span>
                <h3 className="mt-3 font-display text-[21px] font-extrabold leading-tight text-ink-head">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[15.5px]">{s.body}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <Link
            href="/setup"
            className="inline-flex items-center gap-1.5 font-bold text-orange-deep underline-offset-4 hover:underline"
          >
            Read the full setup guide
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
