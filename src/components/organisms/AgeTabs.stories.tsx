import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AgeTabs } from "./AgeTabs";

const meta = {
  title: "Organisms/AgeTabs",
  component: AgeTabs,
  parameters: { nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="kh-wrap max-w-[560px] py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AgeTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
