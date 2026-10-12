import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Heading } from "./Heading";

/* Each shape of the DS SectionHeading the approved pages use, in their wording. */
const meta = {
  title: "UI/Heading",
  component: Heading,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hero: Story = {
  args: {
    hero: true,
    level: 1,
    id: "hero-title",
    eyebrow: "Ages 3 to 7",
    title: "Kheelu answers every why. Then it {hand:asks one back.}",
    lead: "A screen-free plush toy by Kheelona. It answers your child first, then asks a question back, so they do the thinking.",
  },
};

export const Centered: Story = {
  args: {
    align: "center",
    id: "ask-title",
    eyebrow: "See it ask",
    title: "Kheelu asks. Watch them {hand:think.}",
    lead: "Real children, real families. Press play on any of them.",
  },
};

export const Section: Story = {
  args: {
    eyebrow: "Modes and languages",
    title: "What is {hand:Kheelu?}",
  },
};

export const TitleOnly: Story = { args: { title: "Screen time" } };

export const ArticleTitleStep: Story = {
  name: "Article title (titleStepXl: display-l from 1024 px)",
  args: {
    as: "div",
    hero: true,
    level: 1,
    id: "story-title",
    titleStepXl: "display-l",
    title: "Learning toys for a {nowrap:3-year-old,} {hand:skill by skill}",
    lead: "What a {nowrap:3-year-old} is working on, and which kinds of toys serve each part of it, without the word “educational” doing all the work.",
  },
};
