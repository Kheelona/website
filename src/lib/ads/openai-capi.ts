import { createHash } from "node:crypto";
import { SITE_ENV } from "@/config/env";
import { STORE_URL } from "@/config/site";
import type { PreorderRow } from "@/lib/store/db";
import {
  OPENAI_CAPI_URL,
  OPENAI_NATIVE_OPPREF_COOKIE,
  OPENAI_OBREF_COOKIE,
  OPENAI_OPPREF_COOKIE,
  openAiOrderData,
  validObref,
  validOppref,
} from "./openai-events";

/**
 * OpenAI's Conversions API: `order_created`, sent from our server (F6, D069).
 *
 * WHY. A browser event is lost when the parent pays and closes the tab, or blocks the pixel. The paid
 * order is known for certain only to the Razorpay webhook, so the report lives where the Meta and PostHog
 * server reports live, in `notifyPaid` (src/lib/store/fulfil.ts), and inherits its two guarantees: it
 * runs exactly once per paid order (behind `markPaid`'s atomic UPDATE) and it never throws. The browser
 * sends the same event with the same id; OpenAI keeps the first it receives (pixel ID + event name + id).
 *
 * THERE IS NO PUBLIC ENDPOINT, and the key is server-only, as with Meta: the only thing that can report a
 * purchase is a purchase Razorpay confirmed, and only hashes of the buyer's email and phone leave.
 *
 * DATA MINIMISATION. An order is reported only if it carries an OpenAI signal: a `oai_oppref` (the buyer
 * came from a ChatGPT ad) or an `oai_obref` (OpenAI's pixel had set its cookie on that browser). Buyers who
 * never met OpenAI's pixel or an OpenAI ad are never sent. Team devices never get those signals (the
 * browser clears the cookies, openai-pixel.ts), so test orders are never sent either. The event holds the
 * order id, the time, the amount, hashed email and phone, the IP address and user agent the order was
 * created from, and the click and browser references. Never a name, an address, a child's age or free
 * text: test/analytics-tags.test.ts holds the key list and greps this file for those fields.
 *
 * THE KEY. `OPENAI_ADS_CAPI_KEY` is read from `process.env` inside the function, never at module scope and
 * never from StoreEnv (that module is frozen). Absent or empty, nothing is sent: the store works before the
 * founder has created a key in Ads Manager, and the key goes only into Vercel's production environment.
 * It is never logged, and neither is any hash.
 */

/** OpenAI rejects an event older than seven days. */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
/** Names this integration to OpenAI. */
const INTEGRATION_SOURCE = "kheelona-store";

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

/** OpenAI's two references, as kept in the order's `fb_attrib` JSONB (no new column, no migration: the
 *  `oai_` prefix keeps them apart from Meta's four keys, and Meta's reader picks only its own). */
export type OpenAiAttrib = { oai_oppref?: string; oai_obref?: string };

function cookieValue(cookieHeader: string, name: string): string | null {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null; // a malformed escape is refused, not repaired
  }
}

/** The OpenAI references on the request that creates an order: our `kh_oppref` (carried across hosts), else
 *  OpenAI's own `__oppref`, and its `__obref`. Same posture as `readFbAttrib`: read entirely from the request
 *  the browser already sent, validated, and null when there is nothing worth storing. */
export function readOpenAiAttrib(request: Request): OpenAiAttrib | null {
  const cookie = request.headers.get("cookie") ?? "";
  const oppref =
    validOppref(cookieValue(cookie, OPENAI_OPPREF_COOKIE)) ??
    validOppref(cookieValue(cookie, OPENAI_NATIVE_OPPREF_COOKIE));
  const obref = validObref(cookieValue(cookie, OPENAI_OBREF_COOKIE));
  const attrib: OpenAiAttrib = {};
  if (oppref) attrib.oai_oppref = oppref;
  if (obref) attrib.oai_obref = obref;
  return Object.keys(attrib).length ? attrib : null;
}

/** The value for the order's `fb_attrib` column: Meta's attribution with the OpenAI references merged in.
 *  Null only when both are empty, as the column was before. */
export function withOpenAiAttrib(
  fbAttrib: Record<string, string> | null,
  request: Request,
): Record<string, string> | null {
  const openAi = readOpenAiAttrib(request);
  if (!openAi) return fbAttrib;
  return { ...(fbAttrib ?? {}), ...openAi };
}

/** What a stored `fb_attrib` holds that this module reads, narrowed from whatever the column contains. */
function readStored(value: unknown): { oppref?: string; obref?: string; ip?: string; ua?: string } {
  if (!value || typeof value !== "object") return {};
  const v = value as Record<string, unknown>;
  const text = (key: string) => (typeof v[key] === "string" && v[key] ? (v[key] as string) : undefined);
  return {
    oppref: validOppref(text("oai_oppref")) ?? undefined,
    obref: validObref(text("oai_obref")) ?? undefined,
    ip: text("ip"),
    ua: text("ua"),
  };
}

export type OpenAiCapiEvent = {
  id: string;
  type: "order_created";
  timestamp_ms: number;
  source_url: string;
  action_source: "web";
  oppref?: string;
  user?: {
    emails_sha256?: string[];
    phone_numbers_sha256?: string[];
    obref?: string;
    ip_address?: string;
    user_agent?: string;
  };
  data: ReturnType<typeof openAiOrderData>;
};

export type OpenAiCapiBody = { integration_source: string; events: [OpenAiCapiEvent] };

/** The request body for a paid order. Pure, and exported so the wire format is asserted without a network
 *  call and without a key. Empty optional fields are omitted, never sent as `""` or `[]`. */
export function openAiCapiPayload(order: PreorderRow, now: number = Date.now()): OpenAiCapiBody {
  const stored = readStored((order as PreorderRow & { fb_attrib?: unknown }).fb_attrib);

  const user: NonNullable<OpenAiCapiEvent["user"]> = {};
  /* Email: trimmed and lowercased, then SHA-256 (OpenAI's documented normalisation). */
  const email = order.email?.trim().toLowerCase();
  if (email) user.emails_sha256 = [sha256(email)];
  /* Phone: digits only, country code kept, no plus, 8 to 15 digits; anything else is not a phone number. */
  const digits = order.phone?.replace(/\D/g, "") ?? "";
  if (digits.length >= 8 && digits.length <= 15) user.phone_numbers_sha256 = [sha256(digits)];
  if (stored.obref) user.obref = stored.obref;
  if (stored.ip) user.ip_address = stored.ip;
  if (stored.ua) user.user_agent = stored.ua;

  const paidAt = order.paid_at ? Date.parse(order.paid_at) : NaN;

  const event: OpenAiCapiEvent = {
    /* The order reference, raw: the browser's `order_created` carries it as its `event_id`. */
    id: order.order_ref,
    type: "order_created",
    timestamp_ms: Number.isFinite(paidAt) ? paidAt : now,
    source_url: STORE_URL,
    action_source: "web",
    /* Passed through unmodified, as OpenAI asks. */
    ...(stored.oppref ? { oppref: stored.oppref } : {}),
    ...(Object.keys(user).length ? { user } : {}),
    data: openAiOrderData(order.amount_paise, order.tier),
  };

  return { integration_source: INTEGRATION_SOURCE, events: [event] };
}

export type OpenAiReport = "sent" | "skipped" | "failed";

/** Report one paid order to OpenAI. Never throws; returns what happened.
 *
 *  Every outcome logs one line, `[openai-capi] SENT|SKIPPED|REJECTED|FAILED <order ref>`, so "did it go, and if
 *  not why" is a log search, not a guess. The line carries the order reference and OpenAI's status and (on
 *  rejection) the first 400 characters of its answer, never the key and never a hash. */
export async function reportOrderToOpenAi(order: PreorderRow): Promise<OpenAiReport> {
  const ref = order.order_ref;
  const skip = (why: string): OpenAiReport => {
    console.info(`[openai-capi] SKIPPED ${ref}: ${why}`);
    return "skipped";
  };

  try {
    const key = process.env.OPENAI_ADS_CAPI_KEY?.trim();
    if (!key) return skip("OPENAI_ADS_CAPI_KEY is not configured");

    /* Production only. A preview or local build must never report into the live ad account, and the key
       lives in Vercel's production environment only, but the rule is stated here too. */
    if (SITE_ENV !== "production") return skip(`not a production build (${SITE_ENV})`);

    const stored = readStored((order as PreorderRow & { fb_attrib?: unknown }).fb_attrib);
    if (!stored.oppref && !stored.obref) return skip("the order carries no OpenAI click or browser reference");

    const paidAt = order.paid_at ? Date.parse(order.paid_at) : NaN;
    if (Number.isFinite(paidAt) && Date.now() - paidAt > MAX_AGE_MS) {
      return skip("paid more than 7 days ago, which OpenAI rejects");
    }

    const response = await fetch(OPENAI_CAPI_URL, {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify(openAiCapiPayload(order)),
      /* The payment path does not wait on an advertising API. */
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(`[openai-capi] REJECTED ${ref}: ${response.status} ${detail.slice(0, 400)}`);
      return "failed";
    }

    console.info(`[openai-capi] SENT ${ref}: ${response.status}`);
    return "sent";
  } catch (error) {
    console.error(`[openai-capi] FAILED ${ref}`, error);
    return "failed";
  }
}
