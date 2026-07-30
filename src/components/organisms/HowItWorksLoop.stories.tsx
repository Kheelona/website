import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorksLoop } from "./HowItWorksLoop";

const meta = {
  title: "Organisms/HowItWorksLoop",
  component: HowItWorksLoop,
} satisfies Meta<typeof HowItWorksLoop>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Home cycle (BUILD-V4 §3 F4). */
export const Home: Story = {
  args: {
    steps: [
      {
        title: "Talk and play",
        label: "Step 1",
        body: "Your child asks questions, plays word games, and listens to stories that talk back, in their own language.",
      },
      {
        title: "Lumi remembers",
        label: "Step 2 · Adaptive memory",
        body: "Lumi keeps track of the words your child knows, what they love, and the pace they learn at.",
      },
      {
        title: "Knowledge that sticks",
        label: "Step 3 · Real-world learning",
        body: "New ideas arrive inside everyday conversation, not forced drills.",
      },
    ],
    repeatNote: "Then it begins again, one level wiser.",
  },
};
