import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FamilyGrid } from "./FamilyGrid";

const meta = {
  title: "Organisms/FamilyGrid",
  component: FamilyGrid,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof FamilyGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
