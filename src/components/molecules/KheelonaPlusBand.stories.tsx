import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KheelonaPlusBand } from "./KheelonaPlusBand";

const meta = {
  title: "Molecules/KheelonaPlusBand",
  component: KheelonaPlusBand,
  parameters: {
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component:
          "The subscription said plainly. The price and the post-lapse behaviour are founder-gated (V3-b), so this band names the included period and the no-surprise-renewal promise and stops there.",
      },
    },
  },
} satisfies Meta<typeof KheelonaPlusBand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithFootnoteMarker: Story = { args: { footnote: 2 } };
