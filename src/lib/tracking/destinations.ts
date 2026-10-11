/**
 * Every destination that measures, attributes, pays or verifies on the site: one row per row of
 * the tracking inventory's "At a glance" table (wiki/site/tracking-inventory.md), including the
 * ones with no code (DNS verification, the warehouse sync, the ones found absent), so the registry
 * test covers every inventory row (ADR-006; architecture §8.2; QA review N2).
 *
 * Data only. IDs never change (brief §9.4); test/guards/tracking-registry.test.ts proves this
 * file equal to the inventory and to architecture §8.2.
 */
import { CAMPAIGN_COOKIE } from "@/lib/campaign";
import { CLICK_ID_COOKIE } from "@/lib/click-id";
import {
  AHREFS_ANALYTICS_KEY,
  GA4_MEASUREMENT_ID,
  META_PIXEL_ID,
  POSTHOG_ASSET_PROXY_PATH,
  POSTHOG_KEY,
  POSTHOG_PROXY_PATH,
} from "@/config/site";

/** How a destination receives data (architecture §8.2 "Kind"). */
export type DestinationKind = "browser" | "server" | "proxy" | "cookie" | "dns" | "dashboard" | "none";

export interface Destination<Key extends string = string> {
  /** The row number in the inventory's "At a glance" table. */
  readonly row: number;
  /** Stable key the event registry uses. */
  readonly key: Key;
  /** The inventory's name for it. */
  readonly name: string;
  /** The ID as architecture §8.2 states it, or why there is none. */
  readonly id: string;
  /** Every public identifier the inventory row names in code font, in its order. */
  readonly ids: readonly string[];
  readonly kind: DestinationKind;
  /** What decides whether it loads or sends (architecture §8.2 "Gate"). */
  readonly gate: string;
  readonly status: "existing";
}

const DESTINATION_LIST = [
  {
    row: 1,
    key: "vercel-web-analytics",
    name: "Vercel Web Analytics",
    id: "Vercel project",
    ids: [],
    kind: "browser",
    gate: "none (reports only from a Vercel deployment)",
    status: "existing",
  },
  {
    row: 2,
    key: "ahrefs-web-analytics",
    name: "Ahrefs Web Analytics",
    id: AHREFS_ANALYTICS_KEY,
    ids: [AHREFS_ANALYTICS_KEY],
    kind: "browser",
    gate: "none on production (on purpose); absent on beta (§15.3)",
    status: "existing",
  },
  {
    row: 3,
    key: "ga4",
    name: "Google Analytics 4",
    id: GA4_MEASUREMENT_ID,
    ids: [GA4_MEASUREMENT_ID],
    kind: "browser",
    gate: "GA4_HOSTS",
    status: "existing",
  },
  {
    row: 4,
    key: "meta-pixel",
    name: "Meta Pixel (browser)",
    id: META_PIXEL_ID,
    ids: [META_PIXEL_ID],
    kind: "browser",
    gate: "META_PIXEL_HOSTS",
    status: "existing",
  },
  {
    row: 5,
    key: "meta-capi",
    name: "Meta Conversions API (server)",
    id: "same pixel, Graph v21.0",
    ids: ["v21.0"],
    kind: "server",
    gate: "token present (absent on beta)",
    status: "existing",
  },
  {
    row: 6,
    key: "posthog-browser",
    name: "PostHog browser SDK",
    id: "project 617632",
    ids: ["617632", POSTHOG_KEY],
    kind: "browser",
    gate: "POSTHOG_HOSTS",
    status: "existing",
  },
  {
    row: 7,
    key: "posthog-server",
    name: "PostHog server event",
    id: "same project",
    ids: [],
    kind: "server",
    gate: "none",
    status: "existing",
  },
  {
    row: 8,
    key: "posthog-proxy",
    name: "PostHog reverse proxy",
    id: `${POSTHOG_PROXY_PATH}, ${POSTHOG_ASSET_PROXY_PATH}`,
    ids: [POSTHOG_PROXY_PATH, POSTHOG_ASSET_PROXY_PATH],
    kind: "proxy",
    gate: "n/a",
    status: "existing",
  },
  {
    row: 9,
    key: "posthog-meta-ads-sync",
    name: "PostHog ← Meta Ads warehouse sync",
    id: "ad account 1195520716116929",
    ids: ["1195520716116929"],
    kind: "dashboard",
    gate: "n/a",
    status: "existing",
  },
  {
    row: 10,
    key: "edge-attribution-cookies",
    name: `Edge attribution cookies ${CAMPAIGN_COOKIE}, ${CLICK_ID_COOKIE}`,
    id: `${CAMPAIGN_COOKIE}, ${CLICK_ID_COOKIE}`,
    ids: [CAMPAIGN_COOKIE, CLICK_ID_COOKIE],
    kind: "cookie",
    gate: ".kheelona.com",
    status: "existing",
  },
  {
    row: 11,
    key: "razorpay",
    name: "Razorpay Checkout + webhooks",
    id: "webhook URL",
    ids: ["store.kheelona.com/api/razorpay/webhook"],
    kind: "server",
    gate: "n/a",
    status: "existing",
  },
  {
    row: 12,
    key: "resend",
    name: "Resend (order emails)",
    id: "n/a",
    ids: [],
    kind: "server",
    gate: "n/a",
    status: "existing",
  },
  {
    row: 13,
    key: "google-search-console",
    name: "Google Search Console",
    id: "sc-domain:kheelona.com",
    ids: ["sc-domain:kheelona.com"],
    kind: "dns",
    gate: "n/a",
    status: "existing",
  },
  {
    row: 14,
    key: "bing-webmaster-tools",
    name: "Bing Webmaster Tools",
    id: "unknown",
    ids: [],
    kind: "none",
    gate: "n/a",
    status: "existing",
  },
  {
    row: 15,
    key: "meta-domain-verification",
    name: "Meta domain verification",
    id: "DNS TXT",
    ids: [],
    kind: "dns",
    gate: "n/a",
    status: "existing",
  },
  {
    row: 16,
    key: "merchant-center-and-ads",
    name: "Merchant Center, product feeds, Google Ads, other pixels",
    id: "none found",
    ids: [],
    kind: "none",
    gate: "n/a",
    status: "existing",
  },
  {
    row: 17,
    key: "well-known-files",
    name: "/.well-known/* and verification files",
    id: "none exist",
    ids: ["/.well-known/*"],
    kind: "none",
    gate: "n/a",
    status: "existing",
  },
] as const satisfies readonly Destination[];

export type DestinationKey = (typeof DESTINATION_LIST)[number]["key"];

export const DESTINATIONS: readonly Destination<DestinationKey>[] = DESTINATION_LIST;
