import type { Metadata } from "next";
import Link from "next/link";
import { ColorwayPicker } from "./_components/ColorwayPicker";
import { PacePanel } from "./_components/PacePanel";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { Button } from "@/components/atoms/Button";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Card } from "@/components/molecules/Card";
import { StepList } from "@/components/molecules/StepList";
import { CheckList } from "@/components/molecules/CheckList";
import { Reveal } from "@/components/molecules/Reveal";
import { ChatDemo } from "@/components/molecules/ChatDemo";
import { AudioMoments } from "@/components/molecules/AudioMoments";
import { LUMI_PAGE_MOMENTS } from "@/lib/audio-moments";
import { Faq, type FaqEntry } from "@/components/molecules/Faq";
import { KheelonaPlusBand } from "@/components/molecules/KheelonaPlusBand";
import { FootnotesRow, V3_FOOTNOTES, Footnote } from "@/components/molecules/FootnotesRow";
import { FeelingsGallery } from "@/components/organisms/FeelingsGallery";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { LumiModes } from "@/components/organisms/LumiModes";
import { graph, faqPage, breadcrumbs, LUMI_PRODUCT } from "@/lib/seo";
import { ParentQuotes } from "@/components/organisms/ParentQuotes";
import { PREORDER_HREF, RESERVE_LABEL, PRICE_CAPTION, LAUNCH_PRICE, LATER_PRICE } from "@/config/site";

export const metadata: Metadata = {
  /* V4 CMO pass (keywords-v3.md): "talking toy" is the head term the India
     SERP actually trades in — the old title said "talking plush friend",
     which no parent types. */
  title: "Meet Lumi by Kheelona: the talking toy that teaches, ages 2 to 5",
  description:
    "Lumi is a screen-free talking toy for ages 2 to 5. It listens, answers, then asks the next question, and slips learning into the play. Reserve at ₹4,999, no payment now.",
  alternates: { canonical: "/products/lumi" },
};

/* Revamp M3 (theme B): the Lumi page on the room grammar. Copy: copy-v2
   /products/lumi (provenance-tagged there); guide say lines GATED:kheelu-line.
   Specs and charger details stay PENDING (TODO claims-specs); never invent. */

/* copy-v2 does room [seed] */
const DOES = [
  { h: "Real conversation", b: "Lumi listens, answers, and asks the next question." },
  { h: "Stories on demand", b: "A new story whenever your child wants one." },
  { h: "Lessons that feel like play", b: "Numbers, words, and why the sky is blue. Stories your child can be quizzed on." },
  { h: "Songs and rhymes", b: "The ones you grew up with, and new ones too." },
  { h: "Offline adventures", b: "Play that does not need the internet." },
] as const;

const HOW_IT_ANSWERS = [
  { n: "01", title: "Your child says the wake word.", body: "Until then, the microphone is off. Lumi starts listening only when it is invited to.", color: "text-blue" },
  { n: "02", title: "The device thinks first.", body: "Speech is processed on the toy before anything goes anywhere. Low latency. No long waits. No sending everything to a distant server.", color: "text-blue-ink" },
  { n: "03", title: "The feeling gets read.", body: "PlayOS hears more than words. Curious, Grumpy, Sad, Silly, Joy: the answer meets the mood.", color: "text-orange-ink" },
  { n: "04", title: "The right response comes back.", body: "Every reply passes through an age-graded safety layer before it is spoken. On-device and cloud filters work together. No open internet. No surprises.", color: "text-orange-deep" },
] as const;

const APP_FEATURES = [
  { title: "A daily summary", body: "One card each evening. What your child talked about, what made them laugh, what they asked." },
  { title: "The full conversation log", body: "Every conversation, word for word. Read it anytime. Delete any of it with one tap." },
  { title: "Topic controls", body: "You choose what is open and what waits. Dinosaurs today, tricky questions when you are ready." },
  { title: "Time and languages", body: "Set quiet hours. Pick the languages you speak at home. Lumi follows your lead." },
] as const;

/* FAQ v2 (copy-v2): seed answers + the honest existing ship/payment answers.
   Subscription and camera questions are GATED (REV-b) and absent until the
   founder confirms the facts. */
const FAQ_ITEMS: FaqEntry[] = [
  { q: "Is Lumi safe for my child?", a: "Lumi wakes to a word, thinks on the device first, and answers from a closed library. There is a safety check on every reply, and you can read or delete anything." },
  { q: "Does Lumi need the internet?", a: "No. Lumi plays offline. You connect only to download new content or updates, and you decide when." },
  { q: "What languages does Lumi speak?", a: "English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish, and French, with up to ten at launch. Lumi switches mid-sentence, in the languages you speak at home." },
  { q: "What ages is Lumi for?", a: "Ages 2 to 5. Lumi meets your child where they are, and the family of friends grows with them to 14." },
  { q: "Can I read the conversations?", a: "Yes. The full log stays private to you, in the parent app." },
  { q: "Do you sell our data?", a: "No. Never sold, never used to sell your child anything. That is the whole point." },
  { q: "What if my child breaks it?", a: "Lumi is built for small hands and rough days. Warranty details land closer to launch." },
  { q: "When will Lumi ship?", a: "Shipping starts 1 September 2026. Everyone on the list is served first, in the order they reserved." },
  { q: "How much does Lumi cost?", a: "₹4,999 at launch if you reserve now. ₹9,999 after launch. You pay nothing today. We hold the price, you hold your place." },
  { q: "Do I have to pay anything now?", a: "No. Reserving holds your price and your place, and it does not commit you to buy. You can leave the list anytime." },
  { q: "What is PlayOS?", a: "The platform Lumi runs on. It gives each character a voice and a personality, and keeps every answer right for your child's age." },
  { q: "Can Lumi play music?", a: "Yes. Pair a phone over Bluetooth and Lumi becomes the speaker in the room, for your playlist, rhymes, or an audiobook. That is one of its three modes, alongside conversation and Kheelu mode stories." },
  { q: "Does Lumi need a subscription?", a: "Every Lumi includes 6 months of Kheelona+, the stories, lessons, languages, and the parent app. Lumi's smart features are yours for life, Kheelona+ pricing is announced soon, and nothing renews without you." },
  { q: "What is Kheelona+?", a: "The content and the controls: stories, lessons, language packs, and the parent app that shows you the learning. It is included free for the first 6 months with every Lumi." },
  { q: "Why reserve now?", a: "The first 500 units are ₹4,999. After launch it is ₹9,999. There is no payment today." },
];

const JSON_LD = graph(
  LUMI_PRODUCT,
  faqPage(FAQ_ITEMS),
  breadcrumbs([{ name: "Meet Lumi", path: "/products/lumi" }]),
);

export default function LumiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* Hero on the backdrop sky (no wash), greeted through the guide */}
      <section
        data-guide="hero-wink"
        data-say="This is Lumi. I picked the colours myself."
        className="relative overflow-x-clip"
      >
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-8 px-[clamp(20px,5vw,64px)] py-10 md:grid-cols-[1fr_1fr] md:py-14">
          <Reveal mode="rise">
            <SectionHeading
              as="h1"
              eyebrow="The talking friend"
              title="Meet Lumi. The friend who listens first."
              titleClassName="mb-5"
              lede="A talking friend for ages 2 to 5. No screen, ever. Lumi listens, answers, then asks the next question."
              ledeClassName="mb-7 max-w-[58ch]"
            />
            <Button href={PREORDER_HREF}>{RESERVE_LABEL}</Button>
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
                title="What talking with Lumi sounds like."
                titleClassName="mb-4 max-w-[16ch]"
                lede="Lumi answers, then asks. That is how a conversation goes somewhere."
                ledeClassName="max-w-[52ch]"
              />
            </Reveal>
            <Reveal delay={0.08}>
              <ChatDemo />
            </Reveal>
          </div>
        </Room>

        <Room fill="cool" guide="curious" say="Four steps, and every one of them careful." reveal="right">
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
            <p className="text-[16px] text-ink-muted">
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
        <Room fill="white" id="kheelu-mode" guide="curious" say="The games here are secretly lessons." reveal="left">
          <div className="grid items-start gap-10 md:grid-cols-[1fr_1.05fr]">
            <Reveal>
              <SectionHeading
                eyebrow="Kheelu mode"
                title="Stories that ask questions back."
                titleClassName="mb-4 max-w-[18ch]"
                lede="Kheelu mode fills Lumi with stories and lessons your child can interrupt, question, and be quizzed on, offline. New packs and seasonal sets arrive over time, and school learning modules are on the way."
                ledeClassName="max-w-[52ch]"
              />
            </Reveal>
            <Reveal delay={0.08}>
              <AudioMoments moments={LUMI_PAGE_MOMENTS} className="md:grid-cols-1" />
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
                  className="h-full border border-line-soft bg-cream p-7"
                  title={d.h}
                  titleClassName="mb-2 font-display text-[22px] font-extrabold text-ink-head"
                >
                  <p className="text-[16px]">{d.b}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Room>

        <Room fill="cream" guide="silly" say="Five feelings. I can act them all out." reveal="right">
          <Reveal>
            <SectionHeading
              eyebrow="Meet the feelings"
              title="Five feelings your child learns to name."
              titleClassName="mb-3"
              lede="The learning starts with the heart. Name the feeling first, and the thinking follows."
              ledeClassName="mb-11 max-w-[58ch]"
            />
          </Reveal>
          <FeelingsGallery />
        </Room>

        {/* Founder call 2026-07-28: the three real modes replace the old
            personality chips (Companion / Storyteller / Teacher). A parent
            deciding on a pre-order asks what it does, not what it is like. */}
        <Room fill="cool" id="modes" guide="joy" say="Three modes. I do the talking in all of them." reveal="left">
          <LumiModes />
        </Room>

        <Room fill="cream" id="parent-app" guide="bliss" say="You get to see everything. That's the deal." reveal="left">
          <Reveal>
            <SectionHeading
              title="You see every conversation. You decide what Lumi does next."
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
                "Lumi, ready to talk.",
                "A charger.",
                "A quick-start card. Day one takes minutes.",
              ]}
            />
            {/* TODO(claims-specs): full specs pending from founder. */}
            <p className="max-w-[62ch] text-[16.5px] text-ink-muted">
              We publish the full specs, battery, size, materials, and the wake
              word, before Lumi ships. Reserving now does not commit you to
              buy.
            </p>
          </Reveal>
        </Room>

        <Room fill="white" reveal="left">
          <ParentQuotes bare count={2} eyebrow="From the pilot" title="The first families are already talking." />
        </Room>

        <Room fill="sun" guide="joy" say="Told you she was worth it." reveal="pop">
          <Reveal>
            <SectionHeading
              level="minor"
              title={`${LAUNCH_PRICE} now. ${LATER_PRICE} after launch.`}
              titleClassName="mb-3 max-w-[20ch]"
              lede="Reserve today at ₹4,999. You pay nothing now, and Lumi stays a friend for years."
              ledeClassName="mb-7 max-w-[46ch]"
            />
            <Button href={PREORDER_HREF}>{RESERVE_LABEL}</Button>
          </Reveal>
        </Room>

        <Room fill="cream" reveal="right">
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
          <FootnotesRow items={V3_FOOTNOTES} className="mx-auto mt-10 max-w-[820px] border-t border-line-soft pt-6" />
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
