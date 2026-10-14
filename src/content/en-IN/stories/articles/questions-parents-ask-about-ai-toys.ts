/// <reference types="next/image-types/global" />
import bedtimeWithBaba from "@ds/assets/Photo library/tara-03-bedtime-with-baba-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG } from "../../organization";
import { RETENTION_LINE } from "../../policies";
import { product } from "../../products/kheelu/product";

/** The languages Kheelu speaks, by name, and its launch ceiling (product.ts), never a typed list. */
const LANGUAGE_NAMES = product.languages.map((l) => l.name);
const LANGUAGES_LINE = `It speaks ${LANGUAGE_NAMES.slice(0, -1).join(", ")} and ${LANGUAGE_NAMES.at(-1)}, with up to ${product.languageCeiling} languages at launch.`;

/**
 * The hard questions parents ask about AI toys: rewritten (task 5.19) from its approved copy page
 * (wiki/site/pages/story-questions-parents-ask-about-ai-toys.md; CMO review round 2). No mockup: the article template
 * renders it, as the three approved articles. Head and lead are the hub card's words (stories.md fold 4); the
 * first-published date is the stub's, the related list CMO built-page review B's ring (finding m3, task 7.1d; the copy
 * page's fold 9): the safe-AI-toy, AI-tutor and data-law guides, all in its own topic. Fold 4 leads with Common Sense Media's advice and the B3 answer's
 * first three sentences, then the page's one in-text product link; the facts follow D018 and D020 in the founder's
 * order, with the retention line every page prints (policies.ts) and the languages from the product facts. The light's
 * colour is never named (D018); no word "safe" about Kheelu. `updated` is the rewrite's date.
 */
export const article = {
  slug: "questions-parents-ask-about-ai-toys",
  meta: {
    title: "Does an AI toy record your child? Hard questions · Kheelona",
    description:
      "Does an AI toy record your child? Kheelu only listens when someone presses its wake-up button. The hard questions parents ask, answered straight.",
    og: DEFAULT_OG,
  },
  card: {
    title: "The hard questions parents ask about AI toys",
    summary: "The questions parents ask before buying a talking toy, answered straight, including the uncomfortable ones.",
  },
  related: ["what-to-look-for-in-a-safe-ai-toy", "does-a-three-year-old-need-an-ai-tutor", "ai-toys-and-indias-data-law"],
  published: "2026-09-11",
  updated: "2026-10-13",
  head: {
    title: "The {hand:hard questions} parents ask about AI toys",
    lead: "The questions parents ask before buying a talking toy, answered straight, including the uncomfortable ones.",
    author: "Aman Soni",
    readMinutes: 4,
    image: {
      src: bedtimeWithBaba,
      alt: "A father in glasses laughs as he reads a picture book aloud at bedtime, while his daughter, tucked in under a patchwork quilt, hugs Kheelu and smiles up at him.",
    },
  },
  /* Fold 2: the answer first (57 words). */
  answer: {
    question: "Does an AI toy record your child?",
    answer:
      "Any AI toy has to capture your child’s voice to answer, so yes, while it is listening. What matters is when it listens and what is kept. Kheelu’s microphone turns on only when someone presses the wake-up button, and switches itself off after about a minute of quiet. You can read every conversation in the parent app.",
  },
  body: [
    /* Fold 3: who is answering (no heading) */
    {
      kind: "part",
      blocks: [
        {
          kind: "p",
          text: "We make Kheelu, a screen-free plush toy for children aged 3 to 7, so read every answer below as coming from an interested party. Each one says what to ask any maker first, then how Kheelu answers. We start with the question that is hardest for us.",
        },
      ],
    },
    /* Fold 4: the hardest question, with the page's one in-text product link */
    {
      kind: "part",
      title: "Should a young child have an AI toy at all?",
      blocks: [
        {
          kind: "p",
          text: "In January 2026, Common Sense Media advised parents not to give AI toys, which it describes as “smart toys with voice-based interactions”, to children aged 5 and under, and to use extreme caution before buying them for children aged 6 to 12.[^1]",
        },
        {
          kind: "p",
          text: "Kheelu is made for children aged 3 to 7. Common Sense Media’s advice covers that whole range: avoid AI toys at 5 and under, and use extreme caution at 6 and 7. You should hear that from us.",
        },
        {
          kind: "p",
          text: "The answers below show how we built [Kheelu](/products/kheelu) on each worry, so you can check it yourself and decide. If your child is 3, keep a grown-up nearby while they play.",
        },
        {
          kind: "p",
          text: "What child-safety groups found, worry by worry, is in [What to look for in a safe AI toy](/stories/what-to-look-for-in-a-safe-ai-toy).",
        },
      ],
    },
    /* Fold 5: listening and your child's voice (D018, then D020's order) */
    {
      kind: "part",
      title: "Listening and your child’s voice",
      blocks: [
        {
          kind: "questions",
          items: [
            {
              question: "Is it always listening?",
              answer: [
                "Ask what turns the microphone on, what turns it off, and how you can tell. A toy that waits to hear its name has to listen all the time to catch it.",
                "Kheelu has no wake word to listen for. Its microphone turns on only when someone presses the wake-up button. It stays on while your child is talking and switches itself off after about a minute of quiet. Until the next press, nothing is heard, recorded or sent.",
              ],
            },
            {
              question: "Where does my child’s voice go, and what is kept?",
              answer: [
                "Ask who processes your child’s voice and in which country, what is kept and for how long, and whether any of it is sold. A vague answer is an answer.",
                "To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India. They process your child’s voice only to produce Kheelu’s reply. They don’t keep it, and they never use it to train their AI. Our contracts with them say so.",
                RETENTION_LINE,
                "We don’t sell your data. Your child’s data is never used to advertise to them. Everything we collect, and what we use it for, is in our [privacy policy](/privacy).",
              ],
            },
            {
              question: "How can I tell when it is listening?",
              answer: [
                "You can’t check a microphone from the sofa. So prefer a sign you can see over a promise you have to trust.",
                "A light on Kheelu shows whenever it’s listening. It switches its microphone off after about a minute of quiet, so even if it’s left in a corner, it doesn’t stay listening.",
              ],
            },
          ],
        },
      ],
    },
    /* Fold 6: what it says to your child */
    {
      kind: "part",
      title: "What it says to your child",
      blocks: [
        {
          kind: "questions",
          items: [
            {
              question: "What if my child asks it something upsetting?",
              answer: [
                "Listen for a mechanism, not a reassurance: how every reply is checked for your child’s age, and who sets that age.",
                "Kheelu can’t browse the internet. Its answers come from a curated, closed content library, and every reply passes an age-graded safety layer set to the age you enter in the parent app. We attack our own safety layer before every release, and you can read every conversation afterwards.",
              ],
            },
            {
              question: "What if it gets something wrong?",
              answer: [
                "Any AI toy can get something wrong, so ask what it does when it isn’t sure.",
                "When Kheelu doesn’t know, it says so, instead of guessing. If an answer ever sounds odd, look it up together. That is a good conversation too.",
              ],
            },
          ],
        },
      ],
    },
    /* Fold 7: your family and the toy */
    {
      kind: "part",
      title: "Your family and the toy",
      blocks: [
        {
          kind: "questions",
          items: [
            {
              question: "Will it replace talking with my child?",
              answer: [
                "No. No toy replaces the people who talk with your child every day. Be wary of any toy that suggests it can.",
                "Kheelu answers your child, then asks a question back, so your child does the thinking. And after any story, from a book, a speaker or a toy, ask your child to tell it back to you.",
              ],
            },
            {
              question: "Can my child get too attached to it?",
              answer: [
                "Common Sense Media says AI toy companions “create emotional attachment by design”.[^1] It also says children aged 5 and under “cannot reliably distinguish AI from real people”.[^2] So choose a toy that says plainly what it is, and talk about it together the way you would about a character in a book.",
                "Kheelu tells your child it’s a toy, and never asks them to keep a secret from you.",
              ],
            },
            {
              question: "Does it work if we speak two languages at home?",
              answer: [
                "If your family mixes languages mid-sentence, ask whether a toy can keep up, or needs a setting changed in an app first.",
                `Kheelu can switch languages mid-sentence. ${LANGUAGES_LINE}`,
              ],
            },
          ],
        },
      ],
    },
  ],
  /* Fold 8 */
  sources: [
    {
      citation:
        "Common Sense Media, “Common Sense Media Warns Against AI Toy Companions After Research Reveals Safety Risks” (press release), 22 January 2026, paragraph 1 and the list of findings.",
      href: "https://www.commonsensemedia.org/press-releases/common-sense-media-warns-against-ai-toy-companions-after-research-reveals-safety-risks",
    },
    {
      citation: "Common Sense Media Youth AI Safety Institute, “AI Toys” (risk assessment), 2026, “Where they fall short”.",
      href: "https://institute.commonsensemedia.org/risk-assessments/ai-toys",
    },
  ],
  close: "journal",
} satisfies Article;
