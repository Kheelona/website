import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Card } from "@/components/molecules/Card";
import { KheeluSays } from "@/components/molecules/KheeluSays";
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
          <SectionHeading
            eyebrow="How it works"
            title="Four steps. No manual required."
            titleClassName="mb-10 max-w-[18ch]"
          />
        </Reveal>
        <div className="mb-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SETUP_STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <Card className="border border-line-soft p-6">
                <span
                  aria-hidden="true"
                  className={`font-display text-4xl font-extrabold ${s.color}`}
                >
                  {s.n}
                </span>
                <h3 className="mt-3 font-display text-[21px] font-extrabold leading-tight text-ink-head">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[15px]">{s.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <Reveal>
          {/* R11 audit: orange-deep is ~4.0:1 on the cool wash; orange-ink
              was minted for non-white washes (4.5:1 everywhere) */}
          <Link
            href="/setup"
            className="inline-flex items-center gap-1.5 rounded font-bold text-orange-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
          >
            Read the full setup guide
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
