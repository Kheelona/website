import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Faq } from "./Faq";
import { KHEELU_AGES } from "@/config/site";

const items = [
  {
    q: "Is Kheelu screen-free?",
    a: "Yes. Kheelu never shows a screen — it listens and talks, nothing to watch.",
  },
  {
    q: "What ages is Kheelu for?",
    a: `Kheelu is built for children ages ${KHEELU_AGES}.`,
  },
  {
    q: "Can the parent see conversations?",
    a: "Yes. You see everything Kheelu and your child talk about.",
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
