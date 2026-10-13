import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { buildOffer } from "@/lib/offer/offer";
import { LEGAL_FIXTURES, LEGAL_TEMPLATE_GATE_A_COPY } from "../../../test/fixtures/legal";
import { LegalTemplate } from "./LegalTemplate";

/* LegalTemplate (task 4.3): the four approved legal pages rendered from fixture content copied from them
 * (test/fixtures/legal), each in its family, with the template's own words from content (legal/shared.ts, task 4.5) as the Gate A mockups print them
 * (LEGAL_TEMPLATE_GATE_A_COPY: the complaint-reference note D055 item 7 later ruled off the live pages).
 * The shell's <main> is the decorator, as SiteShell holds the page, so
 * test/e2e/legal-template.spec.ts compares each story with its mockup's <main>, pixel for pixel, before the real legal
 * modules exist (tasks 5.11-5.14). Token mode, as the mockups render. */

const meta: Meta<typeof LegalTemplate> = {
  title: "Layouts/LegalTemplate",
  component: LegalTemplate,
  decorators: [
    (Story) => (
      <main id="main">
        <Story />
      </main>
    ),
  ],
  args: { copy: LEGAL_TEMPLATE_GATE_A_COPY, offer: buildOffer("token") },
};
export default meta;

type Story = StoryObj<typeof LegalTemplate>;

/** `reference`: privacy.html. */
export const Privacy: Story = { args: { ...LEGAL_FIXTURES.privacy } };
/** `reference`: terms.html, with the short version as numbered points and the parts in three groups. */
export const Terms: Story = { args: { ...LEGAL_FIXTURES.terms } };
/** `notice`: refund.html, Kheelu's note on a board from 900 px. */
export const Refund: Story = { args: { ...LEGAL_FIXTURES.refund } };
/** `notice`: shipping.html. */
export const Shipping: Story = { args: { ...LEGAL_FIXTURES.shipping } };
