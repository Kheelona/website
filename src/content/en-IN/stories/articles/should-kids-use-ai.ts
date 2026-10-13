/// <reference types="next/image-types/global" />
import blockRocket from "@ds/assets/Photo library/kabir-02-block-rocket-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG } from "../../organization";
import { RETENTION_LINE } from "../../policies";

/**
 * Should kids use AI? An honest answer from people who build it: rewritten (task 5.19) from its approved copy page
 * (wiki/site/pages/story-should-kids-use-ai.md; CMO review round 2). No mockup: the article template renders it, as the
 * three approved articles. Head and lead are the hub card's words (stories.md fold 4); the related list and
 * first-published date are the stub's. Common Sense Media is cited three times on purpose (the answer, fold 5 in full,
 * fold 8's B3 answer word for word). The research fold names no product (D016); fold 8 holds the page's one in-text
 * product link and Kheelu's facts in the founder's order (D020), the retention line from policies.ts; the facts widen
 * out of the column from 1200 px, as the safe-AI-toy guide's. `updated` is the rewrite's date.
 */
export const article = {
  slug: "should-kids-use-ai",
  meta: {
    title: "Should kids use AI? An honest answer · Kheelona",
    description:
      "Should kids use AI? What child-safety groups advise, what young children need from the adults around them, and how to judge any toy with AI inside.",
    og: DEFAULT_OG,
  },
  card: {
    title: "Should kids use AI? An honest answer from people who build it",
    summary: "Where the line sits between AI built for adults and a toy built for young children, and how to judge any toy with AI inside.",
  },
  related: ["raising-a-bilingual-child-in-india", "does-a-three-year-old-need-an-ai-tutor", "questions-parents-ask-about-ai-toys"],
  published: "2026-07-28",
  updated: "2026-10-13",
  head: {
    title: "Should kids use AI? An {hand:honest answer} from people who build it",
    lead: "Where the line sits between AI built for adults and a toy built for young children, and how to judge any toy with AI inside.",
    author: "Aman Soni",
    readMinutes: 5,
    image: {
      src: blockRocket,
      alt: "A boy in round glasses and an olive T-shirt kneels on a patterned rug, grinning as he stacks wooden blocks into a tall tower, with Kheelu sitting beside it.",
    },
  },
  /* Fold 2: the answer first (60 words), with no product in it. */
  answer: {
    question: "Should kids use AI at all?",
    answer:
      "Not the AI built for adults. Common Sense Media advises against AI toys at 5 and under, and extreme caution from 6 to 12.[^1] If you choose AI for your child’s play, it should be built for their age, unable to browse the internet and fully visible to you. It should ask your child questions, not just give answers.",
  },
  body: [
    /* Fold 3: who is answering (no heading) */
    {
      kind: "part",
      blocks: [
        {
          kind: "p",
          text: "We build a toy with AI inside, for children aged 3 to 7, so we may be the last people you should ask, or the first. Either way, here is our answer in full, including where child-safety groups disagree with us.",
        },
      ],
    },
    /* Fold 4: the worry */
    {
      kind: "part",
      title: "What is the worry about children and AI?",
      blocks: [
        {
          kind: "p",
          text: "In a May 2026 commentary for the Brookings Institution, Rebecca Winthrop, who directs its Center for Universal Education, described one worry about children and AI as “cognitive stunting”: relying too heavily on AI “reduces children’s opportunities to engage in effortful thinking”.[^2] She points to children’s wide use of “general-purpose chatbots and AI companions not designed for learning”, and calls the evidence early.[^2]",
        },
        { kind: "p", text: "Give your child time to think before anyone, or anything, gives the answer." },
      ],
    },
    /* Fold 5: what child-safety groups advise, cited in full (B3) */
    {
      kind: "part",
      title: "What do child-safety groups advise?",
      blocks: [
        {
          kind: "p",
          text: "In November 2025 Fairplay, a children’s advocacy group, published an advisory signed by more than 150 experts and organisations telling parents not to buy AI toys that season.[^3]",
        },
        {
          kind: "p",
          text: "In January 2026, Common Sense Media advised parents not to give AI toys, which it describes as “smart toys with voice-based interactions”, to children aged 5 and under, and to use extreme caution before buying them for children aged 6 to 12.[^1] When it tested three AI toys, it rated 27% of their replies as not appropriate for kids. It also raised concerns about toys designed to create emotional attachment, the data they collect and how reliably they work.[^4]",
        },
        { kind: "p", text: "Common Sense Media also says children aged 5 and under “cannot reliably distinguish AI from real people”.[^4]" },
        {
          kind: "p",
          text: "Most of these concerns are about how a toy is built, and those you can check. The age advice is about young children themselves, and only you can weigh it for yours.",
        },
      ],
    },
    /* Fold 6: what young children need (no product in the fold, D016) */
    {
      kind: "part",
      title: "What does the research say young children need?",
      blocks: [
        {
          kind: "p",
          text: "Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young child and a caring adult help build and strengthen neural connections in the child’s brain. They also support the early language and social skills that later, more complex thinking builds on.[^5]",
        },
        {
          kind: "p",
          text: "In a US study of 90 children aged between 3 and 6, children asked about a story by an adult researcher gave longer answers, using more different words, than children asked the same questions by a smart speaker. Both groups answered about equally accurately.[^6]",
        },
        {
          kind: "p",
          text: "You can do it anywhere: answer your child, then ask one back. And the test for any AI near a young child is simple: does it leave more room for that back-and-forth with you, or less?",
        },
      ],
    },
    /* Fold 7: how to judge anything with AI inside */
    {
      kind: "part",
      title: "How do you judge anything with AI inside?",
      blocks: [
        { kind: "p", text: "Ask the same four questions of every maker, us included." },
        {
          kind: "list",
          items: [
            "Can it reach the open internet, or only a closed set of material?",
            "Is every reply checked for your child’s age, and can the maker say how?",
            "Can you read every conversation, and delete any of it yourself?",
            "Does it talk with your child, in questions and turns, or perform at them?",
          ],
        },
        {
          kind: "p",
          text: "A maker who answers all four plainly is worth a closer look. For us, AI near a young child is not a simple yes or no. It is a question of who built it, and why.",
        },
        { kind: "p", text: "To compare toys side by side, use our guide to [AI toys for kids in India](/ai-toys-for-kids-in-india)." },
      ],
    },
    /* Fold 8: where Kheelu stands; the B3 answer word for word, the page's one in-text product link, then the facts */
    {
      kind: "part",
      variant: "breakout",
      title: "Where does Kheelu stand?",
      blocks: [
        {
          kind: "p",
          text: "Kheelu is made for children aged 3 to 7. Common Sense Media’s advice covers that whole range: avoid AI toys at 5 and under, and use extreme caution at 6 and 7. You should hear that from us. Here is how we built [Kheelu](/products/kheelu) on each point above, so you can check it yourself and decide.",
        },
        {
          kind: "facts",
          items: [
            {
              icon: "microphone",
              title: "The microphone.",
              body: "It turns on only when someone presses the wake-up button, and a light on Kheelu shows whenever it’s listening. It switches itself off after about a minute of quiet.",
            },
            {
              icon: "lock-simple",
              title: "Your child’s voice.",
              body: "To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India. They process your child’s voice only to produce Kheelu’s reply. They don’t keep it, and they never use it to train their AI. Our contracts with them say so.",
            },
            { icon: "eye", title: "Every conversation.", body: `You can read every conversation in the parent app. ${RETENTION_LINE}` },
            { icon: "hand-heart", title: "Your data.", body: "We don’t sell your data. Your child’s data is never used to advertise to them." },
            {
              icon: "wifi-slash",
              title: "No open internet.",
              body: "Kheelu can’t browse the internet. Its answers come from a curated, closed content library, and every reply passes an age-graded safety layer set to the age you enter in the parent app.",
            },
            { icon: "chat-circle-dots", title: "Talking with, not at.", body: "It answers your child, then asks a question back, so your child does the thinking." },
          ],
        },
        { kind: "p", text: "If your child is 3, keep a grown-up nearby while they play." },
        {
          kind: "p",
          text: "Whether that is enough is your call, and the child-safety groups above are right to make companies earn it. The detail is on our [Safety page](/safety).",
        },
      ],
    },
  ],
  /* Fold 9: notes in reading order; note 1 is reused in fold 5 */
  sources: [
    {
      citation:
        "Common Sense Media, “Common Sense Media Warns Against AI Toy Companions After Research Reveals Safety Risks” (press release), 22 January 2026, paragraph 1.",
      href: "https://www.commonsensemedia.org/press-releases/common-sense-media-warns-against-ai-toy-companions-after-research-reveals-safety-risks",
    },
    {
      citation:
        "Rebecca Winthrop, Brookings Institution, “Is it time to measure cognitive stunting?” (commentary), 2026, section “Cognitive stunting” and the section on early evidence.",
      href: "https://www.brookings.edu/articles/is-it-time-to-measure-cognitive-stunting/",
    },
    { citation: "Fairplay, “AI Toys are NOT Safe for Kids” (advisory), 2025, opening paragraph.", href: "https://fairplayforkids.org/pf/aitoyadvisory/" },
    {
      citation: "Common Sense Media Youth AI Safety Institute, “AI Toys” (risk assessment), 2026, “What we found” and “Where they fall short”.",
      href: "https://institute.commonsensemedia.org/risk-assessments/ai-toys",
    },
    {
      citation:
        "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts.",
      href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
    },
    {
      citation:
        "Xu, Wang, Collins, Lee and Warschauer, “Same benefits, different communication patterns: Comparing Children’s reading with a conversational agent vs. a human partner”, Computers & Education, 2021, Abstract and section 4.3.",
      href: "https://doi.org/10.1016/j.compedu.2020.104059",
    },
  ],
  close: "journal",
} satisfies Article;
