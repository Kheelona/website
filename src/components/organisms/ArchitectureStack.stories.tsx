import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArchitectureStack } from "./ArchitectureStack";

const meta = {
  title: "Organisms/ArchitectureStack",
  component: ArchitectureStack,
} satisfies Meta<typeof ArchitectureStack>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A trimmed sample of the /playos stack (the full six-layer data lives in
 *  the page, sourced from the team's architecture diagram). */
export const Sample: Story = {
  args: {
    above: [
      {
        id: "companion",
        name: "Physical AI companion",
        blurb: "The part your child hugs: a screen-free friend that talks, teaches, and keeps up.",
        chips: ["Screen free", "Educational", "Endless conversations", "Multi-language"],
        tint: "bg-white",
      },
      {
        id: "app",
        name: "Mobile application",
        blurb: "The part you hold: every conversation, control, and progress report in one place.",
        chips: ["Dashboard", "Progress reports", "Story library"],
        tint: "bg-white",
      },
    ],
    below: [
      {
        id: "cloud",
        name: "Cloud and AI engine",
        blurb: "The brain for the richer turns, with safety checks on both doors.",
        chips: ["Voice-to-voice AI", "Voice SLM", "Safety filters"],
        tint: "bg-cool",
      },
      {
        id: "hardware",
        name: "Hardware",
        blurb: "The body under the fur: safe power in an enclosure built to be hugged.",
        chips: ["Custom PCB", "Battery management (BMS)", "USB-C charging"],
        tint: "bg-orange/15",
      },
    ],
  },
};
