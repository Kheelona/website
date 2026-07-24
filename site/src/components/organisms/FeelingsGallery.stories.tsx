import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeelingsGallery } from "./FeelingsGallery";

const meta = {
  title: "Organisms/FeelingsGallery",
  component: FeelingsGallery,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof FeelingsGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click any card: the character detail opens as a dialog. */
export const AllFive: Story = {};
