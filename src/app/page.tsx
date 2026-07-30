import type { Metadata } from "next";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { ChatDemo } from "@/components/molecules/ChatDemo";
import { FootnotesRow, V3_FOOTNOTES } from "@/components/molecules/FootnotesRow";
import { Faq, type FaqEntry } from "@/components/molecules/Faq";
import { graph, faqPage, breadcrumbs, LAUNCH_VIDEO, LUMI_PRODUCT } from "@/lib/seo";
import { RecognitionStrip } from "@/components/organisms/RecognitionStrip";
import { ParentQuotes } from "@/components/organisms/ParentQuotes";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { FeelingsGallery } from "@/components/organisms/FeelingsGallery";
import { LumiModes } from "@/components/organisms/LumiModes";
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
    "Lumi: the screen-free AI toy that learns with your child, ages 2 to 5 | Kheelona",
  description:
    "Lumi is a screen-free AI toy for ages 2 to 5, made in India. It talks with your child, remembers what they said last time, and moves at their pace, in up to 10 home languages. No screen, no open internet, and you read every word. Reserve at ₹4,999, no payment now.",
  alternates: { canonical: "/" },
};


/* The questions parents actually type, answered on the page a search or an
   answer engine lands on first. Straight from the AEO question bank in
   docs/revamp-2026-07/research.md: almost no authoritative answer exists for
   these in India, which is the opening. Every answer restates published copy,
   40 to 60 words, self-contained enough to be quoted on its own. */
const HOME_FAQ: FaqEntry[] = [
  {
    q: "What is Lumi?",
    a: "Lumi is a screen-free talking toy for children aged 2 to 5. Your child speaks to it and it answers, tells stories, sings, and asks questions back. It has no screen at all, it cannot reach the open internet, and every conversation is readable by you in the parent app.",
  },
  {
    q: "How much does Lumi cost in India?",
    a: "₹4,999 for the first 500 units if you reserve now, and ₹9,999 after launch. You pay nothing today: reserving holds the price and your place in line without committing you to buy. Every Lumi includes 6 months of Kheelona+.",
  },
  {
    q: "What ages is Lumi for?",
    a: "Ages 2 to 5. Lumi meets a two-year-old where they are and grows with them, and the wider family of Kheelona friends carries on to age 14 with the Kheelu Speaker and AI books.",
  },
  {
    q: "Which languages does Lumi speak?",
    a: "The languages you speak at home, up to ten of them, including English, Hindi, and regional Indian languages. Lumi can switch mid-sentence. The full list is announced before launch.",
  },
  {
    q: "Does Lumi need the internet to work?",
    a: "No. Lumi plays offline, so it works on a train or in a village with no signal. You connect only to download new stories and updates, and you choose when.",
  },
  {
    q: "Is an AI toy safe for a small child?",
    a: "It depends entirely on how it is built. Lumi wakes to a word and the microphone is off the rest of the time, the first thinking happens on the toy, answers come from a closed library rather than the open internet, and you can read or delete every conversation.",
  },
];

const HOME_JSON_LD = graph(
  LUMI_PRODUCT,
  LAUNCH_VIDEO,
  faqPage(HOME_FAQ),
  breadcrumbs([]),
);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
      />
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
          {/* Founder call 2026-07-28: name the three modes where a parent is
              already enjoying the day-with-Lumi picture. One toy that talks,
              teaches and plays music is a different purchase from a gadget. */}
          <LumiModes variant="strip" className="mt-12" />
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

        <Room fill="cream" id="questions" guide="bliss" say="Ask me anything. That's literally my job." reveal="left">
          <Reveal>
            <SectionHeading
              title="Questions parents ask first."
              titleClassName="mb-3"
              lede="Straight answers, in plain words. The longer versions live on the Lumi and Safety pages."
              ledeClassName="mb-10 max-w-[58ch]"
            />
          </Reveal>
          <Reveal className="mx-auto max-w-[820px]">
            <Faq items={HOME_FAQ} />
          </Reveal>
        </Room>

        <Room fill="sun" id="journal" guide="curious" reveal="right">
          <Journal bare />
          {/* The page's small print, Apple-style: the two claims that invite a
              follow-up question get their answer here rather than nowhere. */}
          <FootnotesRow items={V3_FOOTNOTES} className="mt-12 border-t border-line-soft pt-6" />
        </Room>

        <Room
          fill="white"
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
