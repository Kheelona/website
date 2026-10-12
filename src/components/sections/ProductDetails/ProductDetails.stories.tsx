import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SERVER_RENDERED } from "@/components/ui/Tabs/Tabs.stories";
import { buildOffer } from "@/lib/offer/offer";
import type { ProductDetailsConfig } from "./product-details.types";
import { ProductDetails } from "./ProductDetails";

/* ProductDetails (tasks 3.4 and 3.5): the product page's fold 7 (meet-kheelu.html): specs, in the box and safety on
 * ui/Tabs, as approved (P1 default, N21 corrected), beside the declarations card. The rows are the approved copy with
 * its open facts as placeholders, story and test data only (exported in capitals, left out of the story list); the
 * product page (task 5.2) passes the facts from products/kheelu/product.ts. test/e2e/tabs.spec.ts compares the Default
 * story with the approved page's tabbed fold, and uses the served and hydrated stories for the states before and
 * without JavaScript. */

export const PRODUCT_DETAILS: ProductDetailsConfig = {
  heading: { eyebrow: "Details", title: "The details, {hand:in full.}" },
  tabsLabel: "Product details",
  specs: {
    title: "Specs",
    rows: [
      { term: "Ages", value: "3 to 7" },
      { term: "What it is", value: "A cream plush rabbit with a speaker in its tummy and rainbow-lined ears" },
      { term: "Screen", value: "None" },
      { term: "Camera", value: "None" },
      { term: "Microphone", value: "On only after a press of the wake-up button; off after about a minute of quiet; a light shows while it’s on" },
      { term: "Modes", value: "AI mode (home Wi‑Fi) · Story mode (no Wi‑Fi needed) · Bluetooth mode (a paired phone)" },
      { term: "Open internet", value: "It can’t browse it" },
      { term: "Languages", value: "English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French; up to 10 at launch" },
      {
        term: "Parent app",
        value: "Every conversation, word for word; a weekly report on four thinking skills; a new-word count. {ph:which phones the parent app runs on}",
      },
      { term: "Size and weight", value: "{ph:F4 size and weight}" },
      { term: "Materials", value: "{ph:F4 outer fabric and filling}" },
      { term: "Battery", value: "{ph:F4 battery type, life per charge and charging time}" },
      { term: "Charger", value: "{ph:F4 charger type and its BIS registration number}" },
    ],
  },
  box: {
    title: "In the box",
    items: [
      { icon: "package", text: "Kheelu plush toy" },
      { icon: "battery-charging", text: "Charger" },
      { icon: "book-open", text: "Quick-start card" },
    ],
  },
  safety: {
    title: "Safety",
    items: [
      { icon: "shield-check", text: "Every reply passes an age-graded safety layer, set to the age you enter in the parent app." },
      { icon: "check-circle", text: "Tested before launch by trying to make it say unsafe things." },
      { icon: "info", text: "Toy-safety certification (BIS): applied for, not yet granted. We show no mark until it is granted." },
      { icon: "warning-circle", text: "Age grading and warnings: {ph:F4 toy-safety age grading and any required warnings}" },
      { icon: "battery-charging", text: "Battery safety: {ph:F4 battery safety certification}" },
    ],
  },
  declarations: {
    title: "Declarations",
    rows: [
      { term: "MRP", value: "{price:mrp} (incl. of all taxes)" },
      { term: "Country of origin", value: "India" },
      {
        term: "Manufacturer",
        value:
          "Kheelona Robotics Pvt Ltd, 5th Floor, No 51 (Old Site No 1), Kokarya Business Synergy Center, 5th Main, 5th Block Jayanagar, Bengaluru 560041, Karnataka, India",
      },
      { term: "Net quantity", value: "{ph:F4 net quantity}" },
      { term: "Month and year of manufacture", value: "{ph:F4 month and year of manufacture}" },
      {
        term: "Consumer care",
        value: ["[WhatsApp](https://wa.me/919187546483) or {nowrap:[call +91 91875 46483](tel:+919187546483)}", "[hello@kheelona.com](mailto:hello@kheelona.com)"],
      },
    ],
  },
  link: { label: "Read the returns and warranty terms", href: "/refund" },
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

/** With JavaScript, as approved: the tab row (Specs, In the box, Safety), the Specs panel shown, beside the
 *  declarations card. */
export const Default: Story = {};

/** Full mode: the declarations print the same MRP (its own value, D034). */
export const FullMode: Story = { args: { offer: buildOffer("full") } };

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
