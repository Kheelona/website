import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PacePanel } from "./PacePanel";

const meta = {
  title: "Kheelu/PacePanel",
  component: PacePanel,
  parameters: {
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component:
          "Moves the comparison from other toys to what a parent already pays for. Framed as addition: the left card states the arithmetic of a classroom without blame, the right card is what Kheelu adds. The word 'replace' appears nowhere, and the seats are decorative brand shapes rather than a stock classroom photo.",
      },
    },
  },
} satisfies Meta<typeof PacePanel>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
