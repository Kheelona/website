import type { Metadata } from "next";
import { notFoundPage } from "@/content/en-IN/pages/not-found";
import type { SitePath } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { SiteShell } from "@/layouts/SiteShell/SiteShell";
import { getOffer } from "@/lib/offer/get-offer";
import { pageMeta } from "@/lib/seo/metadata";

/*
 * The 404 (task 5.10; structure §3.1, §5; architecture §9.4): every URL that matches no route renders this page, and
 * so does a dynamic route's unknown param, which stops at the router (`dynamicParams = false`), never a thrown
 * `notFound()` (test/not-found-ssr.test.ts, lessons §1). Thin: the words are src/content/en-IN/pages/not-found.ts.
 *
 * - It sits outside the (site) route group, so it renders the site shell itself: chrome, the WhatsApp bubble (D050),
 *   no buy bar (404.html's meta says `"buybar": false`). The store host keeps its own (src/app/store/not-found.tsx).
 * - The offer is the live one (ADR-005): the close's price sentence and the drawer's follow the store's mode. getOffer's
 *   cache window (300 s) is the prerendered page's revalidate, as on every marketing page.
 * - Metadata: the copy page's title, whole (`absolute`: the root template would add the brand twice), and its
 *   description, both through pageMeta's checks. Nothing else: the page answers 404 and Next adds
 *   `<meta name="robots" content="noindex">` itself, so it has no canonical or share card, and it sets no `robots`
 *   (the root layout's beta noindex, nofollow stands; N15). The path below only names the page to the template.
 */
const PATH: SitePath = "/404";

const { title, description } = pageMeta({ ...notFoundPage.meta, path: PATH });

export const metadata: Metadata = { title, description };

export default async function NotFound() {
  const offer = await getOffer();
  return (
    <SiteShell offer={offer}>
      <PageTemplate page={notFoundPage} offer={offer} path={PATH} />
    </SiteShell>
  );
}
