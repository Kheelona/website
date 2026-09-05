import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PageHero } from "./PageHero";

const meta = {
  title: "Templates/PageHero",
  component: PageHero,
  args: {
    children: (
      <div>
        <h1 className="font-display text-4xl font-extrabold">Meet Kheelu</h1>
        <p className="mt-4">A screen-free friend who listens and talks back.</p>
      </div>
    ),
    media: (
      {/* Real aspect: the asset is portrait, and a square box squashed it. */}
      <img src="/product/lumi.png" alt="The Kheelu plush" width={261} height={320} />
    ),
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof PageHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const CopyOnly: Story = { args: { media: undefined } };
export const Narrated: Story = {
  args: { guide: "curious", say: "Come on in, I'll show you around." },
};
