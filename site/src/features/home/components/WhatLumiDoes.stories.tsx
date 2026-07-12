import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WhatLumiDoes } from "./WhatLumiDoes";

const meta = {
  title: "Home/WhatLumiDoes",
  component: WhatLumiDoes,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof WhatLumiDoes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
