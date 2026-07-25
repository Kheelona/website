import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KheeluGuide } from "./KheeluGuide";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";

const meta = {
  title: "Organisms/KheeluGuide",
  component: KheeluGuide,
  parameters: { nextjs: { appDirectory: true }, layout: "fullscreen" },
} satisfies Meta<typeof KheeluGuide>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Scroll the canvas: Kheelu's pose + line follow the room under the
 *  viewport centreline. Click him for a poke. */
export const WithRooms: Story = {
  render: () => (
    <div>
      <RoomsTrack className="pt-10">
        <Room fill="white" guide="hero-wink" say="Hi, I'm Kheelu. Come on in.">
          <div style={{ minHeight: "80vh" }}>First room</div>
        </Room>
        <Room fill="cool" guide="curious" say="Read this bit slowly.">
          <div style={{ minHeight: "80vh" }}>Second room</div>
        </Room>
        <Room fill="orange" guide="silly" say="Save your spot.">
          <div style={{ minHeight: "80vh" }}>Finale</div>
        </Room>
      </RoomsTrack>
      <KheeluGuide />
    </div>
  ),
};
