import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ParentQuotes } from "./ParentQuotes";

const meta = {
  title: "Organisms/ParentQuotes",
  component: ParentQuotes,
  parameters: { nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <section className="kh-sec kh-alt">
        <div className="kh-wrap">
          <Story />
        </div>
      </section>
    ),
  ],
} satisfies Meta<typeof ParentQuotes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Phone: Story = { parameters: { viewport: { defaultViewport: "mobile1" } } };
