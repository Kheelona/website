import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";
import { DOODLE_NAMES } from "@/assets/doodles.generated";
import { Doodle } from "./Doodle";
import { DoodleDefs } from "./DoodleDefs";

/* Doodle and DoodleDefs (task 2.3; D049 picks 2 and 3). Every story renders DoodleDefs once, as SiteShell will, so
   the drawn doodles' grain resolves. test/e2e/motion-doodle.spec.ts drives "Below the fold" (pick 3: the draw, its
   stagger, reduced motion and no JavaScript). */

const meta = {
  title: "UI/Doodle",
  component: Doodle,
  decorators: [
    (Story) => (
      <>
        <DoodleDefs />
        <div className="kh-section">
          <div className="kh-container">
            <Story />
          </div>
        </div>
      </>
    ),
  ],
  args: { name: "chalk-question-mark", draw: false, className: "kh-art__layer", placement: { left: 30, top: 20, width: 40, rotate: 10 } },
} satisfies Meta<typeof Doodle>;

export default meta;
type Story = StoryObj<typeof meta>;

const board = (tone: "blue" | "sun"): Decorator =>
  function OnABoard(Story) {
    return (
      <div className={`kh-art kh-tone-${tone}`}>
        <Story />
      </div>
    );
  };

/** A hero doodle (pick 2): the DS file as a plain <img>, still. */
export const Still: Story = { decorators: [board("blue")] };

/** Below the first screen (pick 3): the inline SVG with data-draw. Without MotionController it is simply drawn. */
export const Drawn: Story = { args: { draw: true }, decorators: [board("blue")] };

/** Every DS doodle the pages use, drawn: chalk on Kheelu Blue, ink on Sunshine (DS 10-pages.md:51). */
export const Gallery: Story = {
  render: () => (
    <div className="kh-cols kh-cols--4">
      {DOODLE_NAMES.map((name) => (
        <div key={name} className={`kh-art kh-tone-${name.startsWith("chalk") ? "blue" : "sun"}`}>
          <Doodle name={name} draw className="kh-art__layer" placement={{ left: 20, top: 20, width: 60 }} />
        </div>
      ))}
    </div>
  ),
};

/**
 * Five doodles well below the first screen, in draw orders 1 to 5 (chalk-question-mark, order 3, has a filled dot), as
 * the Home imagination frame staggers its doodles. test/e2e/motion-doodle.spec.ts drives this story. The spacers are
 * story fixtures only: they put the board below the first screen of any viewport the spec opens, with room to scroll
 * it fully into view.
 */
export const BelowTheFold: Story = {
  render: () => (
    <>
      <div style={{ minHeight: "150vh" }} aria-hidden="true" />
      <div className="kh-art kh-tone-blue" data-testid="board">
        <Doodle name="chalk-planet" draw order={1} className="kh-art__layer" placement={{ left: 4, top: 30, width: 20, rotate: -10 }} />
        <Doodle name="chalk-star" draw order={2} className="kh-art__layer" placement={{ left: 16, top: 22, width: 8, rotate: -18 }} />
        <Doodle name="chalk-question-mark" draw order={3} className="kh-art__layer" placement={{ left: 43, top: 40, width: 13, rotate: 10 }} />
        <Doodle name="chalk-thought-cloud" draw order={4} className="kh-art__layer" placement={{ left: 72, top: 22, width: 20 }} />
        <Doodle name="chalk-heart" draw order={5} className="kh-art__layer" placement={{ left: 76, top: 52, width: 12, rotate: 12 }} />
      </div>
      <div style={{ minHeight: "150vh" }} aria-hidden="true" />
    </>
  ),
};
