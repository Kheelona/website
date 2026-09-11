import type { Meta, StoryObj } from "@storybook/react";
import { SpecTable } from "./SpecTable";

const meta: Meta<typeof SpecTable> = {
  title: "Molecules/SpecTable",
  component: SpecTable,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof SpecTable>;

export const Default: Story = {};

export const WithCaption: Story = {
  args: { caption: "Everything Kheelona has published about Kheelu, including the three things it has not." },
};

/** The rows that answer "not announced yet" render in muted ink and never
 *  reach the Product schema. */
export const Phone: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
