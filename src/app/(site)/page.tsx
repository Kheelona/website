import Link from "next/link";
import { TextLink } from "@/components/molecules/TextLink";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { FootnotesRow, V3_FOOTNOTES } from "@/components/molecules/FootnotesRow";
import { Faq } from "@/components/molecules/Faq";
import { HOME_FAQ } from "@/lib/faq";
import { ViewContentTracker } from "@/components/molecules/ViewContentTracker";
import { pageGraph, faqPage, breadcrumbs, KHEELU_PRODUCT, pageMeta, jsonLd } from "@/lib/seo";
import { VIDEO_MOMENTS, hasVideoMoments, videoLede } from "@/lib/video-moments";
import { RecognitionStrip } from "@/components/organisms/RecognitionStrip";
import { ParentQuotes } from "@/components/organisms/ParentQuotes";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { VideoMoments } from "@/components/organisms/VideoMoments";
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

/* The eight questions parents ask first, from lib/faq.ts: every question the
   site answers on more than one page is answered once there (founder,
   2026-10-04: all pages in sync). */
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
              <TextLink href="/faq">See all questions</TextLink>
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
