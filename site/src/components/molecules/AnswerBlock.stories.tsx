import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnswerBlock } from "./AnswerBlock";

const meta = {
  title: "Molecules/AnswerBlock",
  component: AnswerBlock,
  args: {
    question: "Are AI toys safe for children?",
    answer:
      "Not all of them. Independent testers found toys that talked about things no child should hear. Lumi works the other way: the microphone wakes to a word, the first thinking happens on the device, answers come from a closed library, and you can read or delete every conversation.",
  },
  argTypes: {
    as: { control: "inline-radio", options: ["h2", "h3"] },
    level: { control: "inline-radio", options: ["section", "minor"] },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof AnswerBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Flagship: Story = { args: { level: "section" } };
export const Minor: Story = {};
export const WithFollowOn: Story = {
  args: {
    question: "Can I delete my child's data?",
    answer: "Yes. Any conversation, gone the moment you decide, from the parent app.",
    children: <p className="mt-4 text-[16px] text-ink-muted">Nothing stays that you cannot delete.</p>,
  },
};
