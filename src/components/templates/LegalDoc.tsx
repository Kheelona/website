import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { PageHero } from "@/components/templates/PageHero";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import type { KheeluPose } from "@/lib/kheelu-poses";

export type LegalSection = { readonly h: string; readonly ps: readonly string[] };

/** The quiet legal-page shell (privacy + terms were byte-level clones of
 *  each other before R11): narrow measure, prose loop, and the mandatory
 *  reserve finale (#reserve must exist on every page — R9 law). Pages
 *  shrink to a data array + one call.
 *
 *  Revamp M4: on the theme-B room grammar. The hero opens on the backdrop and
 *  the prose sits in one white room, so the careful pages feel like the same
 *  house as the rest of the site. `guide`/`say` give each page its one quiet
 *  Kheelu line (GATED:kheelu-line). */
export function LegalDoc({
  eyebrow = "The fine print, unfine",
  title,
  lede,
  sections,
  guide,
  say,
}: {
  eyebrow?: string;
  title: string;
  lede: string;
  sections: readonly LegalSection[];
  guide?: KheeluPose;
  say?: string;
}) {
  return (
    <>
      <PageHero guide={guide} say={say}>
        <div className="max-w-[760px]">
          <SectionHeading
            as="h1"
            eyebrow={eyebrow}
            title={title}
            titleClassName="mb-4"
            lede={lede}
            ledeClassName="text-[18px] max-w-[62ch]"
          />
        </div>
      </PageHero>

      <RoomsTrack>
        <Room fill="white">
          <div className="max-w-[720px]">
            {sections.map((s) => (
              <div key={s.h}>
                <h2 className="mb-3 mt-9 font-display text-[24px] font-extrabold text-ink-head first:mt-0">
                  {s.h}
                </h2>
                {s.ps.map((p, i) => (
                  <p key={i} className="mb-4 text-[17px] leading-[1.65]">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </Room>

        <Room
          fill="white"
          id="reserve"
          guide="silly"
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
