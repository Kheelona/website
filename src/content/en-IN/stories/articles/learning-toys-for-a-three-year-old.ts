/// <reference types="next/image-types/global" />
import floorTrain from "@ds/assets/Photo library/advik-04-floor-train-web.webp";
import drawingAtHome from "@ds/assets/Photo library/myra-04-drawing-at-home-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG, TEAM_BYLINE } from "../../organization";

/**
 * Learning toys for a 3-year-old, skill by skill: rewritten and approved (mockup
 * story-learning-toys-for-a-three-year-old.html; copy page of the same name). Head, byline, photo,
 * answer, body, sources, related guides and close as the mockup shows them; card words as the hub's
 * (stories.md fold 5). The merged 2-year-old topic is its #brain-development part (D041), which the
 * dropped article's 301 lands on in intent. One in-text product link (fold 12). `updated` is the
 * rewrite's date (task 5.6).
 */
export const article = {
  slug: "learning-toys-for-a-three-year-old",
  meta: {
    title: "Learning toys for a 3-year-old, skill by skill · Kheelona",
    description:
      "Learning toys for a 3-year-old, skill by skill: language, turn-taking, pretend play, hands and numbers, plus what the WHO and IAP say about screens.",
    og: DEFAULT_OG,
  },
  card: {
    title: "Learning toys for a 3-year-old, skill by skill",
    summary: "What a 3-year-old is working on, and which kinds of toys serve each part of it.",
  },
  related: ["what-actually-builds-a-sharp-brain", "a-toy-that-talks-vs-a-toy-that-listens", "how-much-screen-time-for-a-3-to-6-year-old"],
  published: "2026-09-11",
  updated: "2026-10-12",
  head: {
    title: "Learning toys for a {nowrap:3-year-old,} {hand:skill by skill}",
    lead: "What a {nowrap:3-year-old} is working on, and which kinds of toys serve each part of it, without the word “educational” doing all the work.",
    author: TEAM_BYLINE,
    readMinutes: 4,
    image: {
      src: drawingAtHome,
      alt: "A little girl in a red polka-dot frock, tongue out in concentration, scribbling with an orange crayon at a low table.",
    },
  },
  /* Fold 2: the answer first (55 words), then two paragraphs that frame the rest of the page. */
  answer: {
    question: "What are the best learning toys for a {nowrap:3-year-old}?",
    answer:
      "Toys that get your child building, pretending and talking: blocks, simple puzzles, pretend-play sets, crayons and dough, and picture books you read together. Research links back-and-forth talk between a young child and a caring adult to early language and brain development,[^1] so the best toys are often the ones you play with together, out loud.",
    detail: [
      { kind: "p", text: "The word “educational” on a box says little about the toy inside. A shape sorter is educational. So is a tablet full of phonics videos. They are not the same purchase." },
      { kind: "p", text: "A better question: what is my {nowrap:3-year-old} working on right now, and does this toy help or get in the way? Here is that list, skill by skill." },
    ],
  },
  body: [
    /* Fold 3 */
    {
      kind: "part",
      title: "What is a {nowrap:3-year-old} working on?",
      blocks: [
        { kind: "p", text: "India’s National Education Policy 2020 treats ages 3 to 8 as the Foundational Stage: three years of Anganwadi or pre-school, then Grades 1 and 2.[^2]" },
        {
          kind: "p",
          text: "For these early years, it describes learning that is “play-based, activity-based, and inquiry-based”, covering languages, numbers and counting, colours and shapes, puzzles, drawing, craft, drama and puppetry, music and movement.[^3]",
        },
        { kind: "p", text: "It is written for Anganwadis and pre-schools, not for toy shops. Here is what those kinds of play look like at home, skill by skill." },
      ],
    },
    /* Fold 4 */
    {
      kind: "part",
      title: "Language: does the toy make a turn?",
      blocks: [
        {
          kind: "p",
          text: "Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young child and a caring adult help build and strengthen neural connections in the child’s brain. They also support the early language and social skills that later, more complex thinking builds on.[^1]",
        },
        {
          kind: "p",
          text: "In a 2018 study of 36 children aged 4 to 6, children who had more back-and-forth conversational turns with adults showed more activity in Broca’s area, a language region of the brain, while listening to a story. The number of adult words they heard showed no such link. The study shows a link, not cause and effect.[^4]",
        },
        {
          kind: "p",
          text: "So the test for a language toy is simple: does it make a turn? A picture book you read together makes plenty. A puppet makes as many as you have patience for. A toy that plays a recorded sentence at the press of a button can’t answer back, however many words the sentence has.",
        },
        { kind: "callout", icon: "book-open", lead: "Try this:", text: "when you read together, pause once or twice and ask what your child thinks will happen next." },
      ],
    },
    /* Fold 5 */
    {
      kind: "part",
      title: "Taking turns: games with a “your go, my go” rhythm",
      blocks: [
        {
          kind: "p",
          text: "Look for games where your child has to wait, watch and then go: simple board games with two rules, picture matching, rolling a ball back and forth. Play them together and say the turns out loud: “My go. Now yours.”",
        },
      ],
    },
    /* Fold 6, then its photo */
    {
      kind: "part",
      title: "Pretend play: props that leave the story to your child",
      blocks: [
        {
          kind: "p",
          text: "A cardboard kitchen, a doctor set, a box of mismatched figures. Open props let your child decide who is cooking and what is wrong with teddy. A toy kitchen that plays its own sounds and names its own characters decides some of that for them.",
        },
      ],
    },
    {
      kind: "figure",
      variant: "wide",
      image: { src: floorTrain, alt: "A boy in a green T-shirt lying on a red floor, smiling as he pushes a blue wooden train." },
    },
    /* Fold 7 */
    {
      kind: "part",
      title: "Hands: plain things do the job",
      blocks: [{ kind: "p", text: "Threading beads, stacking cups, dough, chunky crayons, tongs and a bowl of pom-poms. None of them needs a battery or a screen." }],
    },
    /* Fold 8 */
    {
      kind: "part",
      title: "Numbers: count real things together",
      blocks: [{ kind: "p", text: "Count spoons at dinner, steps to the door, autos at the signal. Ask, “Which pile has more?” Any toy with parts you can count will do." }],
    },
    /* Fold 9: the brain-development label, the merged topic (D041; D016: a searched topic, never what a toy does) */
    {
      kind: "part",
      id: "brain-development",
      title: "Brain development toys for a {nowrap:3-year-old}: what the label means",
      blocks: [
        {
          kind: "p",
          text: "The words “brain development” on a box prove nothing on their own. What matters is whether a toy gets your child trying, asking and explaining, and whether you talk together while they play.",
        },
        {
          kind: "p",
          text: "Harvard’s centre describes the same back-and-forth from infancy: exchanges between a young child and a caring adult that help build and strengthen the connections in the child’s brain.[^1] So for a younger child the rule is the same: fewer toys that perform, more time playing and talking together.",
        },
      ],
    },
    /* Fold 10 */
    {
      kind: "part",
      title: "What about screens?",
      blocks: [
        {
          kind: "p",
          text: "For three and four year olds, the World Health Organization and the Indian Academy of Pediatrics both say no more than an hour of screen time a day, and less is better.[^5][^6]",
        },
        {
          kind: "p",
          text: "The American Academy of Pediatrics asks parents to watch with their children, help them understand what they are seeing, and switch screens off an hour before bedtime.[^7]",
        },
        { kind: "p", text: "When your child does watch, sit with them and talk about it." },
      ],
    },
    /* Folds 11 and 12: a short rule, then where Kheelu fits (the page's one in-text product link) */
    {
      kind: "part",
      title: "A short rule for the toy shop",
      blocks: [
        {
          kind: "list",
          variant: "checks",
          items: [
            "Check the age on the box.",
            "Prefer toys that wait for your child over toys that perform at them.",
            "Prefer open ends over scripts.",
            "Prefer anything that makes a turn.",
          ],
        },
        {
          kind: "p",
          text: "[Kheelu](/products/kheelu) is built around that last rule: a screen-free plush toy for ages 3 to 7 that answers your child, then asks a question back. It is not a toy for children under 3, and if your child is 3, keep a grown-up nearby while they play.",
        },
        { kind: "p", text: "Choosing any AI toy? Our guide to [AI toys for kids in India](/ai-toys-for-kids-in-india) sets out what to check first." },
      ],
    },
  ],
  /* Fold 13: notes 2 and 3 are two places in the same policy document (copy page fold 13). */
  sources: [
    {
      citation:
        "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts.",
      href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
    },
    {
      citation: "Ministry of Human Resource Development (now Ministry of Education), Government of India, “National Education Policy 2020”, 2020, chapter 4, para 4.1, p. 11.",
      href: "https://ncert.nic.in/pdf/nep/NEP_2020.pdf",
    },
    {
      citation: "Ministry of Human Resource Development (now Ministry of Education), Government of India, “National Education Policy 2020”, 2020, chapter 1, para 1.2, p. 7.",
      href: "https://ncert.nic.in/pdf/nep/NEP_2020.pdf",
    },
    {
      citation:
        "Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, “Beyond the 30-Million-Word Gap: Children’s Conversational Exposure Is Associated With Language-Related Brain Function”, Psychological Science, 2018, Abstract and Results.",
      href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/",
    },
    {
      citation:
        "World Health Organization, “Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age”, 2019, Recommendations: sedentary time, p. 8.",
      href: "https://iris.who.int/handle/10665/311664",
    },
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
