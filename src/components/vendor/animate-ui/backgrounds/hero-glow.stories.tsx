import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeroGlowBackground } from "./hero-glow";

// Decorative absolute-fill background; give it a positioned, sized host so the
// brand-warm blobs have a frame to drift inside.
const meta = {
  title: "Vendor/HeroGlowBackground",
  component: HeroGlowBackground,
  parameters: { nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div style={{ position: "relative", width: 480, height: 320, background: "#FFF7EE" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeroGlowBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
