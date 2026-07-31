import type { Metadata } from "next";
import Link from "next/link";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { AudioMoments } from "@/components/molecules/AudioMoments";
import { FootnotesRow, Footnote, V3_FOOTNOTES } from "@/components/molecules/FootnotesRow";
import { Faq, type FaqEntry } from "@/components/molecules/Faq";
import { graph, faqPage, breadcrumbs, LUMI_PRODUCT } from "@/lib/seo";
import { AUDIO_MOMENTS } from "@/lib/audio-moments";
import { RecognitionStrip } from "@/components/organisms/RecognitionStrip";
import { ParentQuotes } from "@/components/organisms/ParentQuotes";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { FeelingsGallery } from "@/components/organisms/FeelingsGallery";
import { LumiModes } from "@/components/organisms/LumiModes";
import { HowItWorksLoop, type LoopStep } from "@/components/organisms/HowItWorksLoop";
import { GrowthArc } from "@/components/organisms/GrowthArc";
import {
  PREORDER_HREF,
  RESERVE_LABEL,
  PRICE_CAPTION,
  LUMI_AGES,
} from "@/config/site";
import {
  Hero,
  TrustRoom,
  Family,
  KheeluOrbit,
  Compare,
  Journal,
  ParentAppSection,
} from "@/features/home";

export const metadata: Metadata = {
  title:
    "Lumi: the screen-free AI toy with a tutor inside, ages 2 to 5 | Kheelona",
  description:
    "A best friend at 2, a head start by 5. The screen-free toy that grows with your child, in the languages you speak at home. Reserve at ₹4,999, no payment now.",
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
  /* V6 D3: the parents' own question from the feedback that drove this round,
     kept nearly verbatim — the FAQ that mirrors the reader's exact objection
     is the one they open. */
  {
    q: "What will my child actually get out of Lumi?",
    a: "A friend at 2, and a head start by 5. Lumi answers your child's questions, remembers the words they know, and builds on them the next day: stories, numbers, thinking games, and the languages you speak at home. The parent app counts the new words, so you see the growth, not just the play.",
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
    a: "English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish, and French, with up to ten languages at launch. Lumi can switch mid-sentence, in the languages you speak at home.",
  },
  {
    q: "When does Lumi ship?",
    a: "Shipping starts 1 September 2026. Reserving now holds the launch price of ₹4,999 and your place in line, and you pay nothing today.",
  },
  /* V6 D4a (founder-licensed fact): mode-precise. The old flat "No" was a
     post-purchase complaint in waiting — a precise admission converts better
     than a broad claim. */
  {
    q: "Does Lumi need the internet to work?",
    a: "For open conversation, yes: AI mode runs on your home WiFi. For everything else, no: Kheelu-mode stories and lessons play offline, and Bluetooth music needs only a paired phone. On a train or anywhere without a signal, your child still has stories to interrupt, question, and be quizzed on.",
  },
  /* V6 D7: opens with the same honest verdict as the /safety flagship answer,
     so the two pages agree in substance and differ only in length. */
  {
    q: "Is an AI toy safe for a small child?",
    a: "Not all of them are, and the difference is in how they are built. Lumi wakes to a word and the microphone is off the rest of the time, the first thinking happens on the toy, answers come from a closed library rather than the open internet, and you can read or delete every conversation.",
  },
];

/* V4 (D7): the VideoObject left this graph with the film — schema mirrors
   visible content only, and the film is no longer on the page. */
const HOME_JSON_LD = graph(
  LUMI_PRODUCT,
  faqPage(HOME_FAQ),
  breadcrumbs([]),
);

/* The team's How-It-Works sequence (BUILD-V4 §3 F4), typos mended, with the
   LumiModes naming convention: the parent verb leads, the term follows. */
const LOOP_STEPS: readonly LoopStep[] = [
  {
    title: "Talk and play",
    label: "Step 1",
    body: "Your child asks questions, plays word games, and listens to stories that talk back, in their own language.",
  },
  {
    title: "Lumi remembers",
    label: "Step 2 · Adaptive memory",
    body: "Lumi keeps track of the words your child knows, what they love, and the pace they learn at.",
  },
  {
    title: "Knowledge that sticks",
    label: "Step 3 · Real-world learning",
    body: "New ideas arrive inside everyday conversation, not forced drills.",
  },
];

/* V4 recomposition (team feedback 2026-07-30, BUILD-V4 §3): the argument now
   runs claim → proof → HEAR IT (real audio) → how it works → the day → trust
   → the age arc → feelings → the parent's view → comparison → proof → the
   ask. Two team verdicts shaped it: "too much content, less value" (four
   heavy rooms out, two lighter ones in) and "show, don't tell" (the audio IS
   the concept section). Every say line is GATED:kheelu-line until founder
   sign-off, and V4's §5.1 caps them at 48 characters for the right-corner
   bubble. Copy provenance: BUILD-V4 §3. */
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
          <RecognitionStrip bare />
        </Room>

        {/* Hear it (the concept, demonstrated): real Lumi audio replaces the
            old statement room — the team asked for the product's own voice
            where the manifesto used to be. */}
        <Room
          fill="cream"
          id="learning"
          guide="joy"
          say="Go on, press play. That's my best friend."
          reveal="left"
        >
          <Reveal>
            <SectionHeading
              eyebrow="Hear it for yourself"
              title="Play, learn, together."
              titleClassName="mb-3"
              lede="Lumi teaches in the way your child likes. Press play and listen in."
              ledeClassName="mb-10 max-w-[58ch]"
            />
          </Reveal>
          <Reveal>
            <AudioMoments moments={AUDIO_MOMENTS} />
          </Reveal>
          <Reveal className="mt-7">
            <p className="text-[16px] text-ink-muted">
              In the languages you speak at home, up to ten of them.
              <Footnote n={1} id="fn-languages" />
            </p>
          </Reveal>
          {/* V6 D6: the first language line on the site that names what the
              child GAINS rather than what the toy does — and it points the
              bilingual-intent parent at the journal page that already ranks
              first in India for exactly this worry. */}
          <Reveal className="mt-4">
            <p className="max-w-[64ch] text-[16px] text-ink-muted">
              A child who can wonder in their own words wonders more, and a
              child who plays in two languages keeps both. Why that matters for
              years to come:{" "}
              <Link
                href="/stories/raising-a-bilingual-child-in-india"
                className="rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                Raising a bilingual child in India
              </Link>
              .
            </p>
          </Reveal>
          {/* the strongest fold carries the ask (Apple-tier rule) */}
          <Reveal className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button href={PREORDER_HREF}>{RESERVE_LABEL}</Button>
            <p className="text-[15px] text-ink-muted">{PRICE_CAPTION}</p>
          </Reveal>
        </Room>

        {/* How it works: the team's three-step sequence, drawn as the loop it
            is. Serve-and-return survives as this room's closing science. */}
        <Room
          fill="white"
          guide="curious"
          say="Round and round we go. Cleverer every lap."
          reveal="right"
        >
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title="A loop that learns your child."
              titleClassName="mb-3"
              lede="Three steps, then it repeats. Every round fits your child a little better."
              ledeClassName="mb-10 max-w-[58ch]"
            />
          </Reveal>
          <Reveal>
            <HowItWorksLoop
              steps={LOOP_STEPS}
              repeatNote="Then it begins again, one level wiser."
            />
          </Reveal>
          <Reveal className="mt-9">
            <p className="max-w-[64ch] text-[16px] text-ink-muted">
              Researchers call this serve and return, the back and forth that
              builds language and thinking in the years the brain grows
              fastest.{" "}
              <Link
                href="/stories/how-children-learn-by-talking"
                className="rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                Read the science in the journal
              </Link>
            </p>
          </Reveal>
        </Room>

        {/* The growth arc (V6 D2): what the loop above adds up to — the
            year-by-year answer to "what does my child get by 5". Say line
            founder-approved at the V6 spec review. */}
        <Room
          fill="cream"
          id="growth"
          guide="joy"
          say="From first words to big ideas. I'm there."
          reveal="left"
        >
          <Reveal>
            <SectionHeading
              eyebrow={`From ${LUMI_AGES}`}
              title="What your child gets, year by year."
              titleClassName="mb-3"
              lede="Lumi remembers what your child knows and asks the next question. Here is how the same friend meets them at every age."
              ledeClassName="mb-10 max-w-[58ch]"
            />
          </Reveal>
          <GrowthArc />
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

        <Room fill="cool" id="trust" guide="curious" say="This bit is for you, not the kids." reveal="right">
          <TrustRoom />
        </Room>

        <Room
          fill="white"
          id="lumi"
          guide="joy"
          say="The Speaker is my cousin. Better at maths."
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
              lede="Kheelu acts out the five feelings Lumi knows. Feeling comes first, and the learning follows."
              ledeClassName="mb-10 mt-4 max-w-[62ch]"
            />
          </Reveal>
          <FeelingsGallery />
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
          say="Save your spot. I'll mind Lumi till launch."
          reveal="pop"
          className="overflow-x-clip"
        >
          <FinaleCTA bare />
        </Room>
      </RoomsTrack>
    </>
  );
}
