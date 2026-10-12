import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { campaigns, campaignSlugs, type CampaignSlug } from "@/content/en-IN/campaigns";
import type { SitePath } from "@/content/types";
import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { getOffer } from "@/lib/offer/get-offer";
import { pageMeta } from "@/lib/seo/metadata";

/*
 * Campaign landing pages (architecture §5.4; structure §3.1): one page per entry of the campaign registry
 * (src/content/en-IN/campaigns), each a content module rendered by PageTemplate, so a new campaign needs no code.
 * Empty at launch: generateStaticParams returns [], which Next 16 allows only with Cache Components off (ADR-005;
 * node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md, "With Cache Components").
 *
 * An unknown slug is a routing 404, never a thrown one: with `dynamicParams = false` a slug outside the list never
 * reaches the page, and the root not-found renders in full on the server (test/not-found-ssr.test.ts; lessons §1).
 */
export const dynamicParams = false;

/** Campaign pages show prices, so they follow the live offer mode like every such page (ADR-005; a literal: Next
 *  reads it statically). */
export const revalidate = 300;

export function generateStaticParams() {
  return campaignSlugs.map((slug) => ({ slug }));
}

function isCampaign(slug: string): slug is CampaignSlug {
  return Object.hasOwn(campaigns, slug);
}

/** The campaign's page module, read from the registry's own values (not its wider `CampaignEntry`), so an entry that
 *  is not a whole page (PageContent: meta and sections) fails to compile here. */
function campaignPage(slug: string): PageContent | undefined {
  if (!isCampaign(slug)) return undefined;
  return campaigns[slug];
}

const pathOf = (slug: string): SitePath => `/lp/${slug}`;

interface CampaignPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CampaignPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = campaignPage(slug);
  if (page === undefined) return {};
  return pageMeta({ ...page.meta, path: pathOf(slug), offer: await getOffer() });
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { slug } = await params;
  const page = campaignPage(slug);
  /* Unreachable with dynamicParams = false (only listed slugs get here); kept for TypeScript's narrowing, and the
     right answer should that export ever go. */
  if (page === undefined) notFound();
  return <PageTemplate page={page} offer={await getOffer()} path={pathOf(slug)} />;
}
