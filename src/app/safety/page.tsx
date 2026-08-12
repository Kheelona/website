import Image from "next/image";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { AnswerBlock } from "@/components/molecules/AnswerBlock";
import { PromiseMark } from "@/components/molecules/PromiseMark";
import { PageHero } from "@/components/templates/PageHero";
import { Card } from "@/components/molecules/Card";
import { CheckList } from "@/components/molecules/CheckList";
import { Reveal } from "@/components/molecules/Reveal";
import { Button } from "@/components/atoms/Button";
import { Faq, type FaqEntry } from "@/components/molecules/Faq";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { graph, faqPage, breadcrumbs, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Are AI toys safe? How Lumi is built to be",
  description:
    "How Lumi answers the questions the AI-toy investigations raised: wake-word mic, on-device thinking, no open internet, and a parent app that shows every word.",
  path: "/safety",
});

/* Revamp M4 (theme B): /safety rebuilt on the room grammar, and rewritten
   question-led per copy-v2 /SAFETY + research.md (the flagship term is "are
   AI toys safe for kids", and honesty IS the citation strategy — the answers
   acknowledge the real findings, name no competitor, then show the
   mechanisms). Every mechanism cited here is already published; nothing new
   is claimed. Toy-safety standards and certifications stay PENDING (§1.9),
   shown as "in progress" honestly, and no badge appears before it is earned.
   V3: age copy is per-answer ("tuned to your child's age") with Lumi's own band,
   2 to 5, where a number is needed. The retired teal wash went with the palette. */

const WORD_RULES = [
  { title: "Listening starts with the wake word.", body: "Lumi listens only after your child says the wake word. The rest of the time, the microphone is off. Not muted. Off." },
  { title: "Filters live on the device.", body: "The first safety checks happen on the toy itself, before anything travels anywhere." },
  { title: "Every answer is age-graded.", body: "Replies pass through a safety layer tuned to your child's age. On-device and cloud filters work together." },
  { title: "There is no open internet.", body: "Lumi cannot browse, search, or stumble. No random videos, no rabbit holes, no strangers. Ever." },
] as const;

const VOICE_RULES = [
  { title: "Region-pinned", body: "Your family's conversations stay in your region. They do not travel to another country to be processed." },
  { title: "Parent-consented", body: "Nothing is collected without your say-so. If you have not said yes, it does not happen." },
  { title: "Deletable in one tap", body: "Read any conversation in the parent app. Delete any of it, whenever you like." },
  { title: "Never sold", body: "Your child's voice data is never sold, and never used to sell them anything." },
] as const;

/* V5-3 (2026-07-31 review): the four-step custody chain that used to sit here
   was DELETED. It restated WORD_RULES above almost word for word — "Not muted.
   Off." appeared in both, one section apart — so the page stated one promise
   four times in a single fold: the answer block, the steps, the rules row, and
   the closing display line. The mechanisms live in WORD_RULES; the data-custody
   facts live in VOICE_RULES; each is now said once. Law: §8.23-4. */

/* R7: standards, status-for-status as published on kheelona.ai/safety.
   Never upgrade a status here (claims gate). */
const STANDARDS = [
  { name: "COPPA (2026)", status: "Designed for" },
  { name: "GDPR-K", status: "Designed for" },
  { name: "India DPDP", status: "Designed for" },
  { name: "ISO 27001", status: "In progress" },
] as const;

const PARENT_KEYS = [
  "Topics: you choose what is open and what waits.",
  "Time: quiet hours are yours to set.",
  "Languages: pick the ones you speak at home.",
  "The log: every conversation, readable and deletable.",
] as const;

/* The question-led answers (copy-v2 + research AEO bank). Each is 40 to 60
   words, visible on the page, and assembled only from published mechanisms.
   They live in one place because the FAQPage graph below must mirror the
   visible copy exactly. */
const ANSWERS = {
  flagship: {
    q: "Are AI toys safe for children?",
    /* V5-3: 85 words → 57. This is the page's primary citable answer and answer
       engines quote 40 to 60 words, so length was costing us the citation. The
       independent-testing context moved into the page body where it belongs; the
       mechanisms and the closing challenge — the strongest line here — stay. */
    a: "Not all of them, and the difference is in the mechanisms. Lumi's mic wakes to a word and is off otherwise. The first thinking happens on the device. Replies come from a closed library, never the open internet. Every conversation is readable and deletable by you. You do not have to trust a badge. You can check.",
  },
  listening: {
    q: "Is Lumi always listening?",
    a: "No. Lumi listens only after your child says the wake word. The rest of the time the microphone is off, not muted. Off. Nothing is recorded before the wake word, and every conversation after it is readable in the parent app, where you can delete any of it.",
  },
  voice: {
    q: "Where does my child's voice go?",
    a: "Almost nowhere. The first thinking happens on the toy. What travels goes to Kheelona's own voice brain, stays in your region, and is never sold. Nothing is collected without your consent, and any conversation can be deleted in one tap from the parent app.",
  },
  wrong: {
    q: "Could Lumi say something wrong?",
    a: "Every reply passes an age-graded safety layer before it is spoken, on the device and in the cloud, and Lumi cannot reach the open internet to find something it should not. We attack our own safety layer before every release. If something still slips, one tap from you stops everything.",
  },
  delete: {
    q: "Can I delete everything?",
    a: "Yes. The parent app holds the full conversation log, word for word, and any conversation goes with one tap. The log is private to you, it is never used to sell your child anything, and your child's voice data is never sold. Nothing is kept that you cannot delete.",
  },
} as const;

/* GATED:founder-signoff (copy-v2 /SAFETY) — the point-by-point reply to
   child-development guidance on AI toys. Drafted, NOT approved: it renders on
   the revamp preview so the founder can read it in place, and it comes out
   before the merge to master unless they sign it off. It is deliberately kept
   out of the schema graph, so pulling the block never leaves orphaned
   structured data behind. */
const GATED_UNDER_FIVE = {
  q: "Is an AI toy OK for a three-year-old?",
  a: "Child-development groups say to be careful with AI toys, and we agree with most of what they ask for. They want toys that cannot reach the open internet. Lumi cannot. They want parents to see every conversation. You do. They want no ads and no data selling. There are none. And they want toys that do not pretend to be alive. Lumi is a toy that listens and answers, and the grown-up holds the keys.",
} as const;

/* Safety FAQ: question-led for answer engines (CMO review); answers reuse
   already-linted claims only. M4: the listening and voice-custody questions
   moved UP into visible AnswerBlocks, so the accordion carries only what the
   page does not already answer (a duplicate question in both places reads as
   padding to a parent and to a crawler). */
const SAFETY_FAQ: FaqEntry[] = [
  /* V6 D7: the old first entry near-duplicated the flagship AnswerBlock (the
     padding §8.23-4 warns against). Replaced with the dependence anxiety no
     page answered — built entirely from published facts. */
  { q: "Will Lumi replace time with me?", a: "No, and it is not built to. Lumi is for the moments your hands are full, not the ones they are not. The parent app gives you one simple thing to do together each day, quiet hours are yours to set, and the grown-up holds the keys, always." },
  { q: "Does Lumi reduce screen time?", a: "That is the point. Lumi has no screen at all. It is a toy that helps you cut screen time: your child talks, listens, and imagines instead of watching." },
  { q: "Can Lumi reach the open internet?", a: "No. Lumi cannot browse or search. Answers come from a closed library built for children, so there are no random videos, no rabbit holes, and no strangers." },
  /* Status-exact, never upgraded: mirrors the STANDARDS chips above. */
  /* The standards FAQ entry was REMOVED 2026-07-31 (founder: no certificate
     received yet, keep it off the FAQ; the status-honest standards room below
     stays). Reinstate when the first certificate lands. */
];

const SAFETY_JSON_LD = graph(
  faqPage([
    ...Object.values(ANSWERS).map((x) => ({ q: x.q, a: x.a })),
    ...SAFETY_FAQ,
  ]),
  breadcrumbs([{ name: "Safety", path: "/safety" }]),
);

export default function SafetyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SAFETY_JSON_LD) }}
      />

      <PageHero
        ratio="md:grid-cols-[1.2fr_0.8fr]"
        guide="bliss"
        /* GATED:kheelu-line — founder sign-off before merge to master */
        say="No jokes on this page. Parents read this twice."
        media={
          <Image
            src="/product/lumi-blue-2.png"
            alt="Lumi, the sky blue talking plush toy, sitting calmly"
            width={1234}
            height={1600}
            sizes="(max-width: 768px) 60vw, 300px"
            priority
            className="h-auto w-full max-w-[300px]"
          />
        }
      >
        <SectionHeading
          as="h1"
          eyebrow="Safety"
          title="Safe in their hands. Careful with their words."
          titleClassName="mb-5 max-w-[16ch]"
          lede="You are not buying a gadget. You are trusting a friend near your child. Here is everything that friend will and will not do, in plain words."
          ledeClassName="max-w-[58ch]"
        />
      </PageHero>

      <RoomsTrack>
        {/* The flagship answer: acknowledge what testers found, then show the
            mechanisms. No competitor is named. */}
        <Room fill="white" reveal="left">
          <Reveal>
            <AnswerBlock
              level="section"
              id="are-ai-toys-safe"
              question={ANSWERS.flagship.q}
              answer={ANSWERS.flagship.a}
            />
          </Reveal>
        </Room>

        {/* The words */}
        <Room fill="cool" reveal="right">
          <Reveal className="mb-11">
            <AnswerBlock
              id="always-listening"
              question={ANSWERS.listening.q}
              answer={ANSWERS.listening.a}
            />
          </Reveal>
          <Reveal>
            <SectionHeading
              level="minor"
              title="Careful with their words."
              titleClassName="mb-3"
              lede="Four rules govern every word Lumi hears and says. They are not settings. They are how it is built."
              ledeClassName="mb-10 max-w-[58ch]"
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {WORD_RULES.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.05}>
                <Card
                  className="bg-white p-8"
                  title={r.title}
                  titleClassName="mb-2 font-display text-[24px] font-extrabold text-ink-head"
                >
                  <p className="text-[16px]">{r.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Room>

        {/* Where the voice goes: the custody chain */}
        <Room fill="cream" reveal="left">
          <Reveal className="mb-11">
            <AnswerBlock
              id="where-the-voice-goes"
              question={ANSWERS.voice.q}
              answer={ANSWERS.voice.a}
            />
          </Reveal>
          {/* Data custody, as promises. Two columns, not four: at four the
              titles wrapped mid-phrase ("Deletable / in one tap"). */}
          <div className="grid gap-5 sm:grid-cols-2">
            {VOICE_RULES.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05}>
                <Card className="h-full border border-line-soft bg-white">
                  <PromiseMark index={i} className="mb-3" />
                  <h3 className="mb-2 font-display text-[22px] font-extrabold text-ink-head">
                    {c.title}
                  </h3>
                  <p className="text-[15.5px]">{c.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal>
            {/* R11 voice-lint: "can't" de-contracted — the .ai line arrived
                verbatim, but the contraction gate outranks the reference
                (founder can revert on live read; copy-reference R11) */}
            <p className="mt-10 max-w-[40ch] font-display text-[clamp(22px,2.4vw,28px)] font-extrabold leading-[1.25] text-ink-head">
              Nothing leaves without consent. Nothing stays that you cannot
              delete.
            </p>
          </Reveal>
        </Room>

        {/* The two questions parents ask next */}
        <Room fill="white" reveal="right">
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal>
              <AnswerBlock id="could-it-say-something-wrong" question={ANSWERS.wrong.q} answer={ANSWERS.wrong.a} />
            </Reveal>
            <Reveal delay={0.06}>
              <AnswerBlock id="can-i-delete-everything" question={ANSWERS.delete.q} answer={ANSWERS.delete.a} />
            </Reveal>
          </div>
        </Room>

        {/* GATED:founder-signoff — see the GATED_UNDER_FIVE note above. */}
        <Room fill="sun" reveal="left">
          <Reveal>
            <AnswerBlock
              id="ok-for-a-three-year-old"
              question={GATED_UNDER_FIVE.q}
              answer={GATED_UNDER_FIVE.a}
            />
          </Reveal>
        </Room>

        {/* Safe in their hands: the physical toy */}
        <Room fill="white" reveal="right">
          <Reveal>
            {/* TODO(claims-certs): exact toy-safety standards and certificate
                references pending from founder. No physical claims before
                certification (copy-review verdict); launch gate needs the list. */}
            <SectionHeading
              title="Safe in their hands."
              titleClassName="mb-4"
              lede="Lumi is designed for small hands and big feelings. We are completing formal toy-safety testing now. The exact materials, standards, and certificates will be listed here, in full, before Lumi ships."
              ledeClassName="mb-10 max-w-[62ch]"
            />
            <SectionHeading
              level="minor"
              title="The standards we build against."
              titleClassName="mb-3"
              lede="These are the children's privacy frameworks Lumi is designed for, and where our certifications stand today. No badge appears here before it is earned."
              ledeClassName="mb-8 max-w-[58ch] text-[17px]"
            />
          </Reveal>
          <Reveal>
            <ul className="flex flex-wrap gap-3">
              {STANDARDS.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center gap-3 rounded-full border border-line-soft bg-cream px-5 py-2.5"
                >
                  <span className="text-[16px] font-semibold text-ink-head">{s.name}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[12px] font-bold uppercase tracking-wide ${
                      s.status === "In progress" ? "bg-yellow/25 text-ink-head" : "bg-blue/20 text-ink-head"
                    }`}
                  >
                    {s.status}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Room>

        {/* The grown-up holds the keys */}
        <Room fill="cool" reveal="left">
          <Reveal>
            <SectionHeading
              title="The grown-up holds the keys."
              titleClassName="mb-4"
              lede="Lumi never decides what is right for your family. You do. The parent app is where you turn the keys:"
              ledeClassName="mb-6 max-w-[54ch]"
            />
            <CheckList items={PARENT_KEYS} className="mb-8 space-y-3" />
            <Button href="/products/lumi" variant="ghost">
              See the parent app on the Lumi page
            </Button>
          </Reveal>
        </Room>

        {/* Safety questions (AEO) */}
        <Room fill="cream" reveal="right">
          <Reveal>
            <SectionHeading
              title="The questions we would ask too."
              titleClassName="mb-3"
              lede="Straight answers about AI toys and your child."
              ledeClassName="mb-10 max-w-[58ch]"
            />
          </Reveal>
          <Reveal className="mx-auto max-w-[820px]">
            <Faq items={SAFETY_FAQ} />
          </Reveal>
        </Room>

        <Room
          fill="white"
          id="reserve"
          guide="silly"
          /* GATED:kheelu-line */
          say="Save your spot. I'll mind Lumi till launch."
          reveal="pop"
          className="overflow-x-clip"
        >
          <FinaleCTA bare variant="compact" />
        </Room>
      </RoomsTrack>
    </>
  );
}
