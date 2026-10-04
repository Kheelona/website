import { ArrowRight, MessageSquareText, Mic, ShieldCheck, WifiOff } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Card } from "@/components/molecules/Card";

/** The four things parents ask first (CMO merge, 2026-10-04: content doc v7,
 *  Home safety section), in the site's no-contraction voice.
 *
 *  Every card is now a confirmed fact. The microphone card follows the doc's
 *  Appendix B: the toy has to listen for its wake word, so it is described as
 *  listening for one word rather than as "off". The founder confirmed on
 *  2026-10-04 that Kheelu says it is a toy and never asks a child for a
 *  secret, and that a child's voice goes only to Kheelona's own servers, in
 *  India. */
export const SAFETY_POINTS = [
  {
    Icon: Mic,
    h: "It listens for one word",
    b: "Nothing is recorded or sent until your child says the wake word.",
  },
  {
    Icon: WifiOff,
    h: "It cannot browse the internet",
    b: "It connects only to our own servers. No websites, no videos, no strangers.",
  },
  {
    Icon: MessageSquareText,
    h: "You can read every conversation",
    b: "Word for word, in the parent app. Delete anything with one tap.",
  },
  {
    Icon: ShieldCheck,
    h: "It says it is a toy",
    b: "Kheelu tells your child it is a toy, and it never asks them to keep a secret from you.",
  },
] as const;

/** Where a child's voice goes, in three stops (founder-confirmed 2026-10-04). */
export const VOICE_PATH = ["On the toy", "Our own servers, in India", "Your app"] as const;

/** Home's safety room. Absorbs the old "four promises" room: the data promise
 *  survives in the voice path's small print, and the deep dive stays /safety. */
export function TrustRoom() {
  return (
    <div>
      <Reveal>
        <SectionHeading
          eyebrow="Safety"
          title="What Kheelu can and cannot do."
          titleClassName="mb-3 max-w-[20ch]"
          lede="The four things parents ask us first."
          ledeClassName="mb-10"
        />
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2">
        {SAFETY_POINTS.map(({ Icon, h, b }, i) => (
          <Reveal key={h} delay={i * 0.06}>
            <Card className="h-full border border-line bg-white p-7">
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-orange/15 text-orange-ink">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mb-2 font-display text-[22px] font-extrabold text-ink-head">{h}</h3>
              <p className="text-[16px] leading-relaxed">{b}</p>
            </Card>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10">
        <h3 className="mb-4 font-display text-[19px] font-extrabold text-ink-head">
          Where your child&apos;s voice goes
        </h3>
        <ol className="flex flex-wrap items-center gap-3">
          {VOICE_PATH.map((stop, i) => (
            <li key={stop} className="flex items-center gap-3">
              <span className="rounded-full border border-line bg-white px-4 py-2 text-[15px] font-semibold text-ink-head">
                {stop}
              </span>
              {i < VOICE_PATH.length - 1 ? (
                <ArrowRight className="h-4 w-4 text-ink" aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ol>
        {/* text-ink, not ink-muted: this room sits on the cool wash, where
            ink-muted measures 4.21:1 and fails AA (contrast-tokens bans it). */}
        <p className="mt-4 text-[15px] text-ink">
          Never sold. Story-mode stories and lessons play offline.
        </p>
      </Reveal>
      <Reveal className="mt-8">
        <Button href="/safety" variant="ghost">
          See how safety works
        </Button>
      </Reveal>
    </div>
  );
}
