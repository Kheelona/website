import { ArrowRight, MessageSquareText, Mic, ShieldCheck, WifiOff } from "lucide-react";
import { TextLink } from "@/components/molecules/TextLink";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Card } from "@/components/molecules/Card";
import { SAFETY_POINTS, VOICE_PATH, VOICE_PATH_NOTE } from "@/lib/safety";

/* The facts live in lib/safety.ts, shared with /safety (founder, 2026-10-04:
   every page in sync). This room only picks the icons. */
const ICONS = {
  mic: Mic,
  "no-internet": WifiOff,
  log: MessageSquareText,
  toy: ShieldCheck,
} as const;

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
        {SAFETY_POINTS.map(({ icon, title: h, body: b }, i) => {
          const Icon = ICONS[icon];
          return (
          <Reveal key={h} delay={i * 0.06}>
            <Card className="h-full border border-line bg-white p-7">
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-orange/15 text-orange">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mb-2 font-display text-[22px] font-extrabold text-ink-head">{h}</h3>
              <p className="text-[16px] leading-relaxed">{b}</p>
            </Card>
          </Reveal>
          );
        })}
      </div>
      <Reveal className="mt-10">
        <h3 className="mb-4 font-display text-[19px] font-extrabold text-ink-head">
          Where your child&apos;s voice goes
        </h3>
        <ol className="flex flex-wrap items-center gap-3">
          {VOICE_PATH.map(({ title: stop }, i) => (
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
          {VOICE_PATH_NOTE}
        </p>
      </Reveal>
      <Reveal className="mt-8">
        <TextLink href="/safety">See how safety works</TextLink>
      </Reveal>
    </div>
  );
}
