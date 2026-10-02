import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ComparisonTable } from "./ComparisonTable";

const meta = {
  title: "Organisms/ComparisonTable",
  component: ComparisonTable,
  parameters: { nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="kh-wrap py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ComparisonTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};
export const Phone: Story = { parameters: { viewport: { defaultViewport: "mobile1" } } };
