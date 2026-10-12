import type { Meta } from "@/content/types";

/**
 * The campaign registry (architecture §5.4; structure §3.3): a campaign landing page is a content
 * module under campaigns/ plus one line here, rendered by src/app/(site)/lp/[slug] with
 * `dynamicParams = false`, so a slug not listed here is a 404. None at launch: the route's
 * generateStaticParams returns an empty list, which Next allows only with Cache Components off
 * (ADR-005). Every entry is a page module, so it carries the page's meta like every other page.
 */
export interface CampaignEntry {
  readonly meta: Meta;
}

export const campaigns = {} as const satisfies Readonly<Record<string, CampaignEntry>>;

export type CampaignSlug = keyof typeof campaigns;

export const campaignSlugs: readonly string[] = Object.keys(campaigns);

/** The campaign for a URL slug, or undefined for anything not in the registry. */
export function getCampaign(slug: string): CampaignEntry | undefined {
  return Object.hasOwn(campaigns, slug) ? (campaigns as Readonly<Record<string, CampaignEntry>>)[slug] : undefined;
}
