import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Card } from "@/components/molecules/Card";
import { PromiseMark } from "@/components/molecules/PromiseMark";

/** Home room 4 (revamp M2, founder brief 11a): the four promises, each with
 *  a brand blob shape chip. Copy-v2 [seed]. Absorbs the jobs of the old
 *  SafetyCallout + SafetyStrip (both retire); the deep dive stays /safety.
 *  V5-4: the marks now come from the shared PromiseMark rotation, so the same
 *  language reads on /safety, /playos and the reserve reassurances instead of
 *  living only here. */
const POINTS = [
  {
    h: "We do not sell data.",
    b: "Your child's voice and words are never sold, and never used to sell them anything. That is a promise, not a setting you have to go find.",
  },
  /* 2026-10-12: rewritten to the product as built (no on-device model, no wake
     word, no topic controls, no one-tap deletion). See the note on /safety. */
  {
    h: "Kheelu listens when invited.",
    b: "A conversation starts only when your child presses Kheelu's button. Between conversations nothing is sent anywhere.",
  },
  {
    h: "You hold the keys.",
    b: "Read every conversation. Choose the languages and the stories. Delete it all by deleting your account. The grown-up decides, always.",
  },
  {
    h: "No open internet.",
    b: "Kheelu cannot browse or search the web, and every reply follows child-safety rules set for your child's age.",
  },
] as const;

export function TrustRoom() {
  return (
    <div>
      <Reveal>
        <SectionHeading
          eyebrow="The promise under everything"
          title="The part that matters most to you."
          titleClassName="mb-10 max-w-[18ch]"
        />
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2">
        {POINTS.map((p, i) => (
          <Reveal key={p.h} delay={i * 0.06}>
            <Card className="h-full border border-line bg-white p-7">
              <PromiseMark index={i} className="mb-4" />
              <h3 className="mb-2 font-display text-[22px] font-extrabold text-ink-head">
                {p.h}
              </h3>
              <p className="text-[16px] leading-relaxed">{p.b}</p>
            </Card>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8">
        <Link
          href="/safety"
          className="inline-flex items-center gap-1.5 rounded font-bold text-action-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        >
          See how we built safety in
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Reveal>
    </div>
  );
}
