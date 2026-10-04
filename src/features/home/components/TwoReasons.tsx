import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/molecules/Reveal";
import { PhoneFrame } from "@/components/molecules/PhoneFrame";
import { Footnote } from "@/components/molecules/FootnotesRow";
import { KHEELU_LANGUAGES } from "@/config/site";

/* Each language in its own script, tagged so a screen reader switches voice.
   Keyed by the English name in KHEELU_LANGUAGES; a language added there
   without an entry here still renders, in English. */
const NATIVE: Record<string, { name: string; lang: string }> = {
  English: { name: "English", lang: "en" },
  Hindi: { name: "हिन्दी", lang: "hi" },
  Bengali: { name: "বাংলা", lang: "bn" },
  Telugu: { name: "తెలుగు", lang: "te" },
  Tamil: { name: "தமிழ்", lang: "ta" },
  Kannada: { name: "ಕನ್ನಡ", lang: "kn" },
  Spanish: { name: "Español", lang: "es" },
  French: { name: "Français", lang: "fr" },
};

/** The parent-app chips, verbatim from the kheelona.ai parent-app section (R7). */
const APP_CHIPS = [
  "Summary & notifications",
  "Conversation log",
  "Filter topics",
  "Reinforce cultural values",
  "Parenting philosophy, in one prompt",
] as const;

const CARD = "flex h-full flex-col rounded-(--radius-card) border border-line bg-white p-7";
const TITLE = "mb-3 font-display text-[clamp(21px,2.2vw,26px)] font-extrabold leading-tight text-ink-head";
const LINK =
  "rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2";

/** "Two more things to know" (CMO merge, 2026-10-04): the mockup's languages
 *  and parent-app pair. Two deliberate changes from the branch:
 *  - BOTH CARDS ALWAYS RENDER. The branch hid one behind a phone-only toggle;
 *    stacking them costs a scroll and keeps every word in the HTML.
 *  - THE PARENT APP IS THE REAL SCREENSHOT. The branch drew sample screens
 *    with a "bedtime stories only after 7 pm" control nobody has confirmed;
 *    the real dashboard and the published chips claim nothing new.
 *
 *  The languages card also inherits two jobs from the old learning room,
 *  and both are load-bearing: Home's ONLY footnote-1 marker (delete it and
 *  the note at the page bottom is orphaned) and Home's ONLY internal link to
 *  the article that ranks first in India for raising a bilingual child. */
export function TwoReasons() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Reveal>
        <article className={CARD}>
          <h3 className={TITLE}>It talks in your family&apos;s languages</h3>
          <p className="mb-5 text-[16px]">
            Kheelu can switch languages mid-sentence, the way most of us do at home. So your child
            keeps using the languages your family speaks, with you and with their grandparents.
          </p>
          <ul aria-label="Languages" className="mb-4 flex flex-wrap gap-2">
            {KHEELU_LANGUAGES.map((l) => {
              const n = NATIVE[l] ?? { name: l, lang: "en" };
              return (
                <li
                  key={l}
                  lang={n.lang}
                  className="flex min-h-11 items-center rounded-full border border-line bg-cream px-4 text-[15px] font-semibold text-ink-head"
                >
                  {n.name}
                </li>
              );
            })}
          </ul>
          <p className="mb-5 text-[15px] text-ink-muted">
            {KHEELU_LANGUAGES.length} named today, up to 10 at launch.
            <Footnote n={1} id="fn-languages" />
          </p>
          <p className="mt-auto max-w-[58ch] text-[15px] text-ink-muted">
            A child who plays in two languages keeps both. Why that matters for years to come:{" "}
            <Link href="/stories/raising-a-bilingual-child-in-india" className={LINK}>
              Raising a bilingual child in India
            </Link>
            .
          </p>
        </article>
      </Reveal>
      <Reveal>
        <article className={CARD}>
          <h3 className={TITLE}>You see what your child talked about</h3>
          <p className="mb-5 text-[16px]">
            Open the app for a daily summary, the full conversation log, and one simple thing to do
            together each day. The new words your child learned are counted for you.
          </p>
          <div className="mb-6 grid items-center gap-6 sm:grid-cols-[auto_1fr]">
            {/* min-w-0: the frame's fixed px width must not set the grid
                track's minimum and widen a 320px phone (M4 mobile pass). */}
            <div className="flex min-w-0 justify-center">
              <PhoneFrame
                src="/app/dashboard.png"
                alt="The Kheelona parent app dashboard showing a child's interests and conversation activity"
                width={200}
              />
            </div>
            <ul className="flex flex-wrap gap-2">
              {APP_CHIPS.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-line bg-cream px-4 py-2 text-[15px] font-medium text-ink-head"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/products/kheelu#parent-app"
            className="mt-auto inline-flex items-center gap-1.5 self-start rounded font-bold text-orange-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
          >
            See what the app shows you
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </article>
      </Reveal>
    </div>
  );
}
