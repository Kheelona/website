import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Chip, ChipList } from "./Chip";

/* The chip and the chip list as the approved pages use them; "OnBand" sits on a band section, where the
   G-19 fix keeps it visible. */
const meta = {
  title: "UI/Chip",
  component: Chip,
  parameters: { layout: "padded" },
  args: { label: "Learning by asking" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Toned: Story = { args: { label: "Words", tone: "sun" } };

export const OnBand: Story = {
  args: { onBand: true },
  render: (args) => (
    <section className="kh-section kh-section--band">
      <Chip {...args} /> <Chip label="Without the fix" />
    </section>
  ),
};

export const List: Story = {
  render: () => <ChipList label="The four thinking skills" tone="sun" items={["Words", "Reasons", "Stories", "Questions"]} />,
};
