import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import kabir01 from "@ds/assets/Photo library/kabir-01-imagining-space-web.webp";
import { DoodleDefs } from "@/components/ui/Doodle/DoodleDefs";
import { ImaginationFrame } from "./ImaginationFrame";

/* ImaginationFrame (task 2.3; DS ImaginationFrame). Home fold 3 (home.html:145-151), with and without the founder's
   zoom, drawn below the first screen and still in a hero. */

const meta = {
  title: "UI/ImaginationFrame",
  component: ImaginationFrame,
  decorators: [
    (Story) => (
      <>
        <DoodleDefs />
        <div className="kh-section">
          <div className="kh-container">
            <div className="kh-split">
              <Story />
            </div>
          </div>
        </div>
      </>
    ),
  ],
  args: {
    photo: {
      src: kabir01,
      alt: "A boy in glasses and a rust T-shirt holding Kheelu against a dark wall, looking up at a chalk planet, stars and a thought cloud drawn around his question.",
    },
    sizes: "(min-width: 1024px) 560px, (min-width: 900px) 45vw, calc(100vw - 32px)",
    doodles: [
      { doodle: { name: "chalk-planet" }, left: 4, top: 30, width: 20, rotate: -10 },
      { doodle: { name: "chalk-star" }, left: 16, top: 22, width: 8, rotate: -18 },
      { doodle: { name: "chalk-star" }, left: 86, top: 48, width: 7, rotate: 12 },
      { doodle: { name: "chalk-thought-cloud" }, left: 72, top: 22, width: 20 },
    ],
    question: "why does the moon follow our car?",
  },
} satisfies Meta<typeof ImaginationFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Home fold 3 as approved: the founder's zoom, doodles drawing one after another, the frame fading in. */
export const HomeZoom: Story = { args: { zoom: true, reveal: true } };

/** The DS frame without the zoom. */
export const NoZoom: Story = {};

/** In a hero: the doodles stay still (pick 2) and the photo is the LCP image. */
export const HeroStill: Story = { args: { zoom: true, hero: true, lcp: true } };
