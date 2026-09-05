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
    // Real aspect: the asset is portrait, and a square box squashed it.
    //
    // This note used to sit inside the parentheses below, wrapped as a JSX
    // comment. That form is only valid as a JSX child; in expression position
    // it parses as an empty object literal followed by an element, which is not
    // JavaScript. Nothing in the repo was looking: tsconfig excludes story
    // files, so neither `tsc --noEmit` nor `next build` ever reads this one,
    // and Storybook 10.5.0's indexer tolerated it. 10.6.0 made it a hard build
    // failure. Line comments here on purpose, because the story of this bug
    // needs to mention glob patterns that would close a block comment early.
    media: <img src="/product/lumi.png" alt="The Kheelu plush" width={261} height={320} />,
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
