import type { Metadata } from "next";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { ChatDemo } from "@/components/molecules/ChatDemo";
import { RecognitionStrip } from "@/components/organisms/RecognitionStrip";
import { ParentQuotes } from "@/components/organisms/ParentQuotes";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { FeelingsGallery } from "@/components/organisms/FeelingsGallery";
import {
  Hero,
  Statement,
  TrustRoom,
  Family,
  KheeluOrbit,
  LaunchVideo,
  Compare,
  Journal,
  ParentAppSection,
} from "@/features/home";

export const metadata: Metadata = {
  title: "Lumi by Kheelona: the screen-free AI toy that talks with your child",
  description:
    "Lumi listens first, then talks back, in up to 10 languages you speak at home. No screen. No open internet. You read every word. Reserve at ₹4,999, no payment now.",
  alternates: { canonical: "/" },
};

/* Revamp M2 (theme B "Kheelu's Tour", founder brief 2026-07-24): the page is
   a track of contained rooms on the SiteBackdrop sky, narrated by the
   persistent KheeluGuide (each room's guide/say feeds it; every say line is
   GATED:kheelu-line until founder sign-off — docs/revamp-2026-07/copy-v2.md).
   No section numbering (brief pointer 1). The ambient canvas is dormant
   (StageGate unmounted; the 3D journey remains one prop-flip away in
   features/ambient-stage). Copy: copy-v2 Home, provenance-tagged there. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <RoomsTrack>
        <Room fill="white" guide="curious" say="These folks vouch for us. Real ones." reveal="pop">
          <RecognitionStrip bare safetyLine />
        </Room>

        <Room fill="cream" guide="bliss" say="This is the part we mean the most." reveal="left">
          <Statement />
        </Room>

        <Room fill="white" guide="joy" say="That blue one is Lumi. My best friend." reveal="right">
          <Reveal>
            <SectionHeading title="Watch two friends meet." titleClassName="mb-8" />
          </Reveal>
          <LaunchVideo bare />
        </Room>

        <Room fill="cool" id="trust" guide="curious" say="Read this bit slowly. It's for you, not the kids." reveal="left">
          <TrustRoom />
        </Room>

        <Room fill="white" id="lumi" guide="joy" say="I picked Lumi's colours myself." reveal="right">
          <Family />
        </Room>

        <Room fill="sun" id="warm" guide="bliss" say="That was the careful part. Now the fun." reveal="pop">
          <Reveal>
            <SectionHeading
              title="Here is what a day with Lumi feels like."
              titleClassName="mb-6 max-w-[22ch]"
            />
          </Reveal>
          <KheeluOrbit />
        </Room>

        <Room fill="cool" guide="silly" say="Five feelings. I can act them all out." reveal="left">
          <Reveal>
            <SectionHeading
              eyebrow="Meet the feelings"
              title="Learning starts with feeling understood."
              titleClassName="max-w-[18ch]"
              lede="Lumi knows five feelings. Feeling comes first, and the learning follows."
              ledeClassName="mb-10 mt-4 max-w-[62ch]"
            />
          </Reveal>
          <FeelingsGallery className="mb-10" />
          <div className="grid items-start gap-8 md:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <ChatDemo />
            </Reveal>
            <Reveal delay={0.08}>
              <p className="max-w-[36ch] font-display text-[clamp(19px,1.8vw,23px)] font-bold leading-[1.4] text-ink-head md:pt-6">
                Lumi talks in the languages you speak at home. Up to ten of
                them.
              </p>
            </Reveal>
          </div>
        </Room>

        <Room fill="cream" id="parent-app" guide="bliss" say="You get to see everything. That's the deal." reveal="right">
          <ParentAppSection bare />
        </Room>

        <Room fill="white" guide="curious" say="We did the homework so you don't have to." reveal="left">
          <Compare bare />
        </Room>

        <Room fill="white" id="parent-voices" guide="joy" say="Real families, real words." reveal="right">
          <ParentQuotes bare />
        </Room>

        <Room fill="sun" id="journal" guide="curious" reveal="left">
          <Journal bare />
        </Room>

        <Room
          fill="orange"
          id="reserve"
          guide="silly"
          say="Save your spot. I'll keep Lumi company until launch."
          reveal="pop"
          className="overflow-x-clip"
        >
          <FinaleCTA bare />
        </Room>
      </RoomsTrack>
    </>
  );
}
