import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Answer } from "@/content/types";
import { ArticleBody } from "../ArticleBody/ArticleBody";
import { LATE_TALKERS_BODY, SOURCE_LABEL } from "../ArticleBody/ArticleBody.stories";
import { AnswerSection } from "./AnswerSection";

/* AnswerSection (task 3.4): the answer-first block (architecture §9.5) as the three article mockups and the team page
 * show it. The answers are the approved copy (story-*.html fold 2, team.html fold 2), story and test data only
 * (exported in capitals, left out of the story list). */

/** story-learning-toys-for-a-three-year-old.html fold 2: the answer, then two paragraphs of detail. */
export const LEARNING_TOYS_ANSWER: Answer = {
  question: "What are the best learning toys for a {nowrap:3-year-old}?",
  answer:
    "Toys that get your child building, pretending and talking: blocks, simple puzzles, pretend-play sets, crayons and dough, and picture books you read together. Research links back-and-forth talk between a young child and a caring adult to early language and brain development,[^1] so the best toys are often the ones you play with together, out loud.",
  detail: [
    { kind: "p", text: "The word “educational” on a box says little about the toy inside. A shape sorter is educational. So is a tablet full of phonics videos. They are not the same purchase." },
    { kind: "p", text: "A better question: what is my {nowrap:3-year-old} working on right now, and does this toy help or get in the way? Here is that list, skill by skill." },
  ],
};

/** story-what-to-look-for-in-a-safe-ai-toy.html fold 2. */
export const SAFE_AI_TOY_ANSWER: Answer = {
  question: "What should you look for in a safe AI toy?",
  answer:
    "Look for mechanisms you can check, not promises. Ask when the microphone is on, whether the toy can reach the open internet, where your child’s voice goes and who keeps it, whether you can read and delete every conversation, and how replies are filtered for your child’s age. Then weigh what child-safety groups say.",
};

/** story-talking-toys-and-late-talkers.html fold 2: the answer, then the D025 line. */
export const LATE_TALKERS_ANSWER: Answer = {
  question: "What helps a late talker?",
  answer:
    "Talk with your child, wait, and follow their lead. Name what they look at, add one word to what they say, and give them time to answer before you fill the silence. If your child is 3 or older and other people still can’t understand them most of the time, talk to your paediatrician.[^1]",
  detail: [{ kind: "disclaimer", text: "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician." }],
};

/** team.html fold 2 (50 words). */
export const TEAM_ANSWER: Omit<Answer, "detail"> = {
  question: "Who makes Kheelu?",
  answer:
    "Kheelona Robotics Private Limited, a small company in Bengaluru, makes Kheelu. Its three co-founders are Apoorva Sahu, Aman Soni and Kashyap C.R. Kheelu is designed by parents in Bengaluru and made in India. You can reach the team on [WhatsApp](https://wa.me/919187546483) or by phone at {nowrap:[+91 91875 46483](tel:+919187546483)}, or at [hello@kheelona.com](mailto:hello@kheelona.com).",
};

const meta = {
  title: "Sections/AnswerSection",
  component: AnswerSection,
  excludeStories: /^[A-Z0-9_]+$/,
  args: { ...LEARNING_TOYS_ANSWER, variant: "article", sourceLabel: SOURCE_LABEL },
  parameters: { layout: "fullscreen" },
  render: (args) => <ArticleBody blocks={[]} before={<AnswerSection {...args} />} />,
} satisfies Meta<typeof AnswerSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An article's answer, first in the reading column, with two paragraphs of detail. */
export const Article: Story = {};

/** An answer alone. */
export const ArticleAnswerOnly: Story = { args: { ...SAFE_AI_TOY_ANSWER, detail: undefined } };

/** The late-talker answer with the D025 line under it, at the head of its column. */
export const ArticleWithDisclaimer: Story = {
  args: { ...LATE_TALKERS_ANSWER },
  render: (args) => <ArticleBody blocks={LATE_TALKERS_BODY.slice(0, 1)} sourceLabel={SOURCE_LABEL} before={<AnswerSection {...args} />} />,
};

/** The team page's answer: its own band, the question beside the answer from 900 px. */
export const Team: Story = { args: { ...TEAM_ANSWER, variant: "team", detail: undefined }, render: (args) => <AnswerSection {...args} /> };
