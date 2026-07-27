import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TallyEmbed } from "./TallyEmbed";

/** With NEXT_PUBLIC_TALLY_FORM_URL unset (or DUMMY) this renders the flagged
 *  placeholder panel; once the founder wires the real Tally URL it embeds the
 *  pre-order iframe. */
const meta = {
  title: "Molecules/TallyEmbed",
  component: TallyEmbed,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof TallyEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
