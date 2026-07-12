import type { Metadata } from "next";
import { Beat } from "@/components/atoms/Beat";
import { StageGate } from "@/features/ambient-stage";
import { RecognitionStrip } from "@/components/organisms/RecognitionStrip";
import { ParentQuotes } from "@/components/organisms/ParentQuotes";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import {
  Hero,
  KheeluIntro,
  WhyWeExist,
  LaunchVideo,
  Feelings,
  MeetLumi,
  WhatLumiDoes,
  HowItWorks,
  Compare,
  SafetyCallout,
  SafetyStrip,
  Journal,
  ParentAppSection,
} from "@/features/home";

export const metadata: Metadata = {
  title: "Lumi by Kheelona: the screen-free AI robot toy for ages 3 to 6",
  description:
    "Lumi is a screen-free AI robot toy that listens first, then talks back, in all 10 languages you speak at home. A talking toy for real brain development. Reserve at ₹4,999.",
  alternates: { canonical: "/" },
};

/* Home rides the calm ambient stage since R5 (founder 2026-07-10: the flying
   journey shapes overwhelmed the story; the /playos ambient treatment was the
   approved register). The sky glides smoothly through the page's own washes,
   a few ghosted shapes drift far from the copy, and the 2D mascot + Lumi art
   stays in the DOM permanently. The full 3D journey (ThreeStage + GLBs) is
   dormant, one prop-flip away: <StageGate stage="journey" /> brings it back.
   The <Beat> wrappers stay so the journey's beat mapping still fits. */
export default function HomePage() {
  return (
    <>
      <Beat id="hero" anchor="hero">
        <Hero />
      </Beat>
      {/* R7/R9 sections ride outside the <Beat> map: the dormant journey's
          beat indices stay untouched; if the journey ever returns, beats get
          retuned in the same pass. */}
      <RecognitionStrip safetyLine />
      <KheeluIntro />
      {/* R10: StagedIntro retired — its sentences live in the hero again;
          the dormant journey's "intro" beat gets retuned if it returns */}
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
        <WhatLumiDoes />
      </Beat>
      <HowItWorks />
      <Beat id="compare" anchor="compare">
        <Compare />
      </Beat>
      <SafetyCallout />
      <Beat id="safety">
        <SafetyStrip />
      </Beat>
      {/* ParentQuotes replaced the unmounted ParentVoices (R7): the quotes
          are real, attributed, and founder-published on kheelona.ai — the
          claims-testimonials blocker is resolved. */}
      <ParentQuotes />
      <ParentAppSection from="white" kheelu />
      <Beat id="journal">
        <Journal />
      </Beat>
      <Beat id="reserve">
        <FinaleCTA
          variant="full"
          from="sun"
          kheeluLine="Save your spot. I will keep Lumi company until launch."
        />
      </Beat>

      <StageGate stage="ambient" />
    </>
  );
}
