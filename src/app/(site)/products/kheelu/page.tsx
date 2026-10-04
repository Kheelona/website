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
import { Faq, type FaqEntry } from "@/components/molecules/Faq";
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
  { n: "02", title: "The device thinks first.", body: "Speech is processed on the toy before anything goes anywhere. Low latency. No long waits. No sending everything to a distant server.", color: "text-blue-ink" },
  { n: "03", title: "The feeling gets read.", body: "PlayOS hears more than words. Curious, Grumpy, Sad, Silly, Joy: the answer meets the mood.", color: "text-orange-ink" },
  { n: "04", title: "The right response comes back.", body: "Every reply passes through an age-graded safety layer before it is spoken. On-device and cloud filters work together. No open internet. No surprises.", color: "text-orange-ink" },
] as const;

const APP_FEATURES = [
  { title: "A daily summary", body: "One card each evening. What your child talked about, what made them laugh, what they asked." },
  { title: "The full conversation log", body: "Every conversation, word for word. Read it anytime. Delete any of it with one tap." },
  { title: "Topic controls", body: "You choose what is open and what waits. Dinosaurs today, tricky questions when you are ready." },
  { title: "Time and languages", body: "Set quiet hours. Pick the languages you speak at home. Kheelu follows your lead." },
] as const;

/* FAQ v2 (copy-v2): seed answers + the honest existing ship/payment answers.
   Subscription and camera questions are GATED (REV-b) and absent until the
   founder confirms the facts. */
const FAQ_ITEMS: FaqEntry[] = [
  { q: "Is Kheelu safe for my child?", a: "Kheelu wakes to a word, thinks on the device first, and answers from a closed library. There is a safety check on every reply, and you can read or delete anything. The five checks worth applying to any AI toy, including this one, are set out in our guide to choosing one." },
  /* V6 D4b (founder-licensed fact): mode-precise. */
  { q: "Does Kheelu need the internet?", a: "Only for open conversation: AI mode runs on your home WiFi. Story-mode stories and lessons work offline, and Bluetooth music needs only a paired phone. New content and updates download when you choose." },
  { q: "What languages does Kheelu speak?", a: "English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish, and French, with up to ten at launch. Kheelu switches mid-sentence, in the languages you speak at home." },
  /* SEO round 2026-08-12: the "5 6 year olds" keyword hangs off the family
     arc at the founder's direction — Kheelu's own band (3+ since 2026-08-23)
     covers it directly now, and the phrase also describes the published
     pipeline (Kheelu Speaker, ages 5+). */
  { q: "What ages is Kheelu for?", a: "Ages 3+. Kheelu meets your child where they are, and the family that follows brings learning toys for 5 and 6 year olds onward, growing right alongside." },
  /* SEO round 2026-08-12, founder decision: "best" lives in the parents'-voice
     QUESTION only — the answer makes no best claim, it says what to look for
     and where Kheelu fits. It also carries "AI educational toy" for this page. */
  { q: "What are the best learning toys for 3-year-olds?", a: "Look for a toy that answers back. At 3, children learn through back-and-forth conversation: questions, stories they can interrupt, words that build on yesterday's words. Kheelu is an AI educational toy built around exactly that loop, and it grows with your child from 3 up." },
  { q: "Can I read the conversations?", a: "Yes. The full log stays private to you, in the parent app." },
  { q: "Do you sell our data?", a: "No. Never sold, never used to sell your child anything. That is the whole point." },
  { q: "What if my child breaks it?", a: "Kheelu is built for small hands and rough days. Warranty details land closer to launch." },
  { q: "When will Kheelu ship?", a: `Shipping starts ${SHIP_DATE_TEXT}. Pre-orders are served first, in the order they were placed.` },
  { q: "How much does Kheelu cost?", a: `${LAUNCH_PRICE} for the ${CAP_UNITS_TEXT}, and ${FULL_PRICE} once they are gone. A refundable ${TOKEN_PRICE} reserves yours, and the ${BALANCE_PRICE} balance is due only when it ships.` },
  /* CORRECTED 2026-09-05. This answer said "No. Reserving holds your price and
     your place, and it does not commit you to buy. You can leave the list
     anytime." That was true of the free Tally list and became false on
     2026-08-22, when the store started taking a real ₹499 through Razorpay. It
     shipped for two weeks as visible copy AND inside the FAQPage JSON-LD, so
     answer engines were being told the pre-order is free.
     The retired wording is pinned as banned in test/preorder-copy.test.ts. */
  { q: "Do I have to pay anything now?", a: `Yes. A refundable ${TOKEN_PRICE} reserves your Kheelu and holds the ${LAUNCH_PRICE} price. The ${BALANCE_PRICE} balance is due only when your Kheelu is ready to ship, and the ${TOKEN_PRICE} comes back in full if you ask before we dispatch.` },
  /* THE RENAME, ANSWERED IN VISIBLE COPY (2026-09-11, §8.36-a).
     Not housekeeping: a parent who met this product as Lumi in the Play Store,
     on LinkedIn or in a directory listing needs to know they are in the right
     place, and as of 2026-09-11 every one of those still says Lumi. It sits in
     the FAQ because FAQPage schema may only ever describe visible copy, and
     this is the answer an engine most needs to be able to quote. */
  { q: "Is Kheelu the same as Lumi?", a: "Yes. Kheelu is the same toy. It was called Lumi until September 2026, when it took the name of the character who narrates this site. Nothing else changed: same product, same price, same ship date. Older listings and articles still say Lumi, and they are describing this." },
  { q: "What is PlayOS?", a: "The platform Kheelu runs on. It gives each character a voice and a personality, and keeps every answer right for your child's age." },
  { q: "Can Kheelu play music?", a: "Yes. Pair a phone over Bluetooth and Kheelu becomes the speaker in the room, for your playlist, rhymes, or an audiobook. That is one of its three modes, alongside conversation and Story mode stories." },
  { q: "Does Kheelu need a subscription?", a: "Every Kheelu includes 6 months of Kheelona+, the stories, lessons, languages, and the parent app. Kheelu's smart features are yours for life, Kheelona+ pricing is announced soon, and nothing renews without you." },
  { q: "What is Kheelona+?", a: "The content and the controls: stories, lessons, language packs, and the parent app that shows you the learning. It is included free for the first 6 months with every Kheelu." },
  { q: "Why pre-order now?", a: `The price is ${LAUNCH_PRICE} for the ${CAP_UNITS_TEXT} and ${FULL_PRICE} once they are gone. The ${TOKEN_PRICE} you pay today is fully refundable until we ship.` },
  /* SEO round 2026-08-12, founder decision: the agency's gendered gift keyword
     is NEUTRALISED — the site says "your child" everywhere, so the phrase here
     is "a unique birthday gift", never "for daughter". "Unique" is grounded in
     one specific, published mechanism (it changes as the child grows), not
     puffery. */
  { q: "Is Kheelu a good birthday gift?", a: `It is a unique birthday gift in one specific way: it keeps changing. Kheelu learns your child's words and grows with them, so the toy at 5 is not the toy they unwrapped at 3. Reserving now holds the ${LAUNCH_PRICE} price.` },
];

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
              title="From question to answer, in four steps."
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
              title={`${TOKEN_PRICE} today. ${BALANCE_PRICE} when it ships.`}
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
