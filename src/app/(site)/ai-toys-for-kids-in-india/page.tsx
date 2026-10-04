import Image from "next/image";
import Link from "next/link";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { AnswerBlock } from "@/components/molecules/AnswerBlock";
import { SpecTable } from "@/components/molecules/SpecTable";
import { CompareTable } from "@/components/molecules/CompareTable";
import { StepList } from "@/components/molecules/StepList";
import { Reveal } from "@/components/molecules/Reveal";
import { Faq, type FaqEntry } from "@/components/molecules/Faq";
import { PageHero } from "@/components/templates/PageHero";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { pageGraph, faqPage, breadcrumbs, pageMeta, jsonLd } from "@/lib/seo";
import { KHEELU_ART, kheeluAlt } from "@/lib/kheelu-art";
import {
  KHEELU_AGES,
  LANGUAGES_LINE,
  LAUNCH_PRICE,
  FULL_PRICE,
  TOKEN_PRICE,
  CAP_UNITS_TEXT,
  SHIP_DATE_TEXT,
} from "@/config/site";

/** The buyer's guide (SEO/AEO/GEO round 2026-09-11, §8.36-b).
 *
 *  WHY THIS ROUTE EXISTS, and why it is shaped the way it is.
 *
 *  Measured on Perplexity, 2026-09-11, for "best AI toy for a 4 year old in
 *  India": five products named, Kheelona in none of them, and four of the
 *  eleven citations were the vendors' OWN product pages. A brand page can be
 *  the answer to this question. Nothing on kheelona.com was shaped like an
 *  answer to it, because every page here is either about the product or about
 *  parenting, and the question a parent actually asks an answer engine sits
 *  between the two: how do I choose one of these at all.
 *
 *  Measured in Keyword Planner the same day, India, twelve months: every "AI
 *  toy" phrasing returns NO DATA. So this page is not a Google play, and
 *  pretending otherwise would be the kind of keyword theatre that produced
 *  nineteen journal pieces earning zero impressions between them. It is aimed
 *  at the retrieval layer, where the demand demonstrably is. The terms that DO
 *  carry Indian volume — learning and educational toys for 3-year-olds at 1k to
 *  10k a month, toys that talk back at 100 to 1k — are served in the copy
 *  below where they are honest, and are the job of the journal besides.
 *
 *  THE ONE HARD CONSTRAINT: no competitor is named and no competitor's
 *  specification appears. Not because it would not rank, but because this site
 *  cannot verify another company's child-safety behaviour, and publishing a
 *  wrong number about how a rival's toy handles a three-year-old's voice is the
 *  exact trust failure the brand veto exists to prevent. The comparison here is
 *  CATEGORY-level (the existing CompareTable), and every specific number is our
 *  own. If verified rival specs ever arrive from the founder, this is the page
 *  they belong on.
 *
 *  Composed entirely from the registry: PageHero, AnswerBlock, SpecTable,
 *  CompareTable, StepList, Faq, FinaleCTA. Nothing new was hand-rolled. */

export const metadata = pageMeta({
  title: "AI toys for kids in India: how to choose one",
  /* Spec-dense on purpose. Every competitor snippet Perplexity lifted on
     2026-09-11 carried a price, an age and a language count in the description;
     ours carried a sentence about warmth. 158 characters, under the 160 guard. */
  description:
    "Five checks before you buy an AI toy for a 3 to 5 year old in India, and how Kheelu answers each one: no screen, wake-word mic, 8 languages, from ₹4,999.",
  path: "/ai-toys-for-kids-in-india",
});

/* The five checks. These are the same five as the journal's
   `what-to-look-for-in-a-safe-ai-toy`, deliberately: that piece argues them at
   length for a parent reading in the evening, and this page states them as a
   checklist for a parent deciding on a Sunday. Same claims, same sources, two
   jobs. The article is linked from here so neither page has to be both. */
const CHECKS = [
  {
    n: "01",
    title: "When is the microphone on?",
    body: "The only good answer is: when your child invites it. Look for wake-word listening and a plain explanation of what happens the rest of the time. Off should mean off, not muted and waiting.",
  },
  {
    n: "02",
    title: "Can it reach the open internet?",
    body: "A toy that can browse can stumble. Ask where the answers come from. If the answer is a general chatbot with a filter on top, the filter is doing all the work, and filters leak.",
  },
  {
    n: "03",
    title: "Can you read everything it said?",
    body: "Every conversation should be readable by you, word for word, and deletable by you, in one tap, without emailing anyone. A summary is not a transcript.",
  },
  {
    n: "04",
    title: "Where does your child's voice go?",
    body: "Ask where recordings are stored and in which country, who at the company can hear them, and whether they are ever sold or used to advertise. India's DPDP Act already answers the last one for you.",
  },
  {
    n: "05",
    title: "Is it built for your child's age?",
    body: "A toy sold for small children should filter every reply for the age of the child holding it, and the maker should be able to say how. Ask what it does when it does not know something. The honest answer is that it says so.",
  },
] as const;

/* The two answers that lead, in visible copy (the /safety pattern, §8.23-"one
   idea one statement"). They are rendered as AnswerBlocks AND folded into the
   FAQPage schema below from this same object, so the page never asks a question
   twice — an earlier draft of this file carried "What is an AI toy?" as both an
   opening answer and an accordion row, which is the duplication that law
   exists to catch. FAQPage may only ever describe copy a reader can see, which
   is exactly what this arrangement guarantees. */
const ANSWERS = {
  whatIs: {
    q: "What is an AI toy?",
    a: "A toy with a language model inside it, so it can hold a conversation instead of playing a recording. The useful test is whether it can answer something it has never heard before. A soundboard has a list; a talking toy has a reply. Everything else in this guide follows from which one you are holding.",
  },
  limits: {
    q: "What Kheelu cannot claim yet",
    a: "Kheelu has not shipped. That means no toy-safety certificate has been issued to us, there are no reviews from families who have lived with one, and battery life and warranty terms are not published because they are not final. All three will be published here in full when they exist, and none of them will be claimed before they are earned.",
  },
} as const;

const FAQ_ITEMS: FaqEntry[] = [
  {
    q: "Are AI toys safe for a 3 year old?",
    a: "It depends entirely on the toy, which is an unsatisfying answer, so here is the useful version. Safety in this category is not a badge, it is five mechanisms: when the microphone is on, whether the toy can reach the open internet, whether you can read every word it said, where the voice data is stored, and whether replies are filtered for your child's age. A maker who can answer all five plainly has built for safety. One who answers with adjectives has not.",
  },
  {
    q: "Is an AI toy better than a tablet for a small child?",
    a: "They are different things. A tablet gives your child something to watch, and the research on screen time at this age is consistent enough that both the WHO and the AAP put a number on it. A talking toy gives your child something to answer. The value is not that one is virtuous and the other is not, it is that conversation is the thing that builds language and a screen mostly is not.",
  },
  {
    q: "What should an AI toy cost in India?",
    a: `The category currently runs from a few hundred rupees for a novelty to around ₹14,000 for a robot with a screen. Kheelu is ${LAUNCH_PRICE} for the ${CAP_UNITS_TEXT} and ${FULL_PRICE} after that, delivered anywhere in India with GST included, so the published price is the total cost.`,
  },
  {
    q: "What age is an AI toy for?",
    a: `Kheelu is for ages ${KHEELU_AGES}. Read the age on any toy in this category carefully, because it moves a lot: some are sold from 2, some from 5, and the difference is usually whether the maker has built an age filter or is hoping the child is old enough not to need one.`,
  },
  {
    q: "Does an AI toy need WiFi?",
    a: "For open conversation, yes. Kheelu runs AI mode on your home WiFi. Story mode stories and lessons work with no signal at all, and Bluetooth music needs only a paired phone, so a car journey is not a dead toy.",
  },
  {
    q: "What languages can it speak?",
    a: `Kheelu speaks ${LANGUAGES_LINE}, with up to 10 at launch, and switches mid-sentence the way your house does. For a bilingual home this matters more than it sounds: a toy that only speaks English quietly teaches a child which language is the serious one.`,
  },
  {
    q: "When can I get one?",
    a: `Shipping starts ${SHIP_DATE_TEXT}. A refundable ${TOKEN_PRICE} reserves one of the ${CAP_UNITS_TEXT} at ${LAUNCH_PRICE}, and it comes back in full if you ask any time before we dispatch.`,
  },
];

const JSON_LD = pageGraph(
  faqPage([...Object.values(ANSWERS), ...FAQ_ITEMS]),
  breadcrumbs([{ name: "AI toys for kids in India", path: "/ai-toys-for-kids-in-india" }]),
);

export default function AiToysGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(JSON_LD) }}
      />

      <PageHero
        ratio="md:grid-cols-[1.2fr_0.8fr]"
        guide="curious"
        /* GATED:kheelu-line — founder sign-off before merge to master */
        say="Ask the hard ones. We wrote this expecting them."
        media={
          <Image
            src={KHEELU_ART.src}
            alt={kheeluAlt("sitting beside the questions")}
            width={KHEELU_ART.width}
            height={KHEELU_ART.height}
            sizes="(max-width: 768px) 60vw, 300px"
            priority
            className="h-auto w-full max-w-[300px]"
          />
        }
      >
        <SectionHeading
          as="h1"
          eyebrow="A guide for parents"
          title="AI toys for kids in India: how to choose one"
          titleClassName="mb-5 max-w-[18ch]"
          lede="There are maybe a dozen of these on sale in India now, and they are not the same thing as each other. This is what to check before you buy any of them, including ours."
          ledeClassName="max-w-[58ch]"
        />
      </PageHero>

      <RoomsTrack>
        {/* The definitional answer. Answer engines retrieve definitions, and
            this category does not have a settled one yet. */}
        <Room fill="white" reveal="left">
          <Reveal>
            <AnswerBlock
              level="section"
              id="what-is-an-ai-toy"
              question={ANSWERS.whatIs.q}
              answer={ANSWERS.whatIs.a}
            />
          </Reveal>
        </Room>

        {/* The five checks: the commercial version of the journal piece. */}
        <Room fill="cream" reveal="right">
          <Reveal className="mb-10">
            <SectionHeading
              as="h2"
              level="section"
              title="Five things to check before you buy"
              titleClassName="mb-5 max-w-[20ch]"
              lede="None of these need you to understand how any of it works. They are questions a maker can answer in one sentence, and the answer tells you what you need to know."
              ledeClassName="max-w-[60ch]"
            />
          </Reveal>
          <Reveal>
            <StepList as="h3" items={CHECKS} />
          </Reveal>
          <Reveal className="mt-10">
            <p className="max-w-[60ch] text-[17px] leading-[1.6] text-ink-head/90">
              Each of these is argued at length, with the guidelines and
              advisories behind it, in{" "}
              <Link href="/stories/what-to-look-for-in-a-safe-ai-toy" className="font-semibold text-ink-head underline">
                what to look for in a safe AI toy
              </Link>
              . The short version is that every one of them is a choice a company
              makes or refuses to make.
            </p>
          </Reveal>
        </Room>

        {/* Kheelu's own answers, in the shape a comparison wants. */}
        <Room fill="white" reveal="left">
          <Reveal className="mb-10">
            <SectionHeading
              as="h2"
              level="section"
              title="How Kheelu answers, in full"
              titleClassName="mb-5 max-w-[20ch]"
              lede="Everything Kheelona has published about Kheelu, in one table, including the three things it has not published yet and is not going to guess at."
              ledeClassName="max-w-[60ch]"
            />
          </Reveal>
          <Reveal>
            <SpecTable />
          </Reveal>
        </Room>

        {/* Category-level comparison. No competitor is named, by policy.

            CREAM, NOT COOL, AND THIS WAS CAUGHT BY THE GATE RATHER THAN FORESEEN.
            `CompareTable` greys its "No" cells with `text-ink-muted`, which is
            4.21:1 on the cool wash and 4.20:1 on sun — both under AA, and both
            already banned in `test/contrast-tokens.test.ts`. The component had
            never been rendered on any route before this page, so the law had
            never actually met it: `qa:sweep` reported four real contrast
            failures at 1280px on the first run, sitting alongside nine of the
            §8.29 white-on-orange pairs it correctly waved through. On cream the
            same ink measures 4.52:1 and clears. */}
        <Room fill="cream" reveal="right">
          <Reveal className="mb-10">
            <SectionHeading
              as="h2"
              level="section"
              title="A talking toy, against the alternatives"
              titleClassName="mb-5 max-w-[22ch]"
              lede="Set against the other things a parent is actually choosing between, rather than against a named rival whose specifications we cannot check."
              ledeClassName="max-w-[60ch]"
            />
          </Reveal>
          <Reveal>
            <CompareTable />
          </Reveal>
          <Reveal className="mt-10">
            <p className="max-w-[60ch] text-[17px] leading-[1.6] text-ink-head/90">
              The distinction that matters most is the second row. A toy that
              repeats is a mirror, and a toy that answers is a conversation.{" "}
              <Link href="/stories/a-toy-that-talks-vs-a-toy-that-listens" className="font-semibold text-ink-head underline">
                We wrote about why that difference is the whole thing
              </Link>
              .
            </p>
          </Reveal>
        </Room>

        {/* Honest limits. This is the section a rival buying guide does not
            have, and it is the one a careful parent reads twice. */}
        <Room fill="white" reveal="left">
          <Reveal>
            <AnswerBlock
              level="section"
              id="what-we-have-not-earned"
              question={ANSWERS.limits.q}
              answer={ANSWERS.limits.a}
            />
          </Reveal>
          <Reveal className="mt-8">
            <p className="max-w-[60ch] text-[17px] leading-[1.6] text-ink-head/90">
              This is worth saying out loud on a page about how to choose,
              because the same standard applies to everyone selling in this
              category. Ask any maker what they have not earned yet. The answer
              tells you as much as the specification does.
            </p>
          </Reveal>
        </Room>

        <Room fill="cool" reveal="right">
          <Reveal className="mb-10">
            <SectionHeading
              as="h2"
              level="section"
              title="Questions parents ask"
              titleClassName="mb-4 max-w-[18ch]"
            />
          </Reveal>
          <Reveal>
            <Faq items={FAQ_ITEMS} />
          </Reveal>
        </Room>

        <FinaleCTA />
      </RoomsTrack>
    </>
  );
}
