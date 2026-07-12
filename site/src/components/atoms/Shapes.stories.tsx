import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Shape } from "./Shapes";

const meta = {
  title: "Atoms/Shape",
  component: Shape,
  args: { kind: "flower5", className: "h-24 w-24 text-teal-deep" },
  argTypes: {
    kind: {
      control: "select",
      options: [
        "flower5",
        "flower13",
        "squircle",
        "flower3",
        "flower4",
        "triangle5",
        "polygon",
      ],
    },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Shape>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Flower5: Story = {};
export const Triangle5: Story = { args: { kind: "triangle5" } };
export const Polygon: Story = { args: { kind: "polygon" } };
export const Solid: Story = { args: { kind: "squircle", opacity: 1 } };
