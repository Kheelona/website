import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ICON_PATHS, ICON_VIEWBOX, type IconName } from "@/assets/icons.generated";
import { List } from "@/components/ui/List/List";
import { EmptyState } from "./EmptyState";

/* Story stand-in for the Icon primitive (task 2.2, built in the same wave): the same DS svg. */
const icon = (name: IconName) => (
  <svg className="kh-icon" viewBox={ICON_VIEWBOX} aria-hidden="true" focusable="false">
    <path d={ICON_PATHS[name]} />
  </svg>
);

const meta = {
  title: "UI/EmptyState",
  component: EmptyState,
  args: { icon: icon("magnifying-glass"), tone: "blue", title: "No stories yet", body: "When there are, you will see them here." },
  parameters: { layout: "padded" },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The DS title and sentence. */
export const Default: Story = {};

/** The 404 block on its band, with the page's heading and four link rows (404.html fold 1). */
export const NotFound: Story = {
  args: {
    variant: "404",
    title: undefined,
    body: undefined,
    children: (
      <>
        <header className="kh-heading kh-heading--center">
          <p className="kh-eyebrow">Page not found</p>
          <h1 className="kh-heading__title">We can’t find that page.</h1>
          <p className="kh-heading__lead">The link may be old, or the address may have a typo. Where were you headed?</p>
        </header>
        <nav className="ks-404__nav" aria-label="Where to go next">
          <List
            className="ks-404__list"
            chevron={icon("caret-right")}
            items={[
              { title: "Home", sub: "What Kheelu is, on one page.", href: "/", icon: icon("house"), tone: "sun" },
              { title: "Meet Kheelu", sub: "The toy, its three modes and the price.", href: "/products/kheelu", icon: icon("heart"), tone: "chilli" },
            ]}
          />
        </nav>
      </>
    ),
  },
  render: (args) => (
    <section className="kh-section kh-section--band">
      <div className="kh-container">
        <EmptyState {...args} />
      </div>
    </section>
  ),
};
