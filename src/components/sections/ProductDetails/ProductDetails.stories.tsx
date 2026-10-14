import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SERVER_RENDERED } from "@/components/ui/Tabs/Tabs.stories";
import { kheeluPage } from "@/content/en-IN/products/kheelu/page";
import { buildOffer } from "@/lib/offer/offer";
import type { ProductDetailsConfig } from "./product-details.types";
import { ProductDetails } from "./ProductDetails";

/* ProductDetails (tasks 3.4 and 3.5): the product page's fold 7 (meet-kheelu.html): specs, in the box and safety on
 * ui/Tabs, as approved (P1 default, N21 corrected), beside the declarations card. Story and test data only (exported in
 * capitals, left out of the story list). PRODUCT_DETAILS is the product page's own fold 7 (products/kheelu/page.ts, its
 * facts from products/kheelu/product.ts), read, never retyped, so every story prints what the site prints (task 8b.1d):
 * the approved fold through its accepted changes, the F4 rows off the page until their values come (D054 item 19), the
 * parent app and safety lines in the live team's code-checked words (D058). ProductDetails.test.tsx holds it to the
 * frozen mockup's fold with those changes applied; test/e2e/tabs.spec.ts compares the Default story with the approved
 * page's tabbed fold, the same changes applied, and uses the served and hydrated stories for the states before and
 * without JavaScript. */

type PageSection = (typeof kheeluPage.sections)[number];
const fold = kheeluPage.sections.find((s): s is Extract<PageSection, { kind: "product-details" }> => s.kind === "product-details");
if (!fold) throw new Error("ProductDetails stories: the product page has no product-details fold");

export const PRODUCT_DETAILS: ProductDetailsConfig = fold.config;

/** A fact still open (F4) shows its placeholder in place, visibly, as the mockup's rows did; the product page takes such a
 *  row off instead (D054 item 19). Three of the mockup's open rows and lines, put back in their places. */
export const PRODUCT_DETAILS_OPEN: ProductDetailsConfig = {
  ...PRODUCT_DETAILS,
  specs: { ...PRODUCT_DETAILS.specs, rows: [...PRODUCT_DETAILS.specs.rows, { term: "Size and weight", value: "{ph:F4 size and weight}" }] },
  safety: {
    ...PRODUCT_DETAILS.safety,
    items: [...PRODUCT_DETAILS.safety.items, { icon: "battery-charging", text: "Battery safety: {ph:F4 battery safety certification}" }],
  },
  declarations: {
    ...PRODUCT_DETAILS.declarations,
    rows: [...PRODUCT_DETAILS.declarations.rows.slice(0, 3), { term: "Net quantity", value: "{ph:F4 net quantity}" }, ...PRODUCT_DETAILS.declarations.rows.slice(3)],
  },
};

const meta = {
  title: "Sections/ProductDetails",
  component: ProductDetails,
  excludeStories: /^[A-Z0-9_]+$/,
  args: { ...PRODUCT_DETAILS, offer: buildOffer("token") },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ProductDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

/** With JavaScript, as the product page shows it: the tab row (Specs, In the box, Safety), the Specs panel shown, beside
 *  the declarations card. */
export const Default: Story = {};

/** Full mode: the declarations print the same MRP (its own value, D034). */
export const FullMode: Story = { args: { offer: buildOffer("full") } };

/** A fact still open (F4): its placeholder in place, visibly, until the founder sends the value (the product page takes
 *  the row off meanwhile, D054 item 19). */
export const WithOpenFacts: Story = { args: PRODUCT_DETAILS_OPEN };

/** The served HTML without JavaScript: the three panels stacked under their headings, no tab row. */
export const WithoutJavaScript: Story = {
  render: (args) => <SERVER_RENDERED element={<ProductDetails {...args} />} hydrate={false} />,
};

/** The served HTML, painted, then hydrated in place as Next does: the island makes tabs of it. */
export const Hydrated: Story = {
  render: (args) => <SERVER_RENDERED element={<ProductDetails {...args} />} hydrate />,
};

/** As on the product page, the fold below the first screen (a story-only spacer above it), served then hydrated. */
export const BelowTheFirstScreen: Story = {
  render: (args) => (
    <>
      <div style={{ minHeight: "150vh" }} aria-hidden="true" />
      <SERVER_RENDERED element={<ProductDetails {...args} />} hydrate />
    </>
  ),
};
