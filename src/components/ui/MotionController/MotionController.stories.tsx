import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChalkHeart, ChalkStar, DoodleChalkFilter, InkSparkLines } from "@/assets/doodles.generated";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import { Icon } from "../Icon/Icon";
import { MotionController } from "./MotionController.client";

/* The demo the reveal spec runs on (test/e2e/motion-reveal.spec.ts; task 2.8, D049 picks 1A and 3B): a page of
 * DS sections whose first block is on screen at load at every width (the second peeks in on taller screens), the
 * rest below the fold, and two art boards whose doodles draw (data-draw, orders 1 and 2). Scroll to watch each block
 * fade and rise once and each doodle draw once; with reduced motion nothing moves. The words are a demo, not site
 * copy. */

type DemoSection = { id: string; eyebrow: string; title: string; cards: string[]; art?: "sky" | "sun" };

const SECTIONS: readonly DemoSection[] = [
  { id: "top", eyebrow: "On screen at load", title: "Shown as it is", cards: ["Already in view", "Never fades in", "Marked first"] },
  { id: "second", eyebrow: "Below the fold", title: "Fades and rises once", cards: ["One", "Two", "Three"] },
  { id: "doodles", eyebrow: "Doodles", title: "Draw themselves once", cards: ["Order 1", "Order 2"], art: "sky" },
  { id: "fourth", eyebrow: "Further down", title: "Still waiting", cards: ["Four", "Five", "Six"] },
  { id: "more-doodles", eyebrow: "More doodles", title: "Drawn on arrival", cards: ["Order 1", "Order 2"], art: "sun" },
  { id: "last", eyebrow: "The end", title: "Revealed last", cards: ["Seven", "Eight", "Nine"] },
];

function Cards({ section }: { section: DemoSection }) {
  return (
    <div className={section.art ? "kh-cols" : "kh-cols kh-cols--3"} data-reveal="" data-testid={`reveal-${section.id}`}>
      {section.cards.map((title) => (
        <article key={title} className="kh-card kh-card--tint kh-tone-sun">
          <h3 className="kh-card__title">{title}</h3>
          <p className="kh-card__body">A block with data-reveal.</p>
        </article>
      ))}
    </div>
  );
}

function Board({ section }: { section: DemoSection }) {
  return (
    <div className={`kh-art kh-tone-${section.art}`} role="img" aria-label="Demo art board with drawing doodles">
      <ChalkHeart
        className="kh-art__layer"
        data-draw=""
        data-draw-order="1"
        data-testid={`draw-${section.id}-1`}
        style={{ left: "8%", top: "12%", width: "34%" }}
      />
      <ChalkStar className="kh-art__layer" data-draw="" data-draw-order="2" style={{ left: "58%", top: "18%", width: "24%" }} />
      <InkSparkLines
        className="kh-art__layer"
        data-draw=""
        data-draw-order="2"
        data-testid={`draw-${section.id}-2`}
        style={{ left: "40%", top: "58%", width: "30%" }}
      />
    </div>
  );
}

function RevealDemo() {
  return (
    <main>
      <svg className="kh-sr" aria-hidden="true" focusable="false">
        <defs>
          <DoodleChalkFilter />
        </defs>
      </svg>
      {SECTIONS.map((section, i) => (
        <section key={section.id} className={i % 2 ? "kh-section kh-section--band" : "kh-section"} aria-labelledby={`demo-${section.id}`}>
          <div className="kh-container">
            <div className="kh-section__head">
              <header className="kh-heading">
                <p className="kh-eyebrow">{section.eyebrow}</p>
                <h2 className="kh-heading__title" id={`demo-${section.id}`}>
                  {section.title}
                </h2>
              </header>
            </div>
            {section.art ? (
              <div className="kh-split">
                <Cards section={section} />
                <Board section={section} />
              </div>
            ) : (
              <Cards section={section} />
            )}
          </div>
        </section>
      ))}
      <MotionController />
    </main>
  );
}

const meta = {
  title: "UI/MotionController",
  component: MotionController,
  parameters: { nextjs: { appDirectory: true, navigation: { pathname: "/" } } },
} satisfies Meta<typeof MotionController>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Reveals and doodle draws on a page of DS sections. */
export const Demo: Story = {
  render: () => <RevealDemo />,
};

/* Task Q2.5 (D064 item 10): line drawing and the micro-interactions on DS markup. The first heading's Hand is on screen
 * at load (shown drawn, never writing); further down, a Hand writes itself in and a Mark draws its crayon stroke, each
 * once as it enters. The cards with a link lift on hover (a fine pointer) or when their link has keyboard focus, and
 * their arrow nudges; the card without a link stays still. The ghost link's arrow nudges; the tags press. With reduced
 * motion nothing moves. The words are a demo, not site copy. */
type AccentSection = { id: string; eyebrow: string; before: string; accent: string; after?: string; kind: "hand" | "mark" };

const ACCENT_SECTIONS: readonly AccentSection[] = [
  { id: "accent-top", eyebrow: "On screen at load", before: "Shown as it is, ", accent: "never writing.", kind: "hand" },
  { id: "accent-hand", eyebrow: "Below the fold", before: "A Hand phrase ", accent: "writes itself in.", kind: "hand" },
  { id: "accent-mark", eyebrow: "Further down", before: "", accent: "A Mark", after: " draws its stroke.", kind: "mark" },
];

function LineDrawingDemo() {
  return (
    <main>
      {ACCENT_SECTIONS.map((section, i) => (
        <section key={section.id} className={i % 2 ? "kh-section kh-section--band" : "kh-section"} aria-labelledby={section.id}>
          <div className="kh-container">
            <div className="kh-section__head">
              <header className="kh-heading">
                <p className="kh-eyebrow">{section.eyebrow}</p>
                <h2 className="kh-heading__title" id={section.id}>
                  {section.before}
                  <span className={`kh-${section.kind}`} data-testid={section.id}>
                    {section.accent}
                  </span>
                  {section.after}
                </h2>
              </header>
            </div>
            <div className="kh-cols kh-cols--3">
              <Card title="A card with a link" body="Lifts on hover; its arrow nudges." link={{ href: "#cards", label: "Read the guide", icon: <Icon name="arrow-right" /> }} />
              <Card title="Two links" body="The contact cards' row." links={[{ href: "#email", label: "Email", icon: <Icon name="arrow-right" /> }]} />
              <Card title="No link" body="Stays still." />
            </div>
            <p>
              <Button variant="ghost" href="#more" iconEnd="arrow-right">
                See all questions
              </Button>
            </p>
            <ul className="kh-chips">
              <li>
                <a className="kh-tag" href="#topic-1">
                  Talking
                </a>
              </li>
              <li>
                <a className="kh-tag" href="#topic-2">
                  Screen time
                </a>
              </li>
            </ul>
          </div>
        </section>
      ))}
      <MotionController />
    </main>
  );
}

/** Line drawing and the micro-interactions (task Q2.5, D064 item 10). */
export const LineDrawing: Story = {
  render: () => <LineDrawingDemo />,
};
