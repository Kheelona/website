import { setupPage } from "@/content/en-IN/pages/setup";
import type { SitePath } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { getOffer } from "@/lib/offer/get-offer";
import { pageMeta } from "@/lib/seo/metadata";

/* The setup page (task 5.8; structure §3.1, §5): its content module through the page template, with the live offer.
 * Thin: every word is the module's (src/content/en-IN/pages/setup.ts). It has no buy bar (setup.html meta
 * `buybar: false`). */

const PATH: SitePath = "/setup";

/* Since the selling update (task Q2.12) the close's price line shows the price, so the page follows the live mode
 * (ADR-005; OFFER_REVALIDATE_SECONDS, written as a literal because Next reads it statically). */
export const revalidate = 300;

/* The title and description name no amount, so they read the same in both modes (pageMeta needs no offer). */
export const metadata = pageMeta({ ...setupPage.meta, path: PATH });

export default async function SetupPage() {
  return <PageTemplate page={setupPage} offer={await getOffer()} path={PATH} />;
}
