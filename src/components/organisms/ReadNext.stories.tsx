import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReadNext } from "./ReadNext";
import { STORIES, getRelatedStories } from "@/lib/stories";

const meta = {
  title: "Organisms/ReadNext",
  component: ReadNext,
  parameters: {
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component:
          "Three more reads at the foot of an article. It exists to close a real defect: fifteen of the nineteen journal articles had exactly one incoming internal link, all from the /stories index, and no article linked to another. Selection is deterministic (same theme first, then the next articles in journal order), so the link graph a crawler sees does not change between builds.",
      },
    },
  },
} satisfies Meta<typeof ReadNext>;

export default meta;
type Story = StoryObj<typeof meta>;

/** What most articles get: three neighbours sharing the theme. */
export const Default: Story = {
  args: { stories: getRelatedStories("how-much-screen-time-for-a-3-to-6-year-old") },
};

/** The case theme matching alone cannot serve. "Safety" has exactly one article
 *  in the journal, so every card here comes from the ring fill. */
export const OnlyArticleInItsTheme: Story = {
  args: { stories: getRelatedStories("what-to-look-for-in-a-safe-ai-toy") },
};

/** Renders nothing rather than an empty heading. */
export const NoRelatedStories: Story = {
  args: { stories: [] },
};

/** Sanity: the journal really does hold nineteen pieces. */
export const WholeJournalCount: Story = {
  args: { stories: STORIES.slice(0, 3) },
};
