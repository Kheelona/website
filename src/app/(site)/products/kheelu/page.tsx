import Link from "next/link";
import { ColorwayPicker } from "./_components/ColorwayPicker";
import { PacePanel } from "./_components/PacePanel";
import { ViewContentTracker } from "./_components/ViewContentTracker";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { Button } from "@/components/atoms/Button";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Card } from "@/components/molecules/Card";
import { StepList } from "@/components/molecules/StepList";
import { CheckList } from "@/components/molecules/CheckList";
import { PriceTable } from "@/components/molecules/PriceTable";
import { Reveal } from "@/components/molecules/Reveal";
import { ChatDemo } from "@/components/molecules/ChatDemo";
import { AudioMoments } from "@/components/molecules/AudioMoments";
import { KHEELU_PAGE_MOMENTS } from "@/lib/audio-moments";
import { Faq, type FaqEntry } from "@/components/molecules/Faq";
import { KheelonaPlusBand } from "@/components/molecules/KheelonaPlusBand";
import { FootnotesRow, V3_FOOTNOTES, Footnote } from "@/components/molecules/FootnotesRow";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { KheeluModes } from "@/components/organisms/KheeluModes";
import { pageGraph, faqPage, breadcrumbs, KHEELU_PRODUCT, pageMeta, jsonLd } from "@/lib/seo";
import { ParentQuotes } from "@/components/organisms/ParentQuotes";
import {
  PREORDER_HREF,
  PREORDER_LABEL,
  PRICE_CAPTION,
  LAUNCH_PRICE,
  FULL_PRICE,
  CAP_UNITS_TEXT,
  SHIP_DATE_TEXT,
  TOKEN_PRICE,
  BALANCE_PRICE,
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

/* copy-v2 does room [seed] */
const DOES = [
  { h: "Real conversation", b: "Kheelu listens, answers, and asks the next question." },
  { h: "Stories on demand", b: "A new story whenever your child wants one." },
  { h: "Lessons that feel like play", b: "Numbers, words, and why the sky is blue. Stories your child can be quizzed on." },
  { h: "Songs and rhymes", b: "The ones you grew up with, and new ones too." },
  /* V6 D4f: the last blanket offline claim, made mode-precise. */
  { h: "Offline adventures", b: "Story-mode stories and your paired playlist travel anywhere, no signal needed." },
] as const;

const HOW_IT_ANSWERS = [
  /* V6 axe fix: text-blue measures 2.68:1 on the cool wash (the team page
     recorded the same finding) — the darkened blue-ink token is the numeral
     blue everywhere now. */
  { n: "01", title: "Your child says the wake word.", body: "Until then, the microphone is off. Kheelu starts listening only when it is invited to.", color: "text-blue-ink" },
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

      {/* Hero on the backdrop sky (no wash), greeted through the guide */}
      <section
        data-guide="hero-wink"
        data-say="This is Kheelu. Go on, say hello."
        className="relative overflow-x-clip"
      >
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-8 px-[clamp(20px,5vw,64px)] py-10 md:grid-cols-[1fr_1fr] md:py-14">
          <Reveal mode="rise">
            <SectionHeading
              as="h1"
              eyebrow="The talking friend"
              title="Meet Kheelu. The friend who listens first."
              titleClassName="mb-5"
              lede="A talking friend for ages 3+. No screen, ever. Kheelu listens, answers, then asks the next question."
              ledeClassName="mb-7 max-w-[58ch]"
            />
            <Button href={PREORDER_HREF}>{PREORDER_LABEL}</Button>
            <p className="mt-4 text-[15px] text-ink-muted">{PRICE_CAPTION}</p>
          </Reveal>
          <Reveal mode="rise">
            <ColorwayPicker />
          </Reveal>
        </div>
      </section>

      <RoomsTrack>
        <Room fill="white" reveal="left">
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

        <Room fill="cool" id="how-it-works" guide="curious" say="Four steps, and every one of them careful." reveal="right">
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

        {/* V4: the education fold now PLAYS instead of typing — the two
            clearest lesson-in-play clips from the Home audio room (one data
            source, lib/audio-moments). The "new things after launch" room
            folded into this lede — each fact once, per the slim mandate. */}
        <Room fill="white" id="story-mode" guide="curious" say="The games here are secretly lessons." reveal="left">
          <div className="grid items-start gap-10 md:grid-cols-[1fr_1.05fr]">
            <Reveal>
              <SectionHeading
                eyebrow="Story mode"
                title="Stories that ask questions back."
                titleClassName="mb-4 max-w-[18ch]"
                lede="Story mode fills Kheelu with stories and lessons your child can interrupt, question, and be quizzed on, offline. New packs and seasonal sets arrive over time, and school learning modules are on the way."
                ledeClassName="max-w-[52ch]"
              />
            </Reveal>
            <Reveal delay={0.08}>
              <AudioMoments moments={KHEELU_PAGE_MOMENTS} className="md:grid-cols-1" />
            </Reveal>
          </div>
        </Room>

        {/* Founder call 2026-07-28: move the comparison to what a parent
            actually pays for — school and tuition — framed as addition. */}
        <Room fill="cool" id="pace" guide="bliss" say="I only ever have one child to keep up with." reveal="right">
          <PacePanel />
        </Room>

        <Room fill="white" reveal="left">
          <Reveal>
            <SectionHeading
              title="One friend. A whole day of things to do."
              titleClassName="mb-10 max-w-[20ch]"
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DOES.map((d, i) => (
              <Reveal key={d.h} delay={i * 0.04}>
                <Card
                  className="h-full border border-line bg-cream p-7"
                  title={d.h}
                  titleClassName="mb-2 font-display text-[22px] font-extrabold text-ink-head"
                >
                  <p className="text-[16px]">{d.b}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Room>

        {/* V5-6 (2026-07-31 review): the five-feeling gallery used to repeat
            here in full. Six components rendered on BOTH Home and this page, so
            a visitor who read Home and clicked "Meet Kheelu" met the same audio
            demos, the same feelings, the same modes and the same quotes — the
            real root of "too much content, less value". Home owns the feelings
            beat; this page keeps what only a product page can say: the modes,
            the pace panel, the colourways, the box, and its own FAQ. */}

        {/* Founder call 2026-07-28: the three real modes replace the old
            personality chips (Companion / Storyteller / Teacher). A parent
            deciding on a pre-order asks what it does, not what it is like. */}
        <Room fill="cool" id="modes" guide="joy" say="Three modes. I do the talking in all of them." reveal="left">
          <KheeluModes />
        </Room>

        <Room fill="cream" id="parent-app" guide="bliss" say="You get to see everything. That's the deal." reveal="left">
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
          <Reveal className="mt-8">
            <KheelonaPlusBand footnote={2} />
          </Reveal>
        </Room>

        <Room fill="white" reveal="right">
          <Reveal>
            <SectionHeading
              level="minor"
              title="What is in the box."
              titleClassName="mb-6"
            />
            <CheckList
              className="mb-8"
              items={[
                "Kheelu, ready to talk.",
                "A charger.",
                "A quick-start card. Day one takes minutes.",
              ]}
            />
            {/* TODO(claims-specs): full specs pending from founder. */}
            {/* Second half corrected 2026-09-05: it read "Reserving now does
                not commit you to buy", which was written for the free list and
                reads as "this costs nothing" beside a paid button. */}
            <p className="max-w-[62ch] text-[16.5px] text-ink-muted">
              We publish the full specs, battery, size, materials, and the wake
              word, before Kheelu ships. The {TOKEN_PRICE} you pay to reserve is
              refundable until we dispatch.
            </p>
          </Reveal>
        </Room>

        <Room fill="white" reveal="left">
          <ParentQuotes bare count={2} eyebrow="From the pilot" title="The first families are already talking." />
        </Room>

        <Room fill="sun" id="price" guide="joy" say="Told you she was worth it." reveal="pop">
          <Reveal>
            <SectionHeading
              level="minor"
              title={`${TOKEN_PRICE} today. ${BALANCE_PRICE} when it ships.`}
              titleClassName="mb-3 max-w-[20ch]"
              lede={`Pre-order at ${LAUNCH_PRICE} while the ${CAP_UNITS_TEXT} last. Fully refundable until we ship, and Kheelu stays a friend for years.`}
              ledeClassName="mb-7 max-w-[46ch]"
            />
            {/* The same offer as a table, under the same heading. The prose
                above is the pitch; this is the reference a parent checks
                against the payment screen (agency audit D06). */}
            <PriceTable className="mb-8" />
            <Button href={PREORDER_HREF}>{PREORDER_LABEL}</Button>
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
          guide="silly"
          say="Save your spot. I'll mind Kheelu till launch."
          reveal="pop"
          className="overflow-x-clip"
        >
          <FinaleCTA bare />
        </Room>
      </RoomsTrack>
    </>
  );
}
