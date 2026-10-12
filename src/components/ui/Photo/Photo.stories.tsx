import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";
import appActivity from "@/assets/app/app-activity.webp";
import kheeluBelly from "@ds/assets/Kheelu/kheelu-belly-module.png";
import kheeluOnFur from "@ds/assets/Kheelu/kheelu-on-fur.jpg";
import advik02 from "@ds/assets/Photo library/advik-02-whispering-to-kheelu-web.webp";
import ira01 from "@ds/assets/Photo library/ira-01-story-on-the-bed-web.webp";
import tara02 from "@ds/assets/Photo library/tara-02-evening-with-amma-web.webp";
import { Photo } from "./Photo";

/* Photo (task 2.3; DS kh-photo). Each story is one approved placement; the alt texts are the mockup's. */

const COLUMN = "(min-width: 1024px) 560px, (min-width: 900px) 45vw, calc(100vw - 32px)";

/* Typed as a plain Decorator: an inline decorator would take Photo's props union (the framed photo, or the bare form,
   task 3.6) as its args, and Storybook intersects decorator args, which collapses the union (ArtBoard.stories.tsx). */
const inASplitColumn: Decorator = (Story) => (
  <div className="kh-section">
    <div className="kh-container">
      <div className="kh-split">
        <Story />
      </div>
    </div>
  </div>
);

const meta = {
  title: "UI/Photo",
  component: Photo,
  decorators: [inASplitColumn],
  args: {
    image: { src: ira01, alt: "A laughing girl in a peach kurta sitting cross-legged on a block-print bedsheet, telling Kheelu a story with both hands." },
    sizes: COLUMN,
  },
} satisfies Meta<typeof Photo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The DS frame, 4:5, xl radius (home.html:170). */
export const Portrait: Story = { args: { xl: true } };

/** 16:9 (meet-kheelu.html:157). */
export const Wide: Story = {
  args: { variant: "wide", xl: true, image: { src: advik02, alt: "A boy in a mustard shirt leaning close to whisper to Kheelu, on a cane chair by a tall window." } },
};

/** 1:1 (meet-kheelu.html:141, the offer photo). */
export const Square: Story = {
  args: { variant: "square", xl: true, image: { src: kheeluOnFur, alt: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy." } },
};

/** The safety hero photo, the page's LCP image: eager, fetchpriority high (safety.html:15). */
export const Lcp: Story = {
  args: { variant: "wide", xl: true, lcp: true, image: { src: tara02, alt: "A girl and her mother on a sofa in the evening lamp light, with Kheelu between them." } },
};

/** A screenshot at its own ratio, with a caption (setup.html:99-102). */
export const RatioWithCaption: Story = {
  args: {
    ratio: "576 / 1209",
    image: { src: appActivity, alt: "The parent app’s activity screen on a phone, showing example activity for one child." },
    caption: "The parent app’s activity screen. The child’s name and the activity shown are examples.",
  },
};

/** Fades in once on scroll under MotionController (D049 pick 1). */
export const Revealed: Story = { args: { reveal: true } };

/** The bare form (task 3.6): the image alone, no frame or crop, at its own ratio; the section's class sizes it
 *  (ModesSection's "Good to know" photo, meet-kheelu.html fold 4). */
export const Bare: Story = {
  args: {
    bare: true,
    sizes: "(min-width: 720px) 224px, 176px",
    image: { src: kheeluBelly, alt: "Kheelu’s tummy unit up close, with its speaker, light ring and buttons." },
  },
};
