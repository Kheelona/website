import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { cta } from "@/content/en-IN/cta";
import { seller } from "@/content/en-IN/seller";
import { TRUST_COMPACT, TRUST_FULL, trustItems, type TrustId } from "@/content/en-IN/trust";
import { buildOffer } from "@/lib/offer/offer";
import { CtaBlock } from "./CtaBlock";
import type { CtaSecondary } from "./cta-block.types";

/* CtaBlock (task 3.2) in each layout the approved mockup uses, from the real content: the stories are the catalogue
   of what the pages print. Each sits in a DS section and container, under a heading as on its page. */

const trust = (ids: readonly TrustId[]) => ids.map((id) => trustItems[id]);
const seeHow: CtaSecondary = { label: "See how it works", href: "/products/kheelu", variant: "ghost", iconEnd: "arrow-right" };

const meta = {
  title: "Sections/CtaBlock",
  component: CtaBlock,
  args: {
    offer: buildOffer("token"),
    ctaLabel: cta.preorder,
    help: seller.help,
    cta: "finale",
    trust: trust(TRUST_COMPACT),
  },
  render: (args) => (
    <section className="kh-section">
      <div className="kh-container">
        <div className={args.align === "center" ? undefined : "kh-split"}>
          <div>
            <header className={args.align === "center" ? "kh-heading kh-heading--center" : "kh-heading"}>
              <h2 className="kh-heading__title">A toy that asks back.</h2>
            </header>
            <CtaBlock {...args} />
          </div>
        </div>
      </div>
    </section>
  ),
} satisfies Meta<typeof CtaBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `stack`: the Home hero (home.html fold 1): block button with the arrow, ids, help line, ghost link. */
export const HomeHero: Story = {
  args: {
    cta: "hero",
    id: "hero-cta",
    priceId: "hero-price",
    arrow: true,
    block: true,
    layout: "stack",
    helpLine: true,
    secondary: { ...cta.secondary["hero-learn"], variant: "ghost" },
  },
};

/** `beside`, centred, with a secondary button: Home fold 6 (home.html). */
export const CentredSafety: Story = {
  args: { cta: "safety", align: "center", secondary: { ...cta.secondary["safety-learn"], variant: "secondary" } },
};

/** `beside` with the help line inside the group: the safety and guide closes (block button, arrow). */
export const Close: Story = { args: { arrow: true, block: true, helpLine: true } };

/** `journal`: the stories hub and article closes; the help line after the group, then the ghost link. */
export const Journal: Story = { args: { arrow: true, block: true, layout: "journal", helpLine: true, secondary: seeHow } };

/** `full`: the product close (meet-kheelu.html fold 9): the five-item row at the reading measure. */
export const ProductCloseFull: Story = {
  args: { cta: "product-foot", layout: "full", helpLine: true, trust: trust(["deliveries-start", ...TRUST_FULL]) },
};

/** Centred, no help line: the contact close (the whole page is the help line). */
export const ContactNoHelp: Story = { args: { align: "center", secondary: { ...seeHow, label: "See how Kheelu works" } } };

/** Full mode: the paid-in-full sentence replaces the token sentence; nothing else changes (ADR-005). */
export const FullMode: Story = { args: { ...Close.args, offer: buildOffer("full") } };
