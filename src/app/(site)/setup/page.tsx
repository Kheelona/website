import { setupPage } from "@/content/en-IN/pages/setup";
import type { SitePath } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { getOffer } from "@/lib/offer/get-offer";
import { pageMeta } from "@/lib/seo/metadata";

/* The setup page (task 5.8; structure §3.1, §5): its content module through the page template, with the live offer.
 * Thin: every word is the module's (src/content/en-IN/pages/setup.ts).
 *
 * No price shows on this page and it has no buy bar (setup.html meta `buybar: false`), so it sets no revalidate of its
 * own: the (site) layout's window, the lowest across the route's segments, keeps the drawer's price sentence current. */

const PATH: SitePath = "/setup";

/* The title and description name no amount, so they read the same in both modes (pageMeta needs no offer). */
export const metadata = pageMeta({ ...setupPage.meta, path: PATH });

export default async function SetupPage() {
  return <PageTemplate page={setupPage} offer={await getOffer()} path={PATH} />;
}
