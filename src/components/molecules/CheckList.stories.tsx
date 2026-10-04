import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CheckList } from "./CheckList";
import { KHEELU_AGES } from "@/config/site";

const meta = {
  title: "Molecules/CheckList",
  component: CheckList,
  args: {
    items: [
      "Screen-free by design",
      "Speaks 10 Indian languages",
      "No open internet access",
      "The parent sees everything",
    ],
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof CheckList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SingleItem: Story = { args: { items: [`Made for ages ${KHEELU_AGES}`] } };
