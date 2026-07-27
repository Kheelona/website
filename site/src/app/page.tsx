import type { Metadata } from "next";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { ChatDemo } from "@/components/molecules/ChatDemo";
import { FootnotesRow, V3_FOOTNOTES } from "@/components/molecules/FootnotesRow";
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
  LearningRoom,
  BrainRoom,
  Compare,
  Journal,
  ParentAppSection,
} from "@/features/home";

export const metadata: Metadata = {
  title:
    "Lumi by Kheelona: the screen-free friend that learns with your child, ages 2 to 5",
  description:
    "Lumi talks with your child, remembers what they said last time, and moves at their pace, in up to 10 home languages. No screen. You read every word. Reserve at ₹4,999, no payment now.",
  alternates: { canonical: "/" },
};

/* Revamp M2 (theme B "Kheelu's Tour") + V3 repositioning (founder 2026-07-27,
   from the YC application): the page is a track of contained rooms on the
   SiteBackdrop sky, narrated by the persistent KheeluGuide, and the argument
   now runs fun → learning → why talking works → trust → the age arc → the
   parent's view → the comparison → proof → the ask. Positioning mix is 40%
   fun, 20% brain development, 40% education; the companion story still leads,
   because that is what a child sees and what a parent falls for first.
   Every say line is GATED:kheelu-line until founder sign-off (queue:
   docs/revamp-2026-07/BUILD-V3.md §6.4). Copy provenance: BUILD-V3 §3. */
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

        {/* Fun (40%): the day a child actually has */}
        <Room fill="sun" id="warm" guide="bliss" say="That was the careful part. Now the fun." reveal="pop">
          <Reveal>
            <SectionHeading
              title="Here is what a day with Lumi feels like."
              titleClassName="mb-6 max-w-[22ch]"
            />
          </Reveal>
          <KheeluOrbit />
        </Room>

        {/* Education (40%): the mechanism, not the adjective */}
        <Room
          fill="white"
          id="learning"
          guide="curious"
          say="This is the part where the games are secretly lessons."
          reveal="right"
        >
          <LearningRoom />
        </Room>

        {/* Brain development (20%): why any of this counts */}
        <Room fill="cream" reveal="left">
          <BrainRoom />
        </Room>

        <Room fill="cool" id="trust" guide="curious" say="Read this bit slowly. It's for you, not the kids." reveal="right">
          <TrustRoom />
        </Room>

        <Room
          fill="white"
          id="lumi"
          guide="joy"
          say="The Speaker is my cousin. Louder, and better at maths."
          reveal="left"
        >
          <Family />
        </Room>

        <Room fill="cool" guide="silly" say="Five feelings. I can act them all out." reveal="right">
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

        <Room fill="cream" id="parent-app" guide="bliss" say="You get to see everything. That's the deal." reveal="left">
          <ParentAppSection bare />
        </Room>

        <Room fill="white" guide="curious" say="We did the homework so you don't have to." reveal="right">
          <Compare bare />
        </Room>

        <Room fill="white" id="parent-voices" guide="joy" say="Real families, real words." reveal="left">
          <ParentQuotes bare />
        </Room>

        <Room fill="sun" id="journal" guide="curious" reveal="right">
          <Journal bare />
          {/* The page's small print, Apple-style: the two claims that invite a
              follow-up question get their answer here rather than nowhere. */}
          <FootnotesRow items={V3_FOOTNOTES} className="mt-12 border-t border-line-soft pt-6" />
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
