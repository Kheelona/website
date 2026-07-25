import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { PageHero } from "@/components/templates/PageHero";
import { Reveal } from "@/components/molecules/Reveal";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { STORIES } from "@/lib/stories";

export const metadata: Metadata = {
  title: "Stories: raising curious kids",
  description:
    "Honest reads for parents who want more than a screen: brain development, screen-free living, talking toys, and how to judge AI toys for kids.",
  alternates: { canonical: "/stories" },
};

/* Revamp M4 (theme B): the journal on the room grammar, one room per theme.
   Copy: copy-v2 /STORIES. Cards keep their Kheelu pose art and stay
   tilt-free, because the whole card is the link (hard rule, §8.18). */

/* Fills alternate down the track so each theme reads as its own room; the
   card surface flips with the room so a card never sits on its own colour. */
const ROOM_CYCLE = [
  { fill: "white", card: "bg-cream" },
  { fill: "cream", card: "bg-white" },
  { fill: "cool", card: "bg-white" },
] as const;
const REVEALS = ["left", "right"] as const;

export default function StoriesPage() {
  const themes = [...new Set(STORIES.map((s) => s.theme))];

  return (
    <>
      <PageHero
        guide="curious"
        /* GATED:kheelu-line — founder sign-off before merge to master */
        say="Bedtime reading, but for you."
      >
        <SectionHeading
          as="h1"
          eyebrow="The journal"
          title="Raising curious kids."
          titleClassName="mb-4"
          lede="Plain answers to the questions parents actually ask. No jargon, no scare stories."
        />
      </PageHero>

      <RoomsTrack>
        {themes.map((theme, t) => {
          const room = ROOM_CYCLE[t % ROOM_CYCLE.length];
          return (
          <Room
            key={theme}
            fill={room.fill}
            reveal={REVEALS[t % REVEALS.length]}
          >
            <Reveal>
              <SectionHeading level="minor" title={theme} titleClassName="mb-7" />
            </Reveal>
            <ul className="grid gap-6 md:grid-cols-2">
              {STORIES.filter((s) => s.theme === theme).map((s, i) => (
                <Reveal as="li" key={s.slug} delay={i * 0.06}>
                  {/* no tilt: whole-card links must not move under the cursor
                      (TiltCard.tsx hard rule, R10) */}
                  <Link
                    href={`/stories/${s.slug}`}
                    className={`flex h-full overflow-hidden rounded-(--radius-card) border border-line-soft ${room.card} transition-[transform,box-shadow] duration-300 ease-(--ease-bounce) hover:-translate-y-1.5 hover:shadow-(--shadow-room) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2`}
                  >
                    <div className={`flex w-[130px] shrink-0 items-end justify-center ${s.tint}`}>
                      <Image
                        src={`/mascot/mascot-${s.pose}.png`}
                        alt=""
                        width={120}
                        height={160}
                        sizes="130px"
                        className="h-[110px] w-auto translate-y-1"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="mb-1 font-display text-[22px] font-extrabold leading-tight text-ink-head">
                        {s.title}
                      </h3>
                      <p className="mb-2 text-[15px] text-ink-muted">{s.description}</p>
                      <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
                        {s.minutes} minute read
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </Room>
          );
        })}

        <Room
          fill="orange"
          id="reserve"
          guide="silly"
          /* GATED:kheelu-line */
          say="Save your spot. I'll keep Lumi company until launch."
          reveal="pop"
          className="overflow-x-clip"
        >
          <FinaleCTA bare variant="compact" />
        </Room>
      </RoomsTrack>
    </>
  );
}
