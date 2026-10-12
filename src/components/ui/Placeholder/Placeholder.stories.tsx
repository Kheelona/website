import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Placeholder } from "./Placeholder";

/* An open fact, with and without an open-item id, inside a line of body text as the pages show it. */
const meta = {
  title: "UI/Placeholder",
  component: Placeholder,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <p className="kh-body">
        Size and weight: <Story />
      </p>
    ),
  ],
} satisfies Meta<typeof Placeholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithId: Story = { args: { id: "F4", note: "size and weight" } };
export const WithoutId: Story = { args: { id: null, note: "region" } };
