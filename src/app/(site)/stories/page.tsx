import type { Metadata } from "next";
import { hubPage, hubPath } from "@/content/en-IN/stories/hub";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { getOffer } from "@/lib/offer/get-offer";
import { pageMeta } from "@/lib/seo/metadata";

/* The stories hub (task 5.5; structure §3.1, §5; stories.html): the hub's content module through the page template,
 * with the live offer. Thin: no words here. The hero with the topic links, one band per topic with all 21 guides, and
 * the journal close; no JSON-LD beyond the shell's (architecture §9.2); the phone buy bar is the shell's. */

/* The journal close shows the price, so the page follows the live mode (ADR-005; OFFER_REVALIDATE_SECONDS, written as a
 * literal because Next reads it statically). */
export const revalidate = 300;

/* The hub's meta names no price (stories.md: the hub is not a commercial page), so it is the same in both modes. */
export const metadata: Metadata = pageMeta({ ...hubPage.meta, path: hubPath });

export default async function StoriesPage() {
  return <PageTemplate page={hubPage} offer={await getOffer()} path={hubPath} />;
}
