import { contactPage } from "@/content/en-IN/pages/contact";
import type { SitePath } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { getOffer } from "@/lib/offer/get-offer";
import { pageMeta } from "@/lib/seo/metadata";

/* The contact page (task 5.9; structure §3.1, §5): its content module through the page template, with the live offer,
 * and the page's ContactPage node (architecture §9.2). Thin: every word is the module's
 * (src/content/en-IN/pages/contact.ts). */

const PATH: SitePath = "/contact";

/* The close's price sentence and the buy bar show the price, so the page follows the live mode (ADR-005;
 * OFFER_REVALIDATE_SECONDS, written as a literal because Next reads it statically). */
export const revalidate = 300;

/* The title and description name no amount, so they read the same in both modes (pageMeta needs no offer). */
export const metadata = pageMeta({ ...contactPage.meta, path: PATH });

export default async function ContactPage() {
  return <PageTemplate page={contactPage} offer={await getOffer()} path={PATH} />;
}
