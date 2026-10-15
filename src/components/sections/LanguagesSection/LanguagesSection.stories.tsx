import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { homePage } from "@/content/en-IN/pages/home";
import { buildOffer } from "@/lib/offer/offer";
import { LanguagesSection } from "./LanguagesSection";
import type { LanguagesSectionConfig } from "./languages-section.types";

/* LanguagesSection (task Q2.9): Home's own fold, read from its content (pages/home.ts), so the story shows what the page
   publishes: the D2C plan v2 §2 fold 4, film 6 played in place. */

const fold = homePage.sections.find((s) => s.kind === "languages-section");
if (fold?.kind !== "languages-section") throw new Error("Home lists no languages fold");
const HOME: LanguagesSectionConfig = fold.config;

const meta = {
  title: "Sections/LanguagesSection",
  component: LanguagesSection,
  args: { ...HOME, offer: buildOffer("token") },
} satisfies Meta<typeof LanguagesSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Home fold 4, on the band. */
export const Home: Story = {};

/** The same fold on the page surface. */
export const OffBand: Story = { args: { band: false } };
