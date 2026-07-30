import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RoomsTrack } from "./RoomsTrack";
import { Room } from "./Room";

const meta = {
  title: "Atoms/RoomsTrack",
  component: RoomsTrack,
  parameters: { nextjs: { appDirectory: true }, layout: "fullscreen" },
} satisfies Meta<typeof RoomsTrack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeRooms: Story = {
  args: {
    children: (
      <>
        <Room fill="white">First room</Room>
        <Room fill="cool">Second room</Room>
        <Room fill="white">Finale room</Room>
      </>
    ),
  },
};
