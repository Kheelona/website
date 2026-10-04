import Link from "next/link";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { FootnotesRow, V3_FOOTNOTES } from "@/components/molecules/FootnotesRow";
import { Faq, type FaqEntry } from "@/components/molecules/Faq";
import { ViewContentTracker } from "@/components/molecules/ViewContentTracker";
import { pageGraph, faqPage, breadcrumbs, KHEELU_PRODUCT, pageMeta, jsonLd } from "@/lib/seo";
import { VIDEO_MOMENTS, hasVideoMoments, videoLede } from "@/lib/video-moments";
import { RecognitionStrip } from "@/components/organisms/RecognitionStrip";
import { ParentQuotes } from "@/components/organisms/ParentQuotes";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { VideoMoments } from "@/components/organisms/VideoMoments";
import {
  TOKEN_PRICE,
  BALANCE_PRICE,
  CAP_UNITS_TEXT,
  FULL_PRICE,
  LAUNCH_PRICE,
  SHIP_DATE_TEXT,
  KHEELONA_PLUS_LINE,
  LANGUAGES_LINE,
} from "@/config/site";
import {
  Hero,
  TrustStrip,
  HowItWorks,
  Compare,
  TrustRoom,
  TwoReasons,
  PriceRoom,
  TeamStrip,
  Journal,
} from "@/features/home";

export const metadata = pageMeta({
  /* 72 characters rendered, and deliberately over Google's ~60-character display
     budget (founder, 2026-08-12). It is one of exactly four places the tutor
     narrative is allowed to live (V6), and it carries the head keywords; Google
     reads the whole title and only clips the visible tail, so the cost is a few
     pixels of click-through, not rank. Unchanged by the CMO merge: the title is
     what Google already shows for this URL.

     NO HAND-WRITTEN BRAND SUFFIX: this page is `app/(site)/page.tsx`, and a
     route group IS a metadata segment, so the root `%s · Kheelona` template
     applies (found live 2026-09-05). */
  title: "Kheelu: the screen-free AI toy with a tutor inside, ages 3+",
  /* CMO merge (2026-10-04): the mockup's opening line leads, the offer
     closes. Under the 160 guard. */
  description:
    "Screens make children watch. Kheelu makes them think: a screen-free AI toy that answers, asks back, and grows with your child. ₹499 reserves yours at ₹4,999.",
  path: "/",
});

/* The questions parents actually type, answered on the page a search or an
   answer engine lands on first (AEO question bank, docs/revamp-2026-07/
   research.md). Every answer restates published copy and is self-contained
   enough to be quoted on its own.

   CMO merge (2026-10-04): the mockup's questions merged with the old set.
   Kept from main: what it is, safety, cost IN INDIA (the keyword that
   matters), ship date, internet, languages. Added from the mockup:
   subscription and the refund. Dropped from Home (still answered on the Kheelu
   page and /faq): "what will my child get out of it" (the hero and the
   how-it-works room answer it now) and "what ages" (the hero chip). */
const HOME_FAQ: FaqEntry[] = [
  {
    q: "What is Kheelu?",
    /* SEO round 2026-08-12: carries "screen-free toy" and "interactive AI toy"
       exactly; "smart toy" is deliberately NOT written here, because the
       comparison contrasts Kheelu against that category. */
    a: "Kheelu is a screen-free toy that talks with children aged 3 and up: your child speaks to it and it answers, tells stories, sings, and asks questions back. It is an interactive AI toy with no screen at all, it cannot reach the open internet, and every conversation is readable by you in the parent app.",
  },
  /* V6 D7: opens with the same honest verdict as the /safety flagship answer.
     Microphone wording swept 2026-10-04 (content doc v7 Appendix B): the toy
     listens for its wake word, so it is never described as "off". */
  {
    q: "Is an AI toy safe for a small child?",
    a: "Not all of them are, and what makes a safe toy is how it is built. Kheelu listens only for its wake word and records or sends nothing until it hears it, the first thinking happens on the toy, answers come from a closed library rather than the open internet, and you can read or delete every conversation.",
  },
  {
    q: "How much does Kheelu cost in India?",
    a: `${LAUNCH_PRICE} for the ${CAP_UNITS_TEXT}, and ${FULL_PRICE} once they are gone. A refundable ${TOKEN_PRICE} reserves your Kheelu now, and the ${BALANCE_PRICE} balance is due only when it is ready to ship. Every Kheelu includes 6 months of Kheelona+.`,
  },
  {
    q: "Is there a subscription?",
    a: `${KHEELONA_PLUS_LINE} Nothing renews without you.`,
  },
  {
    q: `Can I get my ${TOKEN_PRICE} back?`,
    a: `Yes, in full, any time before we dispatch your Kheelu. The ${BALANCE_PRICE} balance is due only when your Kheelu is ready to ship.`,
  },
  {
    q: "When does Kheelu ship?",
    a: `Shipping starts ${SHIP_DATE_TEXT}. Reserving now holds the ${LAUNCH_PRICE} price and your place in line for a refundable ${TOKEN_PRICE}, and pre-orders are served first.`,
  },
  /* V6 D4a (founder-licensed fact): mode-precise. */
  {
    q: "Does Kheelu need the internet to work?",
    a: "For open conversation, yes: AI mode runs on your home WiFi. For everything else, no: Story-mode stories and lessons play offline, and Bluetooth music needs only a paired phone. On a train or anywhere without a signal, your child still has stories to interrupt, question, and be quizzed on.",
  },
  {
    q: "Which languages does Kheelu speak?",
    a: `${LANGUAGES_LINE}, with up to ten languages at launch. Kheelu can switch mid-sentence, in the languages you speak at home.`,
  },
];

const HOME_JSON_LD = pageGraph(KHEELU_PRODUCT, faqPage(HOME_FAQ), breadcrumbs([]));

/* THE CMO MERGE (2026-10-04, docs/checkpoints/cmo-merge-2026-10.md): the
   mockup's sales-first order on the v3 room grammar. Claim → reassurance →
   proof on film → parents → how it works → the comparison a parent is making
   → safety → languages and the app → the price → who we are → questions →
   reading → the ask.

   Kept from main where the mockup dropped them, each for a reason: the
   recognition logos (the trust strip's proof), the journal (Home's internal
   links into what ranks), the footnotes (the two soft claims keep their
   answers), and the tutor line (V6's four sanctioned places).

   Moved to /products/kheelu: the product family. Retired: the day-with-
   Kheelu orbit (the Kheelu page's "When parents reach for Kheelu" carries it),
   the feelings gallery, and the four-card growth arc (age tabs here, all four
   stages on /how). The Kheelu guide and every say line are retired with it. */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(HOME_JSON_LD) }}
      />
      {/* Meta ViewContent on Home too (founder, 2026-10-02, recorded on the
          redesign branch): Home carries the product, the price and the reserve
          CTA, so a home visit is a product view. Same payload as the Kheelu
          page; it renders nothing and no-ops off the production hosts. */}
      <ViewContentTracker />
      <Hero />
      <RoomsTrack>
        <Room fill="white" reveal="pop">
          <TrustStrip />
          <div className="mt-8 border-t border-line pt-8">
            <RecognitionStrip bare />
          </div>
        </Room>

        {/* Real families on film (§8.37). With no films the room renders
            nothing at all: everything else it used to hold now lives in the
            languages card below, so an empty room would be a heading over
            nothing (§8.37-d). `#watch` is the hero's second button. */}
        {hasVideoMoments() ? (
          <Room fill="cream" id="watch" reveal="left" className="scroll-mt-24">
            <Reveal>
              <SectionHeading
                eyebrow="See it for yourself"
                title="Watch a child meet Kheelu."
                titleClassName="mb-3"
                lede={videoLede()}
                ledeClassName="mb-10 max-w-[58ch]"
              />
            </Reveal>
            <Reveal>
              <VideoMoments moments={VIDEO_MOMENTS} />
            </Reveal>
          </Room>
        ) : null}

        <Room fill="white" id="parent-voices" reveal="right">
          <ParentQuotes bare title="What pilot parents told us." />
        </Room>

        <Room fill="cream" id="how-it-works" reveal="left">
          <HowItWorks />
        </Room>

        <Room fill="white" id="compare" reveal="right">
          <Compare bare />
        </Room>

        <Room fill="cool" id="safety" reveal="left">
          <TrustRoom />
        </Room>

        <Room fill="cream" id="two-more" reveal="right">
          <Reveal>
            <SectionHeading title="Two more things to know." titleClassName="mb-10" />
          </Reveal>
          <TwoReasons />
        </Room>

        <Room fill="white" id="price" reveal="pop">
          <PriceRoom />
        </Room>

        <Room fill="cream" id="team" reveal="left">
          <TeamStrip />
        </Room>

        <Room fill="white" id="questions" reveal="right">
          <Reveal>
            <SectionHeading
              title="Questions parents ask first."
              titleClassName="mb-3"
              lede="Straight answers, in plain words. The full list lives on the FAQ page."
              ledeClassName="mb-10 max-w-[58ch]"
            />
          </Reveal>
          <Reveal className="mx-auto max-w-[820px]">
            <Faq items={HOME_FAQ} />
            <p className="mt-6">
              <Link
                href="/faq"
                className="rounded font-bold text-orange-ink underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                See all questions
              </Link>
            </p>
          </Reveal>
        </Room>

        <Room fill="sun" id="journal" reveal="right">
          <Journal bare />
          {/* The page's small print: the two claims that invite a follow-up
              question get their answer here rather than nowhere. */}
          <FootnotesRow items={V3_FOOTNOTES} className="mt-12 border-t border-line pt-6" />
        </Room>

        <Room fill="white" id="reserve" reveal="pop" className="overflow-x-clip">
          <FinaleCTA bare />
        </Room>
      </RoomsTrack>
    </>
  );
}
