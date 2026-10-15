import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { homePage } from "@/content/en-IN/pages/home";
import { buildOffer } from "@/lib/offer/offer";
import { DayTimeline } from "./DayTimeline";
import type { DayTimelineConfig } from "./day-timeline.types";

/* DayTimeline (task Q2.9): Home's own fold, read from its content (pages/home.ts), so the story shows what the page
   publishes: the D2C plan v2 §2 fold 9, five moments beside the parent app's activity screen. */

const fold = homePage.sections.find((s) => s.kind === "day-timeline");
if (fold?.kind !== "day-timeline") throw new Error("Home lists no day-timeline fold");
const HOME: DayTimelineConfig = fold.config;

const meta = {
  title: "Sections/DayTimeline",
  component: DayTimeline,
  args: { ...HOME, offer: buildOffer("token") },
} satisfies Meta<typeof DayTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Home fold 9. */
export const Home: Story = {};

/** On the cream band. */
export const OnBand: Story = { args: { band: true } };
