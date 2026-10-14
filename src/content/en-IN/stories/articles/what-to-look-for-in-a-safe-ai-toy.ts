/// <reference types="next/image-types/global" />
import bellyModule from "@ds/assets/Kheelu/kheelu-belly-module.png";
import eveningWithAmma from "@ds/assets/Photo library/tara-02-evening-with-amma-web.webp";
import type { Article, TrustListItem } from "@/content/types";
import { RETENTION_LINE } from "../../policies";
import { seller } from "../../seller";

/** One of Kheelu's checkable facts in fold 5: a bold lead-in, then the fact. */
const fact = (icon: string, title: string, body: string): TrustListItem => ({ icon, title, body });

/**
 * What to look for in a safe AI toy: rewritten and approved (mockup
 * story-what-to-look-for-in-a-safe-ai-toy.html; copy page of the same name). Head, byline (its
 * author is named on /team), photo, answer, body, sources, related guides and close as the mockup
 * shows them; card words as the hub's (stories.md fold 4). Fold 5 is the signed B3 answer, then
 * Kheelu's facts in the founder's order (D020) with the retention line every page prints
 * (policies.ts), the page's one in-text product link, and the help line every CTA block carries
 * (seller.ts). The facts take the live team's code-checked words where D058 narrowed them (task
 * 8b.2a: the copy page's "Changes after approval"; the mockup's Gate A words are an accepted
 * deviation, deviations.ts ARTICLE_CLAIM_FIXES). No word "safe" about Kheelu; the light's colour is
 * never named (D018). `updated` is the rewrite's date (task 5.6).
 */
export const article = {
  slug: "what-to-look-for-in-a-safe-ai-toy",
  meta: {
    title: "What to look for in a safe AI toy · Kheelona",
    description:
      "What to look for in a safe AI toy: what Common Sense Media and Fairplay advise, the checks to make before one comes home, and how Kheelu measures up.",
    og: {
      image: "/og/tara-02-evening-with-amma.jpg",
      alt: "A laughing girl holds Kheelu on the sofa while her mother, a steel tumbler in one hand and a phone in the other, laughs with her.",
    },
  },
  card: {
    title: "What to look for in a safe AI toy",
    summary: "What child-safety groups say about AI toys, the checks to make before one comes home, and how Kheelu measures up.",
  },
  related: ["questions-parents-ask-about-ai-toys", "should-kids-use-ai", "ai-toys-and-indias-data-law"],
  published: "2026-07-28",
  updated: "2026-10-12",
  head: {
    title: "What to {hand:look for} in a safe AI toy",
    lead: "What child-safety groups say about AI toys, the checks to make before one comes home, and how Kheelu measures up.",
    author: "Aman Soni",
    readMinutes: 5,
    image: {
      src: eveningWithAmma,
      alt: "A laughing girl holds Kheelu on the sofa while her mother, a steel tumbler in one hand and a phone in the other, laughs with her.",
    },
  },
  /* Fold 2: the answer first (54 words), with no product in it. */
  answer: {
    question: "What should you look for in a safe AI toy?",
    answer:
      "Look for mechanisms you can check, not promises. Ask when the microphone is on, whether the toy can reach the open internet, where your child’s voice goes and who keeps it, whether you can read and delete every conversation, and how replies are filtered for your child’s age. Then weigh what child-safety groups say.",
  },
  body: [
    /* Fold 3: the two warnings, cited in full (B3) */
    {
      kind: "part",
      title: "What do child-safety groups say about AI toys?",
      blocks: [
        {
          kind: "p",
          text: "In November 2025 Fairplay, a children’s advocacy group, published an advisory signed by more than 150 experts and organisations telling parents not to buy AI toys that season.[^1]",
        },
        {
          kind: "p",
          text: "In January 2026, Common Sense Media advised parents not to give AI toys, which it describes as “smart toys with voice-based interactions”, to children aged 5 and under, and to use extreme caution before buying them for children aged 6 to 12.[^2] When it tested three AI toys, it rated 27% of their replies as not appropriate for kids. It also raised concerns about toys designed to create emotional attachment, the data they collect and how reliably they work.[^3]",
        },
        { kind: "p", text: "Common Sense Media also says children aged 5 and under “cannot reliably distinguish AI from real people”.[^3]" },
        {
          kind: "p",
          text: "Before any AI toy comes home, ask what it does with your child’s voice, what you can see as a parent, and how it handles a hard question.",
        },
      ],
    },
    /* Fold 4: the warnings as questions a parent can put to any maker */
    {
      kind: "part",
      title: "What to look for, warning by warning",
      blocks: [
        { kind: "p", text: "Most of these worries are about how a toy is built, so check the build. Put each question below to the maker and expect a plain answer." },
        {
          kind: "questions",
          items: [
            {
              question: "When is the microphone on?",
              answer: [
                "Look for a toy that listens only after you or your child start it, and that shows you when it is listening. Ask whether it has a camera at all. Common Sense Media found that AI toys “collect extensive data in children’s private spaces”.[^2]",
              ],
            },
            {
              question: "Can it reach the open internet?",
              answer: [
                "Ask where its answers come from. A toy that can browse or search can stumble onto things your child should not hear, and a filter on top then has to catch everything. Look for a toy that cannot browse the internet at all.",
              ],
            },
            {
              question: "Can you read and delete every conversation?",
              answer: [
                "You would not leave your child with a babysitter who won’t tell you how the afternoon went. Ask whether you can read every conversation, word for word, and delete any of it yourself, without emailing anyone. A summary is not the conversation.",
              ],
            },
            {
              question: "Where does your child’s voice go, and who keeps it?",
              answer: [
                "Ask who processes your child’s voice and in which country, whether any of it is kept and for how long, and whether it is ever sold or used to advertise to your child. A vague answer is an answer. For what India’s data law asks of companies, read [What India’s data law asks of a toy that listens](/stories/ai-toys-and-indias-data-law).",
              ],
            },
            {
              question: "Is it built for your child’s age?",
              answer: [
                "Ask how replies are filtered for the age of the child playing, and who sets that age. Ask, too, what the toy does when it doesn’t know something. The answer you want: it says so.",
              ],
            },
            {
              question: "Does it pretend to be more than a toy?",
              answer: [
                "Common Sense Media says AI toy companions “create emotional attachment by design”.[^2] Look for a toy that tells your child it is a toy, and never asks your child to keep a secret from you.",
              ],
            },
          ],
        },
        { kind: "p", text: "To compare toys side by side, use the shorter checklist in our guide to [AI toys for kids in India](/ai-toys-for-kids-in-india)." },
      ],
    },
    /* Fold 5: how Kheelu is built against each worry; the facts widen out of the column from 1200 px */
    {
      kind: "part",
      variant: "breakout",
      title: "How is Kheelu built against each worry?",
      blocks: [
        {
          kind: "p",
          text: "Kheelu is made for children aged 3 to 7. Common Sense Media’s advice covers that whole range: avoid AI toys at 5 and under, and use extreme caution at 6 and 7. You should hear that from us. Here is how we built [Kheelu](/products/kheelu) on each point above, so you can check it yourself and decide.",
        },
        {
          kind: "facts",
          items: [
            fact(
              "microphone",
              "The microphone.",
              "It turns on only when someone presses the wake-up button, and a light on Kheelu shows whenever it’s listening. It switches itself off after a couple of minutes of quiet. Kheelu has no camera.",
            ),
            fact(
              "lock-simple",
              "Your child’s voice.",
              "To understand and answer your child, Kheelu uses trusted speech and AI providers. They process your child’s voice only to produce Kheelu’s reply. They don’t keep it, and they never use it to train their AI. Our contracts with them say so.",
            ),
            fact(
              "eye",
              "Every conversation.",
              `You can read every conversation in the parent app. ${RETENTION_LINE} Delete them all sooner by deleting your account.`,
            ),
            fact("hand-heart", "Your data.", "We don’t sell your data. Your child’s data is never used to advertise to them."),
            fact(
              "wifi-slash",
              "No open internet.",
              "Kheelu can’t browse the internet. Its answers are generated by an AI model. On every conversation, the model is given child-safety rules and the age you enter in the parent app, with Google’s safety filters on top.",
            ),
            fact("question", "When it doesn’t know.", "It says so, instead of guessing."),
            fact("smiley", "A toy, and it says so.", "It tells your child it’s a toy, and never asks them to keep a secret from you."),
            fact("clock", "Certification.", "Kheelu’s toy-safety (BIS) licence has been applied for and is not yet granted. No badge appears before it is earned."),
          ],
          figure: { src: bellyModule, alt: "Kheelu’s tummy unit up close, with its speaker, light ring and buttons." },
        },
        { kind: "p", text: "If your child is 3, keep a grown-up nearby while they play." },
        {
          kind: "p",
          text: `Whether that is enough is your call. The detail is on our [Safety page](/safety), and you can ask us anything: ${seller.help.contact}.`,
        },
      ],
    },
  ],
  /* Fold 6 */
  sources: [
    { citation: "Fairplay, “AI Toys are NOT Safe for Kids” (advisory), 2025, opening paragraph.", href: "https://fairplayforkids.org/pf/aitoyadvisory/" },
    {
      citation:
        "Common Sense Media, “Common Sense Media Warns Against AI Toy Companions After Research Reveals Safety Risks” (press release), 22 January 2026, paragraph 1 and the list of findings.",
      href: "https://www.commonsensemedia.org/press-releases/common-sense-media-warns-against-ai-toy-companions-after-research-reveals-safety-risks",
    },
    {
      citation: "Common Sense Media Youth AI Safety Institute, “AI Toys” (risk assessment), 2026, “What we found” and “Where they fall short”.",
      href: "https://institute.commonsensemedia.org/risk-assessments/ai-toys",
    },
  ],
  close: "journal",
} satisfies Article;
