import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { RecognitionStripConfig } from "./recognition-strip.types";
import { RecognitionStrip } from "./RecognitionStrip";

/* RecognitionStrip (task 3.4; marks since task 6.6, D054 item 20): the team page's "Recognised by" fold (team.html
 * fold 5). Story and test data only (exported in capitals, left out of the story list): the names and alts are stand-ins,
 * never a claim; the marks are the live files' shapes (public/recognition/*.png, as their real sizes), so the row lays out
 * as on the page. The page's own programmes are src/content/en-IN/pages/team.ts. */

const gated = { gated: { proof: "F11" } } as const;

/** Every programme gated (D038): nothing renders. */
export const RECOGNITION_GATED: RecognitionStripConfig = {
  title: "Recognised by.",
  items: [
    { name: "Programme one", ...gated },
    { name: "Programme two", ...gated },
  ],
};

/** One programme shown, by name, the other still gated. */
export const RECOGNITION_ONE_FILED: RecognitionStripConfig = {
  ...RECOGNITION_GATED,
  items: [{ name: "Programme one" }, { name: "Programme two", ...gated }],
};

/** The live strip's shape: a mark that names its programme, a decorative mark beside its name, a second named mark,
 *  and a name with no mark. */
export const RECOGNITION_LIVE: RecognitionStripConfig = {
  title: "Recognised by.",
  items: [
    { name: "Programme one", mark: { src: "/recognition/nvidia-inception.png", width: 575, height: 200, alt: "Mark one" } },
    { name: "Programme two", mark: { src: "/recognition/karnataka-seal.png", width: 240, height: 240, alt: "" } },
    { name: "Programme three", mark: { src: "/recognition/nasscom.png", width: 306, height: 126, alt: "Mark three" } },
    { name: "Programme four" },
  ],
};

const meta = {
  title: "Sections/RecognitionStrip",
  component: RecognitionStrip,
  excludeStories: /^[A-Z0-9_]+$/,
  args: RECOGNITION_LIVE,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof RecognitionStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** As the team page ships it (D054 item 20): marks, a mark beside its name, and a name alone, in one quiet row. */
export const Live: Story = {};

/** Names only, no marks. */
export const NamesOnly: Story = { args: { items: RECOGNITION_LIVE.items.map(({ name }) => ({ name })) } };

/** One programme shown, the other gated (D038): the gated one never renders. */
export const OneFiled: Story = { args: RECOGNITION_ONE_FILED };

/** Every programme gated: nothing renders. */
export const AllGated: Story = { args: RECOGNITION_GATED };
