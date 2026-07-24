import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PageHero } from "./PageHero";

const meta = {
  title: "Templates/PageHero",
  component: PageHero,
  args: {
    children: (
      <div>
        <h1 className="font-display text-4xl font-extrabold">Meet Lumi</h1>
        <p className="mt-4">A screen-free friend who listens and talks back.</p>
      </div>
    ),
    media: (
      <img src="/product/lumi-blue-2.png" alt="The Lumi plush" width={320} height={320} />
    ),
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof PageHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const CopyOnly: Story = { args: { media: undefined } };
