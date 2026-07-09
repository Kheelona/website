import type { Metadata } from "next";
import { Beat } from "@/components/layout/Beat";
import { StageGate } from "@/components/three/StageGate";
import { Hero } from "@/components/sections/home/Hero";
import { StagedIntro } from "@/components/sections/home/StagedIntro";
import { LaunchVideo } from "@/components/sections/home/LaunchVideo";
import { WhyWeExist } from "@/components/sections/home/WhyWeExist";
import { Feelings } from "@/components/sections/home/Feelings";
import { MeetLumi } from "@/components/sections/home/MeetLumi";
import { PlayOSHome } from "@/components/sections/home/PlayOSHome";
import { Compare } from "@/components/sections/home/Compare";
import { SafetyStrip } from "@/components/sections/home/SafetyStrip";
import { Journal } from "@/components/sections/home/Journal";
import { FinaleCTA } from "@/components/sections/home/FinaleCTA";

export const metadata: Metadata = {
  title: "Lumi by Kheelona: the screen-free AI robot toy for ages 3 to 6",
  description:
    "Lumi is a screen-free AI robot toy that listens first, then talks back, in all 10 languages you speak at home. A talking toy for real brain development. Reserve at ₹4,999.",
  alternates: { canonical: "/" },
};

/* Home is one continuous journey (redesign: Direction 1 "Lumi's World" with
   Pop-up Storybook elements). Every beat below is a place in the world; the
   <Beat> order MUST match the place indices in components/three/ThreeStage.
   Copy and section components are unchanged: the 3D stage is a decorative
   layer that mounts behind them (StageGate) and the washes hand off to it. */
export default function HomePage() {
  return (
    <>
      <Beat id="hero" anchor="hero">
        <Hero />
      </Beat>
      <Beat id="intro">
        <StagedIntro />
      </Beat>
      <Beat id="film">
        <LaunchVideo />
      </Beat>
      <Beat id="why" anchor="why">
        <WhyWeExist />
      </Beat>
      <Beat id="feelings" anchor="feelings">
        <Feelings />
      </Beat>
      <Beat id="lumi">
        <MeetLumi />
      </Beat>
      <Beat id="playos">
        <PlayOSHome />
      </Beat>
      <Beat id="compare" anchor="compare">
        <Compare />
      </Beat>
      <Beat id="safety">
        <SafetyStrip />
      </Beat>
      {/* ParentVoices intentionally unmounted until real testimonials arrive
          (claims-testimonials blocker): the review round found the empty
          placeholders read as vaporware two sections before the ask. */}
      <Beat id="journal">
        <Journal />
      </Beat>
      <Beat id="reserve">
        <FinaleCTA variant="full" from="sun" />
      </Beat>

      <StageGate />
    </>
  );
}
