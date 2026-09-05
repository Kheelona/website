import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Footnote, FootnotesRow, V3_FOOTNOTES } from "./FootnotesRow";

const meta = {
  title: "Molecules/FootnotesRow",
  component: FootnotesRow,
  args: { items: V3_FOOTNOTES },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof FootnotesRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** How a marker sits inside a line of copy. */
export const WithMarkerInCopy: Story = {
  render: (args) => (
    <div className="space-y-8">
      <p className="text-[17px]">
        Kheelu talks in up to 10 home languages
        <Footnote n={1} id="fn-languages" />, and every Kheelu includes 6 months of Kheelona+
        <Footnote n={2} id="fn-kheelona-plus" />.
      </p>
      <FootnotesRow {...args} />
    </div>
  ),
};
