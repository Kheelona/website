import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LearningRoom } from "./LearningRoom";

const meta = {
  title: "Home/LearningRoom",
  component: LearningRoom,
  parameters: {
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component:
          "V3's education fold. It shows the Kheelu-mode loop (Lumi reads, the child interrupts, Lumi asks one back) instead of claiming learning in adjectives, which is the gap every shelf-mate leaves open.",
      },
    },
  },
} satisfies Meta<typeof LearningRoom>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
