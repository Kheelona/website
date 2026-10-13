/// <reference types="next/image-types/global" />
import namingFeelings from "@ds/assets/Photo library/tara-01-naming-feelings-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG, TEAM_BYLINE } from "../../organization";

/**
 * The gentle way off the phone: a seven-day plan: rewritten (task 5.17; copy page story-the-gentle-way-off-the-phone.md,
 * CMO review cmo-review-articles-5.17-2026-10-14.md; fixes of task 5.20a, CMO M11, M12 and M16, fix-pass review
 * cmo-review-article-fixes-5.20a-2026-10-14.md). No mockup: it renders through the article template, held to the
 * approved articles' shared parts. Card words as the hub's (stories.md fold 2), related links and dates as the stub held
 * them (the main session's note for 5.17). One in-text product link (fold 9).
 */
export const article = {
  slug: "the-gentle-way-off-the-phone",
  meta: {
    title: "How to reduce screen time: a gentle 7-day plan · Kheelona",
    description:
      "How to reduce screen time gently: a seven-day plan for 3 to 7 year olds, and the screen-free times the Indian Academy of Pediatrics names.",
    og: DEFAULT_OG,
  },
  card: {
    title: "The gentle way off the phone: a seven-day plan",
    summary: "A week-long plan to cut a young child’s screen time without turning your home into a battlefield.",
  },
  related: ["screen-time-and-tantrums", "busy-hands-no-screens", "screen-time-rules-parents-swear-by"],
  published: "2026-07-28",
  updated: "2026-10-13",
  head: {
    title: "The {hand:gentle way} off the phone: a seven-day plan to reduce screen time",
    lead: "A week-long plan to cut a young child’s screen time without turning your home into a battlefield.",
    author: TEAM_BYLINE,
    readMinutes: 3,
    image: {
      src: namingFeelings,
      alt: "A curly-haired girl in denim dungarees sits on a wooden floor by a sunlit window lined with potted plants, Kheelu in her lap, touching its nose with one finger.",
    },
  },
  /* Fold 2: the answer first (56 words), then the hand-over to the plan. */
  answer: {
    question: "How do I reduce my child’s screen time?",
    answer:
      "Go slowly, and fill the gap before you take anything away. Find the times of day the phone usually comes out, replace them one at a time with play, stories, songs or a small job, and stop screens at a natural break, not mid-episode. Keep meals and the hour before bed screen-free, for the grown-ups too.",
    detail: [{ kind: "p", text: "Here it is as a seven-day plan. Start on any day of the week." }],
  },
  body: [
    /* Fold 3 */
    {
      kind: "part",
      title: "Why replace before you remove?",
      blocks: [
        { kind: "p", text: "Nobody plans for their 4-year-old to find the video app faster than they can. It happens one busy evening at a time." },
        {
          kind: "p",
          text: "The phone came in because it solved something: a work call, a bored child, the queue at the clinic. Take it away without replacing what it did, and the gap turns into a fight.",
        },
        { kind: "p", text: "So this plan replaces first and removes second." },
      ],
    },
    /* Fold 4 */
    {
      kind: "part",
      title: "What are you aiming for?",
      blocks: [
        {
          kind: "p",
          text: "The Indian Academy of Pediatrics says at most one hour of supervised screen time a day from two to five. From five to ten, it says less than two hours a day, including screens used for homework. For both ages, it adds: “the lesser, the better”.[^1]",
        },
        {
          kind: "p",
          text: "For children aged two to five, it also says not to use screens during meals, within an hour before sleep, or “during surface travel”: in the car, on the bus, on the train.[^1]",
        },
        {
          kind: "p",
          text: "The American Academy of Pediatrics asks families of young children to keep bedrooms, mealtimes and playtime together screen-free, for parents as well as children.[^2]",
        },
        {
          kind: "p",
          text: "You don’t need to get there this week. The plan starts with one slot. For the numbers age by age, read [How much screen time is okay for a young child?](/stories/how-much-screen-time-for-a-3-to-6-year-old)",
        },
      ],
    },
    /* Fold 5 */
    {
      kind: "part",
      title: "Days 1 and 2: notice when the phone comes out",
      blocks: [
        { kind: "p", text: "Change nothing yet. Notice when the phone appears: the morning rush, the cooking hour, the car, the queue at the clinic." },
        { kind: "p", text: "Each one is a job the phone was hired to do. Write them down. That list is your plan for the week." },
      ],
    },
    /* Fold 6 */
    {
      kind: "part",
      title: "Days 3 and 4: replace the easiest slot",
      blocks: [
        {
          kind: "p",
          text: "Pick the slot where the stakes are lowest. Fill it with something that talks back or keeps hands busy. A story, told or played aloud, in your home language. A grandparent on a voice call. A puzzle you started together at breakfast, waiting on the table.",
        },
        { kind: "p", text: "Leave the hard slots alone for now. One calm win is worth more than three fights." },
        { kind: "p", text: "Need more ideas for the slot? Try [Busy hands, no screens](/stories/busy-hands-no-screens)." },
      ],
    },
    /* Fold 7 */
    {
      kind: "part",
      title: "Days 5 and 6: shrink the rest, don’t snatch",
      blocks: [
        { kind: "p", text: "In the slots that are left, end the screen at a natural break: the end of an episode, not the middle of a scene." },
        {
          kind: "p",
          text: "Then land it somewhere: a job, a snack, a spot-the-crow contest at the window. Have the next thing ready before the screen goes dark.",
        },
        {
          kind: "callout",
          icon: "chat-circle-dots",
          lead: "Try this:",
          text: "before the screen goes on, say where it will land: “One episode, then we water the plants.”",
        },
        { kind: "p", text: "If switching off is the hard part, read [Screen time and tantrums](/stories/screen-time-and-tantrums)." },
      ],
    },
    /* Fold 8 */
    {
      kind: "part",
      title: "Day 7: say the new rules out loud",
      blocks: [
        {
          kind: "p",
          text: "Tell your child what changed, in the language you speak at home: mornings are for songs now, the car is for spotting autos, dinner is for talking.",
        },
        {
          kind: "p",
          text: "Say it the same way every time, so it sounds like a rule, not a mood. And keep the rule yourself: at meals and at playtime together, the American Academy of Pediatrics suggests parents set their phones to “do not disturb”.[^2]",
        },
      ],
    },
    /* Fold 9: the page's one in-text product link */
    {
      kind: "part",
      title: "Week 2: expect a wobble",
      blocks: [
        {
          kind: "p",
          text: "Some days will slip: a long journey, a sick day, a deadline. It happens. Go back to your list and pick up where you stopped.",
        },
        {
          kind: "p",
          text: "Look at what your slots needed in the end: something to do, and someone to talk to, whether that is you, a grandparent or a sibling.",
        },
        {
          kind: "p",
          text: "For the slots where your hands are full, [Kheelu](/products/kheelu) is one screen-free option. It is a plush toy for ages 3 to 7 that answers your child, then asks a question back, and you can read every conversation in the parent app. It is not a toy for children under 3. If your child is 3, keep a grown-up nearby while they play.",
        },
      ],
    },
  ],
  /* Fold 10 */
  sources: [
    {
      citation: "Indian Academy of Pediatrics, “Guidelines on Screen Time and Digital Wellness in Infants, Children and Adolescents”, Indian Pediatrics, 2022, p. 239.",
      href: "https://www.indianpediatrics.net/mar2022/235.pdf",
    },
    {
      citation: "American Academy of Pediatrics, Council on Communications and Media, “Media and Young Minds”, Pediatrics, 2016, Recommendations: Families.",
      href: "https://doi.org/10.1542/peds.2016-2591",
    },
  ],
  close: "journal",
} satisfies Article;
