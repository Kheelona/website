import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SectionHeading } from "./SectionHeading";

const meta = {
  title: "Molecules/SectionHeading",
  component: SectionHeading,
  args: {
    eyebrow: "Screen-free by design",
    title: "A friend who listens, not a screen that glows",
    lede: "Lumi holds a real conversation with your child. No apps, no ads, no open internet.",
  },
  argTypes: {
    as: { control: "inline-radio", options: ["h1", "h2", "h3"] },
    level: { control: "inline-radio", options: ["hero", "section", "minor", "nested"] },
    tone: { control: "inline-radio", options: ["ink", "white"] },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hero: Story = { args: { as: "h1", level: "hero" } };
export const TitleOnly: Story = { args: { eyebrow: undefined, lede: undefined } };
export const OnDark: Story = { args: { tone: "white" } };
/** The nested step: an h3 question under a room heading (AnswerBlock). */
export const Nested: Story = { args: { as: "h3", eyebrow: undefined } };
