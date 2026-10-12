import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { RecognitionStripConfig } from "./recognition-strip.types";
import { RecognitionStrip } from "./RecognitionStrip";

/* RecognitionStrip (task 3.4): the team page's "Recognised by" fold (team.html fold 5). In the build the whole fold is
 * hidden until at least one programme's proof is filed (D038, F11), so today it renders nothing. Story and test data
 * only (exported in capitals, left out of the story list): the programme names are placeholders here, never a claim. */

const gated = { gated: { proof: "F11" } } as const;

export const RECOGNITION_GATED: RecognitionStripConfig = {
  title: "Recognised by.",
  items: [
    { name: "Programme one", ...gated },
    { name: "Programme two", ...gated },
  ],
};

/** The same items once one proof is filed: only that programme shows, by name, as text. */
export const RECOGNITION_ONE_FILED: RecognitionStripConfig = {
  ...RECOGNITION_GATED,
  items: [{ name: "Programme one" }, { name: "Programme two", ...gated }],
};

const meta = {
  title: "Sections/RecognitionStrip",
  component: RecognitionStrip,
  excludeStories: /^[A-Z0-9_]+$/,
  args: RECOGNITION_GATED,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof RecognitionStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** As it ships today: every proof outstanding, so nothing renders. */
export const AllGated: Story = {};

/** One proof filed: the fold shows that name alone. */
export const OneFiled: Story = { args: RECOGNITION_ONE_FILED };

/** Every proof filed: the names as one quiet line. */
export const AllFiled: Story = { args: { ...RECOGNITION_GATED, items: [{ name: "Programme one" }, { name: "Programme two" }] } };
