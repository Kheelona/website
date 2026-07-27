import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tilt, TiltContent } from "./tilt";

const meta = {
  title: "Vendor/Tilt",
  component: Tilt,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Tilt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tilt style={{ width: 240, height: 150 }}>
      <TiltContent
        style={{
          display: "grid",
          placeItems: "center",
          height: "100%",
          borderRadius: 16,
          background: "#0F766E",
          color: "#fff",
        }}
      >
        Tilt me
      </TiltContent>
    </Tilt>
  ),
};
