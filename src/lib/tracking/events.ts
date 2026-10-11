/**
 * The event registry: every event the site sends, to which destinations, with which parameters,
 * existing or new, and what fires it (ADR-006; architecture §8.2). The names and parameters of the
 * existing events are owned by wiki/site/tracking-inventory.md and never change (brief §9.4); new
 * events are additions here.
 *
 * Data only. The proven funnel (src/features/preorder/lib/analytics.ts, the gates, the server
 * events) stays frozen and keeps sending the existing events itself; only `new` events go through
 * the dispatcher (src/lib/tracking/track.ts). test/guards/tracking-registry.test.ts proves this
 * file equal to the inventory, to architecture §8.2 and to the frozen server payload builders.
 */
import { POSTHOG_REPLAY_DENY_PATHS } from "@/config/site";
import type { DestinationKey } from "./destinations";

export type EventStatus = "existing" | "new";
export type ParamValue = string | number | boolean | readonly string[];
/** A row of the Gate A open items (wiki/site/gate-a-open-items.md), by its number (B9, B11). */
export type DecisionRef = `B${number}`;

/** A parameter added to an existing event after the tag, by a recorded decision. */
export interface AddedParam {
  readonly name: string;
  readonly value: string;
  readonly when: string;
  readonly status: "new";
}

/** A route an existing event now also fires on, same payload, by a recorded decision. */
export interface AddedPlacement {
  readonly route: string;
  readonly decision: DecisionRef;
  readonly status: "new";
}

/** Properties the SDK attaches itself because of one of its init options (inventory §6). */
export interface SdkParams {
  readonly option: string;
  readonly names: readonly string[];
}

export interface TrackedEvent<Name extends string = string> {
  /** Exactly the name the destination receives. */
  readonly name: Name;
  readonly destinations: readonly DestinationKey[];
  /** Parameter names in the inventory's order; dotted paths inside nested payloads (CAPI). */
  readonly params: readonly string[];
  /** Parameters whose value never changes, keyed as in `params`. */
  readonly fixed?: Readonly<Record<string, ParamValue>>;
  /** Shape of the de-duplication key, shared by the browser and the server. */
  readonly eventId?: string;
  /** Sent by the tool's own script or SDK, not by a call in our code. */
  readonly automatic?: true;
  /** Properties the SDK adds from an init option, which tracking parity checks (parity row 14). */
  readonly sdkParams?: SdkParams;
  /** Browser paths where it must never fire (parity row 17). */
  readonly neverOn?: readonly string[];
  readonly added?: readonly AddedParam[];
  readonly addedPlacements?: readonly AddedPlacement[];
  readonly status: EventStatus;
  /**
   * The decision whose gate holds a new event back. When task 6.2 opens it, the main session edits
   * architecture §8.2's Status cell in the same commit (tracking-registry.test.ts reads it).
   */
  readonly gated?: DecisionRef;
  /** What sends it. */
  readonly firedBy: string;
  readonly when: string;
}

/** A property added to every event one destination receives. */
export interface StampedProperty {
  readonly destination: DestinationKey;
  readonly name: string;
  readonly value: string | boolean;
  /** How it is attached, and when. */
  readonly how: string;
  readonly status: "new";
}

const funnel = (call: string) => `preorderAnalytics.${call} (src/features/preorder/lib/analytics.ts)`;
const POSTHOG_SDK = "PostHogGate (posthog-js)";
const PROJECT_SETTING = "sent by posthog-js as the PostHog project settings enable it";
/** posthog-js adds these to its built-in utm_* and click-id keys, read from the landing URL. */
const CAMPAIGN_PARAMS = {
  option: "custom_campaign_params",
  names: ["utm_id", "placement"],
} as const satisfies SdkParams;

const EVENT_LIST = [
  /* ── Automatic pageviews ─────────────────────────────────────────────── */
  {
    name: "pageview",
    destinations: ["vercel-web-analytics", "ahrefs-web-analytics"],
    params: [],
    automatic: true,
    status: "existing",
    firedBy: "their scripts in the root layout",
    when: "every page load",
  },
  {
    name: "page_view",
    destinations: ["ga4"],
    params: [],
    automatic: true,
    status: "existing",
    firedBy: "GoogleAnalyticsGate (gtag config)",
    when: "every page load; enhanced measurement adds its own events (a GA4 admin setting)",
  },

  /* ── Meta Pixel page events ──────────────────────────────────────────── */
  {
    name: "PageView",
    destinations: ["meta-pixel"],
    params: [],
    status: "existing",
    firedBy: "MetaPixel",
    when: "one per full page load, and one per client route change (the first run skipped)",
  },
  {
    name: "ViewContent",
    destinations: ["meta-pixel"],
    params: ["content_name", "content_ids", "content_type", "value", "currency"],
    fixed: { content_name: "Kheelu", content_ids: ["lumi"], content_type: "product", currency: "INR" },
    addedPlacements: [{ route: "/", decision: "B9", status: "new" }],
    status: "existing",
    firedBy: "ViewContentTracker (waits for fbq with whenFbqReady)",
    when:
      "once per load of /products/kheelu, and of / (addedPlacements, B9: same payload); " +
      "value is the offer headline in rupees (4999 in token mode)",
  },

  /* ── The pre-order funnel (frozen; GA4 and PostHog share names and parameters) ── */
  {
    name: "preorder_form_started",
    destinations: ["ga4", "posthog-browser"],
    params: ["tier"],
    status: "existing",
    firedBy: funnel("formStarted"),
    when: "the first change to any field of the pre-order form",
  },
  {
    name: "preorder_start",
    destinations: ["ga4", "posthog-browser"],
    params: ["tier"],
    status: "existing",
    firedBy: funnel("start"),
    when: "a valid submit of the pre-order form",
  },
  {
    name: "begin_checkout",
    destinations: ["ga4", "posthog-browser"],
    params: ["currency", "value", "tier"],
    fixed: { currency: "INR" },
    status: "existing",
    firedBy: funnel("beginCheckout"),
    when: "create-order answered OK; value is the amount collected, in rupees",
  },
  {
    name: "InitiateCheckout",
    destinations: ["meta-pixel"],
    params: ["currency", "value", "content_category"],
    fixed: { currency: "INR" },
    status: "existing",
    firedBy: funnel("beginCheckout"),
    when: "beside begin_checkout; content_category is the tier",
  },
  {
    name: "purchase",
    destinations: ["ga4", "posthog-browser"],
    params: ["transaction_id", "currency", "value", "tier"],
    fixed: { currency: "INR" },
    status: "existing",
    firedBy: funnel("purchase"),
    when: "Razorpay onPaid; transaction_id is the order reference KH-…",
  },
  {
    name: "Purchase",
    destinations: ["meta-pixel"],
    params: ["currency", "value", "content_category", "order_id"],
    fixed: { currency: "INR" },
    eventId: "purchase_<order ref>",
    status: "existing",
    firedBy: funnel("purchase"),
    when: "beside purchase; Meta merges it with the CAPI Purchase by eventID",
  },
  {
    name: "preorder_address_saved",
    destinations: ["ga4", "posthog-browser"],
    params: ["transaction_id"],
    status: "existing",
    firedBy: funnel("addressSaved"),
    when: "the delivery address saved on /thanks",
  },
  {
    name: "preorder_dismissed",
    destinations: ["ga4", "posthog-browser"],
    params: ["tier"],
    status: "existing",
    firedBy: funnel("dismissed"),
    when: "the Razorpay sheet closed",
  },

  /* ── Server events (frozen; sent once per paid order from notifyPaid) ── */
  {
    name: "Purchase",
    destinations: ["meta-capi"],
    params: [
      "event_id",
      "event_time",
      "action_source",
      "event_source_url",
      "user_data.em",
      "user_data.ph",
      "user_data.fn",
      "user_data.fbp",
      "user_data.fbc",
      "user_data.client_ip_address",
      "user_data.client_user_agent",
      "custom_data.currency",
      "custom_data.value",
      "custom_data.order_id",
      "custom_data.content_category",
    ],
    fixed: {
      action_source: "website",
      event_source_url: "https://store.kheelona.com",
      "custom_data.currency": "INR",
    },
    eventId: "purchase_<order ref>",
    status: "existing",
    firedBy: "reportPurchaseToMeta (src/lib/store/meta-capi.ts), from notifyPaid",
    when:
      "once per paid order, after markPaid; em, ph and fn are SHA-256 hashed; " +
      "skipped without a token, so never on beta",
  },
  {
    name: "purchase_confirmed",
    destinations: ["posthog-server"],
    params: [
      "transaction_id",
      "currency",
      "value",
      "tier",
      "source",
      /* The order's campaign keys, spread flat: inventory §9's kh_utm list, written out as data. */
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "utm_id",
      "placement",
      "$process_person_profile",
    ],
    fixed: { currency: "INR", source: "webhook", $process_person_profile: false },
    added: [
      {
        name: "env",
        value: "SITE_ENV",
        when: "every non-production build: beta, preview and development (D048, N4)",
        status: "new",
      },
    ],
    status: "existing",
    firedBy: "reportPurchaseToPostHog (src/lib/store/posthog-server.ts), from notifyPaid",
    when:
      "once per paid order, beside the CAPI Purchase; distinct id is the order's ph_distinct_id, " +
      "else the order reference; timestamp is paid_at",
  },

  /* ── PostHog SDK events ──────────────────────────────────────────────── */
  {
    name: "$pageview",
    destinations: ["posthog-browser"],
    params: [],
    automatic: true,
    sdkParams: CAMPAIGN_PARAMS,
    status: "existing",
    firedBy: `${POSTHOG_SDK}, capture_pageview "history_change"`,
    when: "every page load and history change",
  },
  {
    name: "$pageleave",
    destinations: ["posthog-browser"],
    params: [],
    automatic: true,
    sdkParams: CAMPAIGN_PARAMS,
    status: "existing",
    firedBy: POSTHOG_SDK,
    when: "leaving a page",
  },
  {
    name: "$autocapture",
    destinations: ["posthog-browser"],
    params: ["cta"],
    automatic: true,
    sdkParams: CAMPAIGN_PARAMS,
    status: "existing",
    firedBy: POSTHOG_SDK,
    when: "taps and form changes outside ph-no-capture; cta is promoted from data-ph-capture-attribute-cta (cta.ts)",
  },
  {
    name: "$exception",
    destinations: ["posthog-browser"],
    params: [],
    automatic: true,
    status: "existing",
    firedBy: `${POSTHOG_SDK}, capture_exceptions`,
    when: "an uncaught error",
  },
  {
    name: "$web_vitals",
    destinations: ["posthog-browser"],
    params: [],
    automatic: true,
    status: "existing",
    firedBy: POSTHOG_SDK,
    when: PROJECT_SETTING,
  },
  {
    name: "$dead_click",
    destinations: ["posthog-browser"],
    params: [],
    automatic: true,
    status: "existing",
    firedBy: POSTHOG_SDK,
    when: PROJECT_SETTING,
  },
  {
    name: "$dead_swipe",
    destinations: ["posthog-browser"],
    params: [],
    automatic: true,
    status: "existing",
    firedBy: POSTHOG_SDK,
    when: PROJECT_SETTING,
  },
  {
    name: "$rageclick",
    destinations: ["posthog-browser"],
    params: [],
    automatic: true,
    status: "existing",
    firedBy: POSTHOG_SDK,
    when: PROJECT_SETTING,
  },
  {
    /* Heatmaps are on in the project settings (inventory §6). PostHog keeps heatmap data apart
       from `events`, so the live snapshot cannot show it. */
    name: "$$heatmap",
    destinations: ["posthog-browser"],
    params: [],
    automatic: true,
    status: "existing",
    firedBy: POSTHOG_SDK,
    when: PROJECT_SETTING,
  },
  {
    name: "$snapshot",
    destinations: ["posthog-browser"],
    params: [],
    automatic: true,
    neverOn: POSTHOG_REPLAY_DENY_PATHS,
    status: "existing",
    firedBy: `${POSTHOG_SDK} session replay: disable_session_recording at init, then started per route`,
    when:
      "recording on every route replayAllowedOnPath allows (store / included), never on POSTHOG_REPLAY_DENY_PATHS; " +
      "inputs and .ph-mask text masked",
  },

  /* ── New checkout events (B11; wired only by task 6.2, gated) ────────── */
  {
    name: "preorder_payment_window_opened",
    destinations: ["ga4", "posthog-browser"],
    params: ["tier"],
    status: "new",
    gated: "B11",
    firedBy: "src/features/preorder/lib/checkout.ts, right after checkout.open() (task 6.2)",
    when: "the Razorpay payment window opens",
  },
  {
    name: "preorder_payment_failed",
    destinations: ["ga4", "posthog-browser"],
    params: ["tier", "reason_code", "reason"],
    status: "new",
    gated: "B11",
    firedBy: 'checkout.on("payment.failed", …), registered before open() (task 6.2)',
    when: "a payment fails; reason_code and reason are Razorpay's error.code and error.reason, never free text",
  },
  {
    name: "preorder_form_rejected",
    destinations: ["ga4", "posthog-browser"],
    params: ["tier", "fields"],
    status: "new",
    gated: "B11",
    firedBy: "PreorderForm, on a submit that fails validation (task 6.2)",
    when: "the form refuses a submit; fields are the comma-joined field names, never their values",
  },
] as const satisfies readonly TrackedEvent[];

export type EventName = (typeof EVENT_LIST)[number]["name"];
/** The events only the dispatcher sends; Meta receives none of them. */
export type NewEventName = Extract<(typeof EVENT_LIST)[number], { status: "new" }>["name"];

export const EVENTS: readonly TrackedEvent<EventName>[] = EVENT_LIST;

export const STAMPED_PROPERTIES: readonly StampedProperty[] = [
  {
    destination: "posthog-browser",
    name: "env",
    value: "beta",
    how: "before_send on the two beta hosts only; never posthog.register (D048, N3)",
    status: "new",
  },
  {
    destination: "posthog-browser",
    name: "internal",
    value: true,
    how: 'posthog.register({ internal: true }) after ?internal=1; unregister("internal") after ?internal=0 (B46)',
    status: "new",
  },
];
