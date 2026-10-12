import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LanguageChips } from "./LanguageChips";

const meta = {
  title: "UI/LanguageChips",
  component: LanguageChips,
  args: {
    languages: [
      { native: "English" },
      { native: "हिन्दी", english: "Hindi", lang: "hi" },
      { native: "বাংলা", english: "Bengali", lang: "bn" },
      { native: "తెలుగు", english: "Telugu", lang: "te" },
      { native: "தமிழ்", english: "Tamil", lang: "ta" },
      { native: "ಕನ್ನಡ", english: "Kannada", lang: "kn" },
      { native: "Español", english: "Spanish", lang: "es" },
      { native: "Français", english: "French", lang: "fr" },
    ],
    note: "It can switch between them mid-sentence.",
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof LanguageChips>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The eight languages and the note (home.html fold 4). */
export const Default: Story = {};
/** A language announced for later, as a dashed chip. */
export const Soon: Story = { args: { languages: [{ native: "English" }, { native: "മലയാളം", english: "Malayalam", lang: "ml", soon: true }], note: undefined } };
