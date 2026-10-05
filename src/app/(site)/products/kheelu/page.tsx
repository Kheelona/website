import Link from "next/link";
import { ColorwayPicker } from "./_components/ColorwayPicker";
import { PacePanel } from "./_components/PacePanel";
import { ViewContentTracker } from "@/components/molecules/ViewContentTracker";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { Button } from "@/components/atoms/Button";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Card } from "@/components/molecules/Card";
import { StepList } from "@/components/molecules/StepList";
import { CheckList } from "@/components/molecules/CheckList";
import { CompareTable } from "@/components/molecules/CompareTable";
import { SpecTable } from "@/components/molecules/SpecTable";
import { PriceTable } from "@/components/molecules/PriceTable";
import { Reveal } from "@/components/molecules/Reveal";
import { ChatDemo } from "@/components/molecules/ChatDemo";
import { VideoMoments } from "@/components/organisms/VideoMoments";
import { VIDEO_MOMENTS, hasVideoMoments } from "@/lib/video-moments";
import { Faq } from "@/components/molecules/Faq";
import { PRODUCT_FAQ } from "@/lib/faq";
import { KheelonaPlusBand } from "@/components/molecules/KheelonaPlusBand";
import { FootnotesRow, V3_FOOTNOTES, Footnote } from "@/components/molecules/FootnotesRow";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { KheeluModes } from "@/components/organisms/KheeluModes";
import { pageGraph, faqPage, breadcrumbs, KHEELU_PRODUCT, pageMeta, jsonLd } from "@/lib/seo";
import { FamilyGrid } from "@/components/organisms/FamilyGrid";
import { COMPARISON_COLUMNS, COMPARISON_ROWS } from "@/lib/comparison";
import {
  PREORDER_HREF,
  RESERVE_LABEL,
  PRICE_CAPTION,
  LAUNCH_PRICE,
  FULL_PRICE,
  CAP_UNITS_TEXT,
  SHIP_DATE_TEXT,
  TOKEN_PRICE,
  BALANCE_PRICE,
  KHEELU_AGES,
} from "@/config/site";

export const metadata = pageMeta({
  /* V4 CMO pass (keywords-v3.md): "talking toy" is the head term the India
     SERP actually trades in — the old title said "talking plush friend",
     which no parent types. "by Kheelona" dropped 2026-08-12: the `· Kheelona`
     template appends the brand already, and printing it twice was the only
     reason this ran 75 characters. */
  title: "Meet Kheelu: the talking toy that teaches, ages 3+",
  /* SEO (CS3 Phase B): the page's primary keyword, "AI educational toy", now
     sits in the description per the agency placement rules — the body already
     carries all four assigned phrases once each, and the title stays the
     brand sentence. 157 chars, under the 160 guard. */
  description:
    "A screen-free AI educational toy for ages 3+. Kheelu listens, answers, then asks the next question, slipping learning into play. ₹499 reserves yours at ₹4,999.",
  path: "/products/kheelu",
});

/* Revamp M3 (theme B): the Kheelu page on the room grammar. Copy: copy-v2
   /products/kheelu (provenance-tagged there); guide say lines GATED:kheelu-line.
   Specs and charger details stay PENDING (TODO claims-specs); never invent. */

/* "When parents reach for Kheelu" (CMO merge, 2026-10-04: the mockup's day),
   replacing the old "a whole day of things to do" cards. Every line restates a
   published fact: the conversation log, Story mode offline, home languages,
   quiet hours. The mockup's bedtime line said quiet hours "switch Kheelu off";
   the published feature is quiet hours, so it says that and no more. */
const MOMENTS = [
  { h: "While you cook", b: "Your child plays and talks with Kheelu instead of watching a screen." },
  { h: "After playschool", b: "They tell Kheelu about their day. You can read it later, in the parent app." },
  { h: "In the car or on a train", b: "Story-mode stories play with no signal at all." },
  { h: "With grandparents", b: "Rhymes and stories in your family's language." },
  { h: "At bedtime", b: "One last story, then quiet hours keep Kheelu quiet." },
] as const;

const HOW_IT_ANSWERS = [
  /* V6 axe fix: text-blue measures 2.68:1 on the cool wash (the team page
     recorded the same finding) — the darkened blue-ink token is the numeral
     blue everywhere now. */
  /* Microphone wording swept 2026-10-04 (content doc v7 Appendix B): the toy
     listens for its wake word, so "the microphone is off" was never accurate. */
  { n: "01", title: "Your child says the wake word.", body: "Until then, nothing is recorded and nothing is sent. Kheelu listens for that one word, and starts talking only when it is invited to.", color: "text-blue-ink" },
  { n: "02", title: "The device thinks first.", body: "Speech is processed on the toy first, so answers come back fast. Only what open conversation needs travels on, to our own servers in India.", color: "text-blue-ink" },
  /* Step 03 was "The feeling gets read" (Curious, Grumpy, Sad, Silly, Joy):
     the retired guide's feelings cast. Since the sync pass (2026-10-04) it is
     Home's own step, answer then ask back. */
  { n: "03", title: "Kheelu answers, then asks back.", body: "In simple words, pitched at your child's age, and then a question back, so the conversation keeps going.", color: "text-orange" },
  { n: "04", title: "The right response comes back.", body: "Every reply passes through an age-graded safety layer before it is spoken. On-device and cloud filters work together. No open internet. No surprises.", color: "text-orange" },
] as const;

const APP_FEATURES = [
  { title: "A daily summary", body: "One card each evening. What your child talked about, what made them laugh, what they asked." },
  { title: "The full conversation log", body: "Every conversation, word for word. Read it anytime. Delete any of it with one tap." },
  { title: "Topic controls", body: "You choose what is open and what waits. Dinosaurs today, tricky questions when you are ready." },
  { title: "Time and languages", body: "Set quiet hours. Pick the languages you speak at home. Kheelu follows your lead." },
] as const;

/* The product page's questions, from lib/faq.ts: the shared answers plus this
   page's own SEO questions, so a question asked here and on Home or /faq has
   one answer (founder, 2026-10-04: all pages in sync). */
const FAQ_ITEMS = PRODUCT_FAQ;

const JSON_LD = pageGraph(
  KHEELU_PRODUCT,
  faqPage(FAQ_ITEMS),
  breadcrumbs([{ name: "Meet Kheelu", path: "/products/kheelu" }]),
);

/* THE CMO MERGE (2026-10-04, docs/checkpoints/cmo-merge-2026-10.md). This
   page stays PRODUCT-deep while Home turned sales-first, and keeps its URL:
   /products/kheelu is what Google, the ads and the answer engines already
   cite. The mockup's hero, "three ways to play", "when parents reach for
   Kheelu", the comparison and the specs join it; the chat demo, the guarded
   four-step path (the page's only PlayOS link), Story mode with the films,
   PacePanel (one of the four tutor-line places), the parent app, the box, the
   product family (moved here from Home) and the full price table stay.
   The pilot quotes left this page: Home carries them now, and the V5-6 lesson
   was that the same component on both pages is what read as repetition. */
export default function KheeluPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(JSON_LD) }}
      />

      {/* Meta ViewContent, the top of the advertising funnel (§8.30-j). Renders
          nothing, and no-ops entirely off the production hosts. */}
      <ViewContentTracker />

      {/* Hero on the backdrop sky (no wash). The headline is the mockup's,
          research-anchored (founder decision 4, 2026-10-04): conversation is
          what helps a young brain grow, and Kheelu is built for it. */}
      <section className="relative overflow-x-clip">
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-8 px-[clamp(20px,5vw,64px)] py-10 md:grid-cols-[1fr_1fr] md:py-14">
          <Reveal mode="rise">
            <SectionHeading
              as="h1"
              eyebrow="Meet Kheelu"
              title="An AI toy built for the conversations that help a young brain grow."
              titleClassName="mb-5"
              lede={`Kheelu is a soft, screen-free rabbit for ages ${KHEELU_AGES}. It answers your child's questions, tells stories, plays music, and then asks the next question back.`}
              ledeClassName="mb-7 max-w-[58ch]"
            />
            <Button href={PREORDER_HREF} track="product-top">{RESERVE_LABEL}</Button>
            <p className="mt-4 text-[15px] text-ink-muted">{PRICE_CAPTION}</p>
          </Reveal>
          <Reveal mode="rise">
            <ColorwayPicker />
          </Reveal>
        </div>
      </section>

      <RoomsTrack>
        {/* The mockup's "three ways to play" IS the three modes: KheeluModes
            owns that copy on this site, so the room is the registry component
            rather than a second, shorter list that could drift from it. */}
        <Room fill="cool" id="modes" reveal="left">
          <KheeluModes />
        </Room>

        <Room fill="white" reveal="right">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_1.1fr]">
            <Reveal>
              <SectionHeading
                title="What talking with Kheelu sounds like."
                titleClassName="mb-4 max-w-[16ch]"
                lede="Kheelu answers, then asks. That is how a conversation goes somewhere."
                ledeClassName="max-w-[52ch]"
              />
            </Reveal>
            <Reveal delay={0.08}>
              <ChatDemo />
            </Reveal>
          </div>
        </Room>

        <Room fill="cool" id="how-it-works" reveal="left">
          <Reveal>
            <SectionHeading
              title="From wake word to answer, in four guarded steps."
              titleClassName="mb-3 max-w-[20ch]"
              lede="Every conversation walks the same guarded path."
              ledeClassName="mb-10 max-w-[58ch]"
            />
          </Reveal>
          <StepList items={HOW_IT_ANSWERS} />
          <Reveal className="mt-8">
            {/* V6 axe fix: ink-muted is 4.37:1 on the cool wash — muted text
                does not sit on tinted washes. */}
            <p className="text-[16px] text-ink">
              The technology behind the talking lives on the{" "}
              <Link href="/playos" className="rounded font-semibold text-ink-head underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2">
                PlayOS page
              </Link>
              .
            </p>
          </Reveal>
        </Room>

        {/* Story mode, with real families on film beneath it (§8.37). The
            heading and lede are the only place the site explains what Story
            mode contains; the films are the illustration, not the explanation. */}
        <Room fill="white" id="story-mode" reveal="right">
          <Reveal>
            <SectionHeading
              eyebrow="Story mode"
              title="Stories that ask questions back."
              titleClassName="mb-4 max-w-[18ch]"
              lede="Story mode fills Kheelu with stories and lessons your child can interrupt, question, and be quizzed on, offline. New packs and seasonal sets arrive over time, and school learning modules are on the way."
              /* the gap is for the carousel; without one it is dead space */
              ledeClassName={hasVideoMoments() ? "mb-10 max-w-[52ch]" : "max-w-[52ch]"}
            />
          </Reveal>
          {hasVideoMoments() && (
            <Reveal delay={0.08}>
              <VideoMoments moments={VIDEO_MOMENTS} />
            </Reveal>
          )}
        </Room>

        <Room fill="cream" id="moments" reveal="left">
          <Reveal>
            <SectionHeading
              title="When parents reach for Kheelu."
              titleClassName="mb-10 max-w-[20ch]"
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MOMENTS.map((d, i) => (
              <Reveal key={d.h} delay={i * 0.04}>
                <Card
                  className="h-full border border-line bg-white p-7"
                  title={d.h}
                  titleClassName="mb-2 font-display text-[22px] font-extrabold text-ink-head"
                >
                  <p className="text-[16px]">{d.b}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Room>

        {/* Founder call 2026-07-28: the comparison a parent actually pays for,
            school and tuition, framed as addition. */}
        <Room fill="cool" id="pace" reveal="right">
          <PacePanel />
        </Room>

        <Room fill="cream" id="parent-app" reveal="left">
          <Reveal>
            <SectionHeading
              title="You see every conversation. You decide what Kheelu does next."
              titleClassName="mb-3 max-w-[24ch]"
              lede="The parent app is your window into every conversation, and your hand on every dial. The new words your child learned are counted for you, you get one simple thing to do together each day, and if something ever needs your attention, you hear about it first."
              ledeClassName="mb-11 max-w-[58ch]"
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {APP_FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <Card
                  className="bg-white p-8"
                  title={f.title}
                  titleClassName="mb-2 font-display text-[24px] font-extrabold text-ink-head"
                >
                  <p className="text-[16px]">{f.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          {/* "What is included, and what comes later" (the mockup's table) is
              exactly what this band says, in the ONLY sanctioned Kheelona+
              wording, so it says it once. */}
          <Reveal className="mt-8">
            <KheelonaPlusBand footnote={2} />
          </Reveal>
        </Room>

        <Room fill="white" id="compare" reveal="right">
          <Reveal>
            <SectionHeading
              title="How Kheelu compares."
              titleClassName="mb-3"
              lede={`They all talk or play. This is how they differ for a child aged ${KHEELU_AGES}.`}
              ledeClassName="mb-10 max-w-[58ch]"
            />
            <CompareTable columns={COMPARISON_COLUMNS} rows={COMPARISON_ROWS} />
            <p className="mt-4 text-[15px] text-ink-muted">Based on typical products in each group.</p>
          </Reveal>
        </Room>

        {/* The specification (CMO merge: the mockup's "Specs"), from the ONE
            source that also feeds Product.additionalProperty (§8.36), beside
            what is in the box. Pending rows say so in words; nothing here is
            typed twice. */}
        <Room fill="white" id="specs" reveal="left">
          <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
            <Reveal>
              <SectionHeading level="minor" title="Specs." titleClassName="mb-6" />
              <SpecTable />
            </Reveal>
            <Reveal>
              <SectionHeading level="minor" title="What is in the box." titleClassName="mb-6" />
              <CheckList
                className="mb-8"
                items={[
                  "Kheelu, ready to talk.",
                  "A charger.",
                  "A quick-start card. Day one takes minutes.",
                ]}
              />
              {/* TODO(claims-specs): full specs pending from founder. */}
              <p className="max-w-[62ch] text-[16.5px] text-ink-muted">
                We publish the full specs, battery, size, materials, and the wake
                word, before Kheelu ships. The {TOKEN_PRICE} you pay to reserve is
                refundable until we dispatch.
              </p>
            </Reveal>
          </div>
        </Room>

        {/* Moved here from Home in the CMO merge: the line-up is product
            information, and the pipeline is what makes the purchase outlast
            the toy (benchmarks-v3.md). FamilyGrid is shared with /playos, so
            the line-up cannot drift. */}
        <Room fill="cream" id="family" reveal="right">
          <Reveal>
            <SectionHeading
              title="One friend inside. More friends on the way."
              titleClassName="mb-4 max-w-[20ch]"
              lede="The same friend lives inside everything we make, and it remembers your child across all of it. Kheelu is here first. The Kheelu Speaker and AI books follow."
              ledeClassName="mb-2 max-w-[58ch]"
            />
            <p className="mb-10 font-display text-[18px] font-bold text-ink-head">
              Starts talking at 3. Still teaching for years.
            </p>
          </Reveal>
          <FamilyGrid />
        </Room>

        <Room fill="sun" id="price" reveal="pop">
          <Reveal>
            <SectionHeading
              level="minor"
              title={`${TOKEN_PRICE} today. Nothing more until it ships.`}
              titleClassName="mb-3 max-w-[20ch]"
              lede={`Reserve at ${LAUNCH_PRICE} while the ${CAP_UNITS_TEXT} last. Fully refundable until we ship, and Kheelu stays a friend for years.`}
              ledeClassName="mb-7 max-w-[46ch]"
            />
            {/* The same offer as a table, under the same heading. The prose
                above is the pitch; this is the reference a parent checks
                against the payment screen (agency audit D06). */}
            <PriceTable className="mb-8" />
            <Button href={PREORDER_HREF} track="product-foot">{RESERVE_LABEL}</Button>
          </Reveal>
        </Room>

        <Room fill="cream" id="faq" reveal="right">
          <Reveal>
            <SectionHeading
              title="Questions parents ask."
              titleClassName="mb-3"
              lede={
                <>
                  Honest answers, in plain words. Two of them carry small print
                  below: the languages
                  <Footnote n={1} id="fn-languages" /> and Kheelona+
                  <Footnote n={2} id="fn-kheelona-plus" />.
                </>
              }
              ledeClassName="mb-10 max-w-[58ch]"
            />
          </Reveal>
          <Reveal className="mx-auto max-w-[820px]">
            <Faq items={FAQ_ITEMS} />
          </Reveal>
          <FootnotesRow items={V3_FOOTNOTES} className="mx-auto mt-10 max-w-[820px] border-t border-line pt-6" />
        </Room>

        <Room
          fill="white"
          id="reserve"
          reveal="pop"
          className="overflow-x-clip"
        >
          <FinaleCTA bare />
        </Room>
      </RoomsTrack>
    </>
  );
}
