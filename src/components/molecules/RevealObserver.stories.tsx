import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RevealObserver } from "./RevealObserver";

/** Renders nothing visible: it wires a site-wide IntersectionObserver that
 *  flips [data-reveal] elements to .reveal-in. Included for the catalog. */
const meta = {
  title: "Molecules/RevealObserver",
  component: RevealObserver,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof RevealObserver>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
