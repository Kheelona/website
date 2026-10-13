import type { Metadata } from "next";
import { CloseSection } from "@/components/sections/CloseSection/CloseSection";
import { EmptyStateSection } from "@/components/sections/EmptyStateSection/EmptyStateSection";
import { cta } from "@/content/en-IN/cta";
import { notFoundPage } from "@/content/en-IN/pages/not-found";
import { seller } from "@/content/en-IN/seller";
import type { SitePath } from "@/content/types";
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
 * - Its two folds are rendered by their sections here, as PageTemplate would render them (the page's selling context:
 *   the live offer, the one CTA label, the help line), not through PageTemplate. The root not-found sits in every
 *   route's tree, so every client module it reaches loads on every route, and the section registry behind PageTemplate
 *   reaches every island a page may use (FilmsStrip, Tabs; about 11 KB the 404 never renders). The content module keeps
 *   PageTemplate's shape, and its order (the h1 fold first, no structured data) is checked by its test.
 * - The offer is the live one (ADR-005): the close's price sentence and the drawer's follow the store's mode. getOffer's
 *   cache window (300 s) is the prerendered page's revalidate, as on every marketing page.
 * - Metadata: the copy page's title, whole (`absolute`: the root template would add the brand twice), and its
 *   description, both through pageMeta's checks. Nothing else: the page answers 404 and Next adds
 *   `<meta name="robots" content="noindex">` itself, so it has no canonical or share card, and it sets no `robots`
 *   (the root layout's beta noindex, nofollow stands; N15). The path below only names the page to pageMeta's checks.
 */
const PATH: SitePath = "/404";

const { title, description } = pageMeta({ ...notFoundPage.meta, path: PATH });

export const metadata: Metadata = { title, description };

const [emptyState, close] = notFoundPage.sections;

export default async function NotFound() {
  const offer = await getOffer();
  return (
    <SiteShell offer={offer}>
      <EmptyStateSection {...emptyState.config} />
      <CloseSection {...close.config} offer={offer} ctaLabel={cta.preorder} help={seller.help} />
    </SiteShell>
  );
}
