import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StepList, type Step } from "./StepList";

const setupSteps: Step[] = [
  { title: "Open the Magic Box", body: "Everything Kheelu needs is already inside." },
  { title: "Say hello", body: "Kheelu wakes up and learns your child's name." },
  { title: "Start playing", body: "Stories, songs, and gentle back-and-forth begin." },
];

const beliefs: Step[] = [
  { title: "We build for wonder, not for screen time." },
  { title: "Safety is a promise, not a feature." },
];

const meta = {
  title: "Molecules/StepList",
  component: StepList,
  args: { items: setupSteps },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof StepList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StatementsOnly: Story = {
  args: { items: beliefs },
};

export const AsH2: Story = {
  args: { items: setupSteps, as: "h2" },
};
