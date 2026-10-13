import type { PageContent } from "@/layouts/PageTemplate/page-template.types";

/**
 * The campaign registry (architecture §5.4; structure §3.3): a campaign landing page is a content module under
 * campaigns/ plus one line here, rendered by src/app/(site)/lp/[slug] with `dynamicParams = false`, so a slug not listed
 * here is a 404. None at launch: the route's generateStaticParams returns an empty list, which Next allows only with
 * Cache Components off (ADR-005).
 *
 * Every entry is a whole page (task 4.5 item 1): the page shape PageTemplate renders (meta, folds in order, declared
 * JSON-LD nodes), imported as a type only (structure §6, wave-4 close), so the `satisfies` below refuses half a page.
 */
export type CampaignEntry = PageContent;

export const campaigns = {} as const satisfies Readonly<Record<string, CampaignEntry>>;

export type CampaignSlug = keyof typeof campaigns;

export const campaignSlugs: readonly string[] = Object.keys(campaigns);

/** The campaign for a URL slug, or undefined for anything not in the registry (an inherited name included). The
 *  campaign route finds every page through this lookup. */
export function getCampaign(slug: string): CampaignEntry | undefined {
  return Object.hasOwn(campaigns, slug) ? (campaigns as Readonly<Record<string, CampaignEntry>>)[slug] : undefined;
}
