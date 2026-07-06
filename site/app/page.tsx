import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/Hero";
import { WhyWeExist } from "@/components/sections/home/WhyWeExist";
import { Feelings } from "@/components/sections/home/Feelings";
import { MeetLumi } from "@/components/sections/home/MeetLumi";
import { PlayOSHome } from "@/components/sections/home/PlayOSHome";
import { Compare } from "@/components/sections/home/Compare";
import { SafetyStrip } from "@/components/sections/home/SafetyStrip";
import { ParentVoices } from "@/components/sections/home/ParentVoices";
import { Journal } from "@/components/sections/home/Journal";
import { FinaleCTA } from "@/components/sections/home/FinaleCTA";

export const metadata: Metadata = {
  title: "Lumi by Kheelona: the screen-free AI robot toy for ages 3 to 6",
  description:
    "Lumi is a screen-free AI robot toy that listens first, then talks back, in all 10 languages you speak at home. A talking toy for real brain development. Reserve at ₹4,999.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyWeExist />
      <Feelings />
      <MeetLumi />
      <PlayOSHome />
      <Compare />
      <SafetyStrip />
      <ParentVoices />
      <Journal />
      <FinaleCTA />
    </>
  );
}
