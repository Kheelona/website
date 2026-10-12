import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { RelatedGuidesConfig } from "./related-guides.types";
import { RelatedGuides } from "./RelatedGuides";

/* RelatedGuides (task 3.4): the related guides band under an article and the late-talker article's keep-reading close
 * (no pre-order button, B5). The rows are the approved copy (story-*.html), story and test data only (exported in
 * capitals, left out of the story list); in the build each row links to the related article (task 4.2). */

/** story-learning-toys-for-a-three-year-old.html fold 14. */
export const LEARNING_TOYS_RELATED: RelatedGuidesConfig = {
  variant: "related",
  title: "Related guides",
  items: [
    { title: "What actually builds a sharp brain in the early years", href: "/stories#learning" },
    { title: "A toy that talks is not a toy that listens", href: "/stories#talking" },
    { title: "How much screen time is okay for a young child?", href: "/stories#screen-time" },
  ],
};

/** story-what-to-look-for-in-a-safe-ai-toy.html fold 7. */
export const SAFE_AI_TOY_RELATED: RelatedGuidesConfig = {
  variant: "related",
  title: "Related guides",
  items: [
    { title: "The hard questions parents ask about AI toys", href: "/stories#ai-and-safety" },
    { title: "Should kids use AI? An honest answer from people who build it", href: "/stories#ai-and-safety" },
    { title: "What India’s data law asks of a toy that listens", href: "/stories#ai-and-safety" },
  ],
};

/** story-talking-toys-and-late-talkers.html fold 9: keep reading, then the hub, as a secondary button. */
export const LATE_TALKERS_KEEP: RelatedGuidesConfig = {
  variant: "keep",
  title: "Keep reading",
  items: [
    { title: "Talking late, or talking little?", href: "/stories#talking" },
    { title: "How to get your child talking", href: "/stories#talking" },
    { title: "Raising a bilingual child in India", href: "/stories#talking" },
  ],
  action: { label: "All guides for parents of 3 to 7 year olds", href: "/stories" },
};

const meta = {
  title: "Sections/RelatedGuides",
  component: RelatedGuides,
  excludeStories: /^[A-Z0-9_]+$/,
  args: LEARNING_TOYS_RELATED,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof RelatedGuides>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The band of related guides under an article with a close. */
export const Related: Story = {};

/** A long title wraps instead of being cut. */
export const RelatedLongTitles: Story = { args: SAFE_AI_TOY_RELATED };

/** The keep-reading close: a tinted card on the page surface, the rows, then the hub as a secondary button. */
export const Keep: Story = { args: LATE_TALKERS_KEEP };
