import { cn } from "@/lib/cn";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Card } from "@/components/molecules/Card";

/** The three modes (founder, 2026-07-28).
 *
 *  Why this replaced "Three ways to be there" (Companion / Storyteller /
 *  Teacher): those were personality words, and a parent deciding on a ₹4,999
 *  pre-order is asking a blunter question — what does it actually do. Three
 *  modes answers it, and it answers the value question at the same time. One
 *  toy that talks, teaches and plays music is a different purchase from a
 *  single-trick gadget, which is exactly what the shelf is full of.
 *
 *  All three are already-published behaviour: the conversation is the spine of
 *  the site, Kheelu mode came from the founder's YC application, and Bluetooth
 *  playback was already a card in the what-it-does grid (this section absorbed
 *  it, so it is stated once, properly).
 *
 *  CAREFUL, gate V3-b: Bluetooth mode is presented as a MODE, never as what you
 *  are left with if Kheelona+ lapses. That would be a post-lapse claim, and the
 *  founder has not stated the post-lapse behaviour.
 *
 *  Naming: the parent verb leads because it is what scans; the founder's
 *  product term sits under it as a label. "AI mode" as a small label does not
 *  break the rule about rarely leading with AI. */
export const LUMI_MODES = [
  {
    mode: "AI mode",
    heading: "Talk about anything.",
    /* V6 D4d: the closing WiFi sentence mirrors Kheelu mode's "It works
       offline." — the contrast is legible at a glance (founder-licensed). */
    body: "Your child asks why the sky is blue, and Lumi answers in words they already own, then asks one back. This is the mode they will use most, and the one that grows their vocabulary without anyone calling it a lesson. It runs on your home WiFi.",
    short: "Talk about anything",
  },
  {
    mode: "Kheelu mode",
    heading: "Learn inside a story.",
    body: "Stories and lessons your child can interrupt, question, and be quizzed on. Lumi reads, your child asks why, and Lumi asks one back. It works offline.",
    short: "Learn inside a story",
  },
  {
    mode: "Bluetooth mode",
    heading: "Play your own music.",
    body: "Pair a phone and Lumi becomes the speaker in the room. Your playlist, the rhymes you grew up with, an audiobook for a long car ride.",
    short: "Play your own music",
  },
] as const;

export function LumiModes({
  variant = "cards",
  className,
}: {
  /** "cards" is the full section (/products/lumi); "strip" is the compact
   *  one-line row Home appends to the day-with-Lumi room. */
  variant?: "cards" | "strip";
  className?: string;
}) {
  if (variant === "strip") {
    return (
      <div className={cn("border-t border-line pt-8", className)}>
        <Reveal>
          <p className="mb-5 max-w-[52ch] font-display text-[19px] font-bold text-ink-head">
            One toy, three modes. Your child picks the one they are in the mood
            for.
          </p>
          <ul className="grid gap-3 sm:grid-cols-3">
            {LUMI_MODES.map((m) => (
              <li
                key={m.mode}
                className="rounded-(--radius-card) border border-line bg-white px-5 py-4"
              >
                <p className="font-display text-[17px] font-extrabold text-ink-head">
                  {m.short}
                </p>
                <p className="mt-0.5 text-[13px] font-bold uppercase tracking-wide text-orange-ink">
                  {m.mode}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    );
  }

  return (
    <div className={className}>
      <Reveal>
        <SectionHeading
          eyebrow="One toy, three modes"
          title="Talk with it. Learn with it. Play music through it."
          titleClassName="mb-3 max-w-[24ch]"
          lede="Lumi is not a single trick. The same friend holds a conversation, tells stories that ask questions back, and turns into the speaker for your playlist."
          ledeClassName="mb-10 max-w-[58ch]"
        />
      </Reveal>
      <ul className="grid gap-5 md:grid-cols-3">
        {LUMI_MODES.map((m, i) => (
          <Reveal as="li" key={m.mode} delay={i * 0.05}>
            <Card
              className="h-full border border-line bg-white"
              title={m.heading}
              titleClassName="mb-1 font-display text-[22px] font-extrabold text-ink-head"
            >
              <p className="mb-3 text-[13px] font-bold uppercase tracking-wide text-orange-ink">
                {m.mode}
              </p>
              <p className="text-[16px]">{m.body}</p>
            </Card>
          </Reveal>
        ))}
      </ul>
      <Reveal className="mt-8">
        <p className="max-w-[46ch] font-display text-[19px] font-bold text-ink-head">
          One friend your child talks to, learns from, and dances to.
        </p>
      </Reveal>
    </div>
  );
}
