import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { cta } from "@/content/en-IN/cta";
import { seller } from "@/content/en-IN/seller";
import { TRUST_COMPACT, trustItems, type TrustId } from "@/content/en-IN/trust";
import { buildOffer } from "@/lib/offer/offer";
import { CtaBlock } from "./CtaBlock";
import type { CtaSecondary } from "./cta-block.types";

/* CtaBlock (task 3.2) in each layout the approved mockup uses, from the real content: the stories are the catalogue
   of what the pages print. Each sits in a DS section and container, under a heading as on its page. */

const trust = (ids: readonly TrustId[]) => ids.map((id) => trustItems[id]);
const seeHow: CtaSecondary = { label: "See how Kheelu works", href: "/products/kheelu", variant: "ghost", iconEnd: "arrow-right" };

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

/** `stack`: the Home hero (home.html fold 1): the one button shape, ids, help line, ghost link. Every block's button is
 *  full width on phones with the arrow, inline from 720 px, by default (task Q2.15, the consistency review's R2). */
export const HomeHero: Story = {
  args: {
    cta: "hero",
    id: "hero-cta",
    priceId: "hero-price",
    layout: "stack",
    helpLine: true,
    secondary: { ...cta.secondary["hero-learn"], variant: "ghost" },
  },
};

/** `beside`, centred, with a secondary button: a block under a centred heading or line. */
export const CentredSafety: Story = {
  args: { cta: "safety", align: "center", secondary: { ...cta.secondary["safety-learn"], variant: "secondary" } },
};

/** `beside` with the help line inside the group: the safety and guide closes. */
export const Close: Story = { args: { helpLine: true } };

/** `journal`: the stories hub and article closes; the help line after the group, then the ghost link. */
export const Journal: Story = { args: { layout: "journal", helpLine: true, secondary: seeHow } };

/** `beside`: the product close (meet-kheelu.html fold 9), its lines grouped as every close's since task Q2.15 (CON-2),
 *  its button `#reserve`. */
export const ProductClose: Story = { args: { cta: "product-foot", id: "reserve", helpLine: true } };

/** Centred, no help line: the contact close (the whole page is the help line). */
export const ContactNoHelp: Story = { args: { align: "center", secondary: seeHow } };

/** Full mode: the paid-in-full sentence replaces the token sentence; nothing else changes (ADR-005). */
export const FullMode: Story = { args: { ...Close.args, offer: buildOffer("full") } };
