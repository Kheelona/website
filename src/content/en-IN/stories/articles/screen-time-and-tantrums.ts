/// <reference types="next/image-types/global" />
import homeworkDesk from "@ds/assets/Photo library/kabir-03-homework-desk-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG, TEAM_BYLINE } from "../../organization";

/**
 * Screen time and tantrums: what is actually happening: rewritten (task 5.17; copy page
 * story-screen-time-and-tantrums.md, CMO review cmo-review-articles-5.17-2026-10-14.md; fixes of task 5.20a, CMO M7,
 * M8, M10 and M16, fix-pass review cmo-review-article-fixes-5.20a-2026-10-14.md, N1 and N2: the head photo is
 * kabir-03, a 9:16 master the head shows in its 4:5 frame as a centred crop, as tara-03's). No mockup: it renders through
 * the article template, held to the approved articles' shared parts. Card words as the hub's (stories.md fold 2),
 * related links and dates as the stub held them (the main session's note for 5.17). One in-text product link (fold 6);
 * no countdown tip anywhere (source verification C35).
 */
export const article = {
  slug: "screen-time-and-tantrums",
  meta: {
    title: "Screen time tantrums: why they happen, what helps · Kheelona",
    description:
      "Screen time tantrums: one study found a two-minute warning made children more upset. What helps instead, and how to make switching off boring.",
    og: DEFAULT_OG,
  },
  card: {
    title: "Screen time and tantrums: what is actually happening",
    summary: "Why the meltdown lands the moment the screen goes off, and how to make switching off boring instead of explosive.",
  },
  related: ["how-much-screen-time-for-a-3-to-6-year-old", "the-gentle-way-off-the-phone", "busy-hands-no-screens"],
  published: "2026-07-28",
  updated: "2026-10-13",
  head: {
    title: "Screen time and tantrums: {hand:what is actually happening}",
    lead: "Why the meltdown lands the moment the screen goes off, and how to make switching off boring instead of explosive.",
    author: TEAM_BYLINE,
    readMinutes: 2,
    image: {
      src: homeworkDesk,
      alt: "A boy in round glasses and a white school shirt grins, one finger at his nose, as he writes in an exercise book at a wooden desk by a window, Kheelu sitting at the far end of the desk.",
    },
  },
  /* Fold 2: the answer first (54 words), then a hook to the finding below. */
  answer: {
    question: "What helps with screen time tantrums?",
    answer:
      "Make switching off part of a routine. Agree the limit before the screen goes on, stop at a natural break such as the end of an episode, and have something ready for your child’s hands the moment it goes dark. If tears come anyway, stay calm, stay close and keep to what you said.",
    detail: [{ kind: "p", text: "One common tip is missing on purpose: the two-minute warning. More on that below." }],
  },
  body: [
    /* Fold 3: the scene, untitled */
    {
      kind: "part",
      blocks: [
        {
          kind: "p",
          text: "The video ends. You say that’s enough for today. And a child who sat quietly for half an hour is suddenly on the floor in tears.",
        },
        { kind: "p", text: "If this is your house some evenings, you are not alone." },
      ],
    },
    /* Fold 4 */
    {
      kind: "part",
      title: "Why the meltdown comes at the off switch",
      blocks: [
        {
          kind: "p",
          text: "Screen time tantrums are common enough that researchers have studied them: a 2016 University of Washington study of families with children aged 1 to 5 found that “transitioning away from screens is often painful”.[^1]",
        },
        {
          kind: "p",
          text: "Think about what the off switch asks of a young child: to stop something they enjoy, right now, at a moment they did not choose. That is hard at any age.",
        },
        {
          kind: "p",
          text: "It does not happen every evening, though. The study’s senior author said that most of the time these transitions “actually go pretty smoothly”, even if parents find that hard to see.[^2] It is the hard evenings that stay with you.",
        },
      ],
    },
    /* Fold 5 */
    {
      kind: "part",
      title: "What makes taking the phone away easier?",
      blocks: [
        {
          kind: "p",
          text: "How the screen ends makes a difference. In the same study, routines and stopping at a natural break made the switch easier.[^2]",
        },
        {
          kind: "p",
          text: "One well-meant habit made it harder: children given a two-minute warning by their parents were more upset when the screen went away.[^2] That is one study, so watch your own child. If the countdown sets off the storm, drop it.",
        },
      ],
    },
    /* Fold 6: habits for tonight, then the page's one in-text product link, then the screen-time guide */
    {
      kind: "part",
      title: "How to make switching off boring",
      blocks: [
        { kind: "p", text: "Boring is the goal: an ending so routine that there is nothing to fight about." },
        {
          kind: "list",
          variant: "tips",
          items: [
            { icon: "calendar-check", text: "Agree the plan out loud before the screen goes on: “One episode, then we water the plants.”" },
            { icon: "pause", text: "Stop at the end of an episode or a song, never halfway through." },
            { icon: "gear", text: "Turn off autoplay, so the next episode does not start on its own." },
            { icon: "clock", text: "Keep the same order every day, so the ending is no surprise." },
            { icon: "puzzle-piece", text: "Have something ready for their hands the moment the screen goes dark: dough, crayons, a job in the kitchen." },
            { icon: "heart", text: "If tears come, stay close, stay calm and keep to what you said." },
          ],
        },
        {
          kind: "p",
          text: "Looking for something to hand over when the screen goes dark? [Kheelu](/products/kheelu) is one screen-free option: a plush toy for ages 3 to 7 that answers your child, then asks a question back. It is not a toy for children under 3. If your child is 3, keep a grown-up nearby while they play.",
        },
        {
          kind: "p",
          text: "How much screen time suits each age is a separate question. Our guide, [How much screen time is okay for a young child?](/stories/how-much-screen-time-for-a-3-to-6-year-old), sets out the WHO, IAP and AAP advice, age by age.",
        },
      ],
    },
  ],
  /* Fold 7: note 1 gives the paper's main title only (copy page fold 7). */
  sources: [
    {
      citation: "Hiniker, Suh, Cao and Kientz (University of Washington), “Screen Time Tantrums”, CHI 2016 conference proceedings, pp. 648-660, 2016, abstract.",
      href: "https://doi.org/10.1145/2858036.2858278",
    },
    {
      citation:
        "University of Washington News (Jennifer Langston), “Two-minute warnings make kids’ ‘screen time’ tantrums worse”, 2016, the university’s release about the study.",
      href: "https://www.washington.edu/news/2016/05/05/two-minute-warnings-make-kids-screen-time-tantrums-worse/",
    },
  ],
  close: "journal",
} satisfies Article;
