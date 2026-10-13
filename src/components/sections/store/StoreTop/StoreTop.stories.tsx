import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { navigation } from "@/content/en-IN/navigation";
import { storePage } from "@/content/en-IN/store/store-page";
import { buildOffer } from "@/lib/offer/offer";
import { StoreTop } from "./StoreTop";

/* StoreTop (task 5.15): the store's first screen (store.html fold 1), with the store's own content, in both offer
 * modes. Shown in a container, as the store page places it. */

const meta = {
  title: "Sections/Store/StoreTop",
  component: StoreTop,
  args: { content: storePage.top, offer: buildOffer("token"), newTabNote: navigation.labels.newTabNote },
  decorators: [
    (Story) => (
      <div className="kh-section">
        <div className="kh-container">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof StoreTop>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Token mode: the D028 sentence (₹499 today, the balance before delivery, the total). */
export const Token: Story = {};

/** Full mode: the full-price sentence. */
export const Full: Story = { args: { offer: buildOffer("full") } };
