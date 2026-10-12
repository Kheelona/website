import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Answer } from "@/content/types";
import { ArticleBody } from "../ArticleBody/ArticleBody";
import { LATE_TALKERS_ANSWER, LATE_TALKERS_BODY, LEARNING_TOYS_ANSWER, SAFE_AI_TOY_ANSWER, SOURCE_LABEL } from "../ArticleBody/ArticleBody.stories";
import { AnswerSection } from "./AnswerSection";

/* AnswerSection (task 3.4): the answer-first block (architecture §9.5) as the three article mockups and the team page
 * show it. The answers are the approved copy (story-*.html fold 2, with the article fixtures in ArticleBody.stories;
 * team.html fold 2 here), story and test data only (exported in capitals, left out of the story list). */

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
