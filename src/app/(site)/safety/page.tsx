import Image from "next/image";
import { TextLink } from "@/components/molecules/TextLink";
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
import { StepList } from "@/components/molecules/StepList";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { pageGraph, faqPage, breadcrumbs, pageMeta, jsonLd } from "@/lib/seo";
import { KHEELU_ART, kheeluAlt } from "@/lib/kheelu-art";
import { SUPPORT_WHATSAPP_HREF } from "@/config/site";

export const metadata = pageMeta({
  title: "Are AI toys safe? How Kheelu is built to be",
  description:
    "How Kheelu answers the questions the AI-toy investigations raised: wake-word mic, on-device thinking, no open internet, and a parent app that shows every word.",
  path: "/safety",
});

/* Revamp M4 (theme B): /safety rebuilt on the room grammar, and rewritten
   question-led per copy-v2 /SAFETY + research.md (the flagship term is "are
   AI toys safe for kids", and honesty IS the citation strategy — the answers
   acknowledge the real findings, name no competitor, then show the
   mechanisms). Every mechanism cited here is already published; nothing new
   is claimed. Toy-safety standards and certifications stay PENDING (§1.9),
   shown as "in progress" honestly, and no badge appears before it is earned.
   V3: age copy is per-answer ("tuned to your child's age") with Kheelu's own band,
   2 to 5, where a number is needed. The retired teal wash went with the palette. */

/* "The four basics" (CMO merge, 2026-10-04: the mockup's titles, the site's
   published bodies). THE MICROPHONE SWEEP: the old first rule ended "the
   microphone is off. Not muted. Off." A toy that wakes to a word has to
   listen for that word, so content doc v7's Appendix B retires the "off"
   wording, and test/claims-gated.test.ts keeps it retired. */
const WORD_RULES = [
  { title: "It listens only for its wake word.", body: "Until your child says the wake word, nothing is recorded and nothing is sent. Kheelu starts talking only when it is invited to." },
  { title: "Filters live on the device.", body: "The first safety checks happen on the toy itself, before anything travels anywhere." },
  { title: "Answers are checked for age.", body: "Replies pass through a safety layer tuned to your child's age before Kheelu speaks. On-device and cloud filters work together." },
  { title: "It cannot go on the internet.", body: "Kheelu cannot browse, search, or stumble. No random videos, no endless detours, no strangers. Ever." },
] as const;

/* Where the voice goes, in three stops (the mockup's path). Founder-confirmed
   2026-10-04: a child's voice goes only to Kheelona's own servers, in India. */
const VOICE_PATH = [
  { title: "On the toy", body: "Kheelu hears the wake word, and the first safety checks happen on the toy itself, before anything travels anywhere." },
  { title: "Our own servers, in India", body: "Open conversation uses your home WiFi and Kheelona's own servers in India. Nothing goes to another country to be processed." },
  { title: "Back to you", body: "The conversation appears in your app, word for word. It is never sold, and never used to sell your child anything." },
] as const;

const VOICE_RULES = [
  { title: "Kept in India", body: "Your family's conversations stay on our own servers in India. They do not travel to another country to be processed." },
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
  /* Already published as a status in lib/product-facts.ts (§8.36); the
     mockup put it in the table, which is where a parent looks for it. */
  { name: "Toy-safety certification", status: "In progress" },
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
    a: "Not all of them, and the difference is in the mechanisms. Kheelu listens only for its wake word and sends nothing before it. The first thinking happens on the device. Replies come from a closed library, never the open internet. Every conversation is readable and deletable by you. You do not have to trust a badge. You can check.",
  },
  listening: {
    q: "Is Kheelu always listening?",
    a: "No. Kheelu listens only for its wake word. Until your child says it, nothing is recorded and nothing is sent. Every conversation after the wake word is readable in the parent app, where you can delete any of it.",
  },
  voice: {
    q: "Where does my child's voice go?",
    a: "Almost nowhere. The first thinking happens on the toy. What travels goes to Kheelona's own servers in India, and is never sold. Nothing is collected without your consent, and any conversation can be deleted in one tap from the parent app.",
  },
  wrong: {
    q: "Could Kheelu say something wrong?",
    a: "Every reply passes an age-graded safety layer before it is spoken, on the device and in the cloud, and Kheelu cannot reach the open internet to find something it should not. We attack our own safety layer before every release. If something still slips, one tap from you stops everything.",
  },
  delete: {
    q: "Can I delete everything?",
    a: "Yes. The parent app holds the full conversation log, word for word, and any conversation goes with one tap. The log is private to you, it is never used to sell your child anything, and your child's voice data is never sold. Nothing is kept that you cannot delete.",
  },
} as const;

/* The drafted "Is an AI toy OK for a three-year-old?" answer is GONE (CMO
   merge, 2026-10-04). It was GATED:founder-signoff from the day it was
   written, it shipped to production unsigned anyway, and the mockup dropped it
   too. Its one new fact, that Kheelu says it is a toy, is now founder-
   confirmed and lives on Home's safety cards instead. */

/* Safety FAQ: question-led for answer engines (CMO review); answers reuse
   already-linted claims only. M4: the listening and voice-custody questions
   moved UP into visible AnswerBlocks, so the accordion carries only what the
   page does not already answer (a duplicate question in both places reads as
   padding to a parent and to a crawler). */
const SAFETY_FAQ: FaqEntry[] = [
  /* V6 D7: the old first entry near-duplicated the flagship AnswerBlock (the
     padding §8.23-4 warns against). Replaced with the dependence anxiety no
     page answered — built entirely from published facts. */
  { q: "Will Kheelu replace time with me?", a: "No, and it is not built to. Kheelu is for the moments your hands are full, not the ones they are not. The parent app gives you one simple thing to do together each day, quiet hours are yours to set, and the grown-up holds the keys, always." },
  { q: "Does Kheelu reduce screen time?", a: "That is the point. Kheelu has no screen at all. It is a toy that helps you cut screen time: your child talks, listens, and imagines instead of watching." },
  { q: "Can Kheelu reach the open internet?", a: "No. Kheelu cannot browse or search. Answers come from a closed library built for children, so there are no random videos, no endless detours, and no strangers." },
  /* SEO round 2026-08-12: the checklist restates the published what-to-look-for
     criteria (the journal's safe-AI-toy piece and the ANSWERS mechanisms above)
     — nothing here is a new claim. Carries "smart toys for toddlers" and
     "educational toys for kids" in one parents'-voice entry. */
  { q: "What should I look for in smart toys for toddlers?", a: "Five things: a toy that listens only for a wake word, answers from a closed library instead of the open internet, a conversation log you can read, voice data that stays in your country and is never sold, and replies graded for the age. The same checklist works for educational toys for kids at any age." },
  /* Status-exact, never upgraded: mirrors the STANDARDS chips above. */
  /* The standards FAQ entry was REMOVED 2026-07-31 (founder: no certificate
     received yet, keep it off the FAQ; the status-honest standards room below
     stays). Reinstate when the first certificate lands. */
];

const SAFETY_JSON_LD = pageGraph(
  faqPage([
    ...Object.values(ANSWERS).map((x) => ({ q: x.q, a: x.a })),
    ...SAFETY_FAQ,
  ]),
  breadcrumbs([{ name: "Safety", path: "/safety" }]),
);

/* THE CMO MERGE (2026-10-04): the mockup's structure (the four basics, where
   the voice goes, certificates, what if we shut down, what you control) on
   the room grammar. One deliberate difference from the mockup: the answers
   stay VISIBLE as AnswerBlocks rather than collapsing into one accordion,
   because this page ranks for "are AI toys safe" and an answer engine quotes
   what it can see (V5-3, §8.36). The page still ends in #reserve, and a
   WhatsApp band for the parent who wants a person first sits just above it. */
export default function SafetyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(SAFETY_JSON_LD) }}
      />

      <PageHero
        ratio="md:grid-cols-[1.2fr_0.8fr]"
        media={
          <Image
            src={KHEELU_ART.src}
            alt={kheeluAlt("sitting calmly")}
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
          eyebrow="Safety"
          title="How we keep Kheelu safe."
          titleClassName="mb-5 max-w-[16ch]"
          lede="You are trusting a friend near your child. This page lists what Kheelu does, what it does not do, and what we are still working on, in plain words."
          ledeClassName="max-w-[58ch]"
        />
      </PageHero>

      <RoomsTrack>
        {/* The flagship answer: acknowledge the real findings, then show the
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

        <Room fill="cool" id="the-four-basics" reveal="right">
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
              title="The four basics."
              titleClassName="mb-3"
              lede="Four rules govern every word Kheelu hears and says. They are not settings. They are how a safe toy is built."
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

        {/* Where the voice goes: the answer, the three stops, the promises */}
        <Room fill="cream" id="where-the-voice-goes-room" reveal="left">
          <Reveal className="mb-11">
            <AnswerBlock
              id="where-the-voice-goes"
              question={ANSWERS.voice.q}
              answer={ANSWERS.voice.a}
            />
          </Reveal>
          <StepList items={VOICE_PATH} className="mb-12" />
          {/* Data custody, as promises. Two columns, not four: at four the
              titles wrapped mid-phrase ("Deletable / in one tap"). */}
          <div className="grid gap-5 sm:grid-cols-2">
            {VOICE_RULES.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05}>
                <Card className="h-full border border-line bg-white">
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

        {/* Certificates: status-honest, never upgraded (claims gate). */}
        <Room fill="white" id="certificates" reveal="left">
          <Reveal>
            {/* TODO(claims-certs): exact toy-safety standards and certificate
                references pending from founder. No physical claims before
                certification (copy-review verdict). */}
            <SectionHeading
              title="Certificates: what is done and what is next."
              titleClassName="mb-4 max-w-[22ch]"
              lede="Kheelu is designed for small hands and big feelings. We are completing formal toy-safety testing now, and the exact materials, standards, and certificates will be listed here, in full, before Kheelu ships. No badge appears here before it is earned."
              ledeClassName="mb-8 max-w-[62ch]"
            />
          </Reveal>
          <Reveal>
            <ul className="flex flex-wrap gap-3">
              {STANDARDS.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center gap-3 rounded-full border border-line bg-cream px-5 py-2.5"
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

        {/* The mockup's shut-down question, answered with what is true today.
            Its "We plan to be here for years" was a promise nobody signed, so
            the answer says which parts need us and which do not, and stops. */}
        <Room fill="sun" id="if-we-shut-down" reveal="right">
          <Reveal>
            <SectionHeading
              level="minor"
              title="What if Kheelona ever shuts down?"
              titleClassName="mb-4"
              lede="You deserve a straight answer. Open conversation in AI mode needs our servers. Story-mode stories and lessons play offline, and Bluetooth music needs only a paired phone."
              ledeClassName="max-w-[60ch] text-ink"
            />
          </Reveal>
        </Room>

        <Room fill="cool" id="what-you-control" reveal="left">
          <Reveal>
            <SectionHeading
              title="What you control."
              titleClassName="mb-4"
              lede="Kheelu never decides what is right for your family. You do. The parent app is where you turn the keys:"
              ledeClassName="mb-6 max-w-[54ch]"
            />
            <CheckList items={PARENT_KEYS} className="mb-8 space-y-3" />
            <TextLink href="/products/kheelu#parent-app">See the parent app on the Kheelu page</TextLink>
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

        {/* The mockup's closing band: a person first, for the parent who
            wants one before paying. The finale still follows it. */}
        <Room fill="white" id="ask-a-person" reveal="left">
          <Reveal>
            <SectionHeading
              level="minor"
              title="Still have a safety question?"
              titleClassName="mb-3"
              lede="A real person answers, on WhatsApp."
              ledeClassName="mb-6"
            />
            <Button href={SUPPORT_WHATSAPP_HREF} variant="ghost">
              Ask us on WhatsApp
            </Button>
          </Reveal>
        </Room>

        <Room fill="white" id="reserve" reveal="pop" className="overflow-x-clip">
          <FinaleCTA bare variant="compact" />
        </Room>
      </RoomsTrack>
    </>
  );
}
