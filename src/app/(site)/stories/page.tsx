import Image from "next/image";
import Link from "next/link";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { PageHero } from "@/components/templates/PageHero";
import { Reveal } from "@/components/molecules/Reveal";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { STORIES } from "@/lib/stories";
import { PRESS_LIFT } from "@/lib/interactions";
import { pageGraph, breadcrumbs, SITE_URL, pageMeta, jsonLd } from "@/lib/seo";
import { JOURNAL_REVIEWED } from "@/config/site";

export const metadata = pageMeta({
  title: "Stories: raising curious kids",
  description:
    "Honest reads for parents who want more than a screen: brain development, screen-free living, talking toys, and how to judge AI toys for kids.",
  path: "/stories",
});

/* Revamp M4 (theme B): the journal on the room grammar, one room per theme.
   Copy: copy-v2 /STORIES. Cards stay tilt-free, because the whole card is
   the link (hard rule, §8.18).
   V4-c (founder ask, 2026-07-31): cards LEAD WITH THE STORY'S OWN HERO —
   12 of 19 articles now carry editorial photography, and a page of repeating
   mascot poses read as "generic Lumi image" to the team. The hero sits as a
   16:9 top band (the journal's native crop); the 7 articles still without
   art keep the pose-on-tint treatment in the same band, so the grid stays
   even and the remaining prompts (docs/stories-image-prompts.md) slot in
   with zero layout work. The old narrow art column is gone, which also
   retires the M4-b 104px-at-320px workaround it needed. */

/* Fills alternate down the track so each theme reads as its own room; the
   card surface flips with the room so a card never sits on its own colour. */
const ROOM_CYCLE = [
  { fill: "white", card: "bg-cream" },
  { fill: "cream", card: "bg-white" },
  { fill: "cool", card: "bg-white" },
] as const;
const REVEALS = ["left", "right"] as const;

const JOURNAL_JSON_LD = pageGraph(
  {
    "@type": "Blog",
    "@id": `${SITE_URL}/stories#blog`,
    name: "The Kheelona journal",
    description:
      "Plain answers for parents on screen time, how children learn by talking, language at home, and how to judge an AI toy.",
    url: `${SITE_URL}/stories`,
    inLanguage: "en-IN",
    publisher: { "@id": `${SITE_URL}/#organization` },
    blogPost: STORIES.map((s) => ({
      "@type": "BlogPosting",
      headline: s.title,
      description: s.description,
      url: `${SITE_URL}/stories/${s.slug}`,
      author: { "@type": "Person", name: s.author, url: `${SITE_URL}/team` },
      ...(s.hero ? { image: `${SITE_URL}${s.hero}` } : {}),
    })),
  },
  breadcrumbs([{ name: "Stories", path: "/stories" }]),
);

export default function StoriesPage() {
  const themes = [...new Set(STORIES.map((s) => s.theme))];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(JOURNAL_JSON_LD) }}
      />
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
          lede={`Plain answers to the questions parents actually ask. No jargon, no scare stories. Reviewed ${JOURNAL_REVIEWED}.`}
        />
      </PageHero>

      <RoomsTrack>
        {themes.map((theme, t) => {
          const room = ROOM_CYCLE[t % ROOM_CYCLE.length];
          return (
          <Room
            key={theme}
            fill={room.fill}
            /* The FIRST room owns this page's LCP: its hero is copy-only, so
               the largest element in the opening viewport is a card inside room
               one. A directional reveal holds that at opacity 0 until the
               observer hydrates, which measured a 4.3s LCP on throttled mobile
               (Lighthouse 85). Room.tsx already carries the rule — reveals are
               for BELOW-fold rooms — this makes the loop obey it. */
            reveal={t === 0 ? "none" : REVEALS[t % REVEALS.length]}
          >
            <Reveal>
              <SectionHeading level="minor" title={theme} titleClassName="mb-7" />
            </Reveal>
            <ul className="grid gap-6 md:grid-cols-2">
              {STORIES.filter((s) => s.theme === theme).map((s, i) => (
                <Reveal as="li" key={s.slug} delay={i * 0.06}>
                  {/* no tilt: whole-card links must not move under the cursor
                      (TiltCard.tsx hard rule, R10). The lift-on-hover is not
                      pointer-tracked, so it stays. */}
                  <Link
                    href={`/stories/${s.slug}`}
                    className={`group flex h-full flex-col overflow-hidden rounded-(--radius-card) border border-line ${room.card} ${PRESS_LIFT} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2`}
                  >
                    {s.hero ? (
                      <div className="aspect-[16/9] w-full overflow-hidden">
                        <Image
                          src={s.hero}
                          alt=""
                          width={1440}
                          height={803}
                          sizes="(max-width: 767px) 92vw, 520px"
                          /* the first card of the first room is this page's
                             LCP (copy-only hero, room one reveal-free) —
                             priority keeps the QA law honest now that the
                             LCP element is a photo */
                          priority={t === 0 && i === 0}
                          className="h-full w-full object-cover transition-transform duration-500 ease-(--ease-calm) motion-safe:group-hover:scale-[1.03]"
                        />
                      </div>
                    ) : (
                      <div className={`flex aspect-[16/9] w-full items-end justify-center overflow-hidden ${s.tint}`}>
                        <Image
                          src={`/mascot/mascot-${s.pose}.png`}
                          alt=""
                          width={120}
                          height={160}
                          sizes="130px"
                          className="h-[120px] w-auto translate-y-1"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h3 className="mb-1 font-display text-[22px] font-extrabold leading-tight text-ink-head">
                        {s.title}
                      </h3>
                      <p className="mb-3 text-[15px] text-ink-muted">{s.description}</p>
                      <p className="mt-auto text-[13px] font-semibold uppercase tracking-wide text-orange-ink">
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
          fill="white"
          id="reserve"
          guide="silly"
          /* GATED:kheelu-line */
          say="Save your spot. I'll mind Lumi till launch."
          reveal="pop"
          className="overflow-x-clip"
        >
          <FinaleCTA bare variant="compact" />
        </Room>
      </RoomsTrack>
    </>
  );
}
