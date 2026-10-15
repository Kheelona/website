import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { homePage } from "@/content/en-IN/pages/home";
import { buildOffer } from "@/lib/offer/offer";
import { StickyScroll } from "./StickyScroll";
import type { StickyScrollConfig } from "./sticky-scroll.types";

/* StickyScroll (task Q2.9): Home's own fold, read from its content (pages/home.ts), so the story shows what the page
   publishes: the D2C plan v2 §2 fold 5. Under 900 px the points stack with their small pictures; from 900 px the
   heading, the stage and the progress line stay in view while the points scroll. */

const fold = homePage.sections.find((s) => s.kind === "sticky-scroll");
if (fold?.kind !== "sticky-scroll") throw new Error("Home lists no sticky-scroll fold");
const HOME: StickyScrollConfig = fold.config;

const meta = {
  title: "Sections/StickyScroll",
  component: StickyScroll,
  args: { ...HOME, offer: buildOffer("token") },
} satisfies Meta<typeof StickyScroll>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Home fold 5, its six points (the page adds its CTA block after the line). */
export const Home: Story = {};

/** Two points only, without the line: the smallest fold the section takes. */
export const TwoPoints: Story = { args: { points: [HOME.points[0], HOME.points[1]], line: undefined } };
