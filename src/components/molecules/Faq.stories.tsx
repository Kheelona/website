import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Faq } from "./Faq";
import { LUMI_AGES } from "@/config/site";

const items = [
  {
    q: "Is Lumi screen-free?",
    a: "Yes. Lumi never shows a screen — it listens and talks, nothing to watch.",
  },
  {
    q: "What ages is Lumi for?",
    a: `Lumi is built for children ages ${LUMI_AGES}.`,
  },
  {
    q: "Can the parent see conversations?",
    a: "Yes. You see everything Lumi and your child talk about.",
  },
];

const meta = {
  title: "Molecules/Faq",
  component: Faq,
  args: { items },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Faq>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
