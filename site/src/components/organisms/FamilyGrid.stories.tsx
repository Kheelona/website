import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FamilyGrid } from "./FamilyGrid";

const meta = {
  title: "Organisms/FamilyGrid",
  component: FamilyGrid,
  parameters: {
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component:
          "The V3 pipeline: Lumi (2 to 5), the Kheelu Speaker (5 to 14), and AI books (2 to 14), threaded by a hairline arc on md+. The two unbuilt bodies show a calm placeholder until the founder's Gemini art lands (gate V3-c).",
      },
    },
  },
} satisfies Meta<typeof FamilyGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
