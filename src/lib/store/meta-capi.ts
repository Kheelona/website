import { createHash } from "node:crypto";
import type { StoreEnv } from "./env";
import type { PreorderRow } from "./db";
import { clientKey } from "./rate-limit";
import { purchaseEventId } from "@/lib/fbq";
import { META_PIXEL_ID, STORE_URL } from "@/config/site";

/** The Meta Conversions API: Purchase, sent from our server (§8.30-l).
 *
 *  WHY. Ad blockers, Safari's ITP and iOS App Tracking Transparency drop a large
 *  share of browser-fired events, and Purchase is the one that matters, because
 *  it is what ad delivery optimises against. A conversion Meta never sees is a
 *  conversion it cannot learn from. The browser keeps firing too; Meta collapses
 *  the pair into one.
 *
 *  DE-DUPLICATION is the whole trick, and it is why this can be added safely at
 *  all. Meta merges a browser event and a server event when `event_name` and
 *  `event_id` match within 48 hours. Both sides call `purchaseEventId(orderRef)`
 *  and neither has to tell the other anything: no shared state, no handoff, no
 *  ordering requirement. If the browser event is blocked, the server event
 *  stands alone and the conversion is still counted once.
 *
 *  THERE IS NO PUBLIC ENDPOINT, deliberately, and this is the main departure
 *  from the guide this work came from. That guide proposed an
 *  `/api/capi` route accepting an event and forwarding it to Meta — which is an
 *  unauthenticated way for anyone on the internet to write fake purchases into
 *  the ad account, and it would have had the browser POST the customer's email
 *  and phone to us in the clear to be hashed. Sending from the webhook's own
 *  fulfilment path instead means the only thing that can report a purchase is a
 *  purchase Razorpay confirmed, and the PII never moves: it is already in our
 *  database, and only its SHA-256 leaves.
 *
 *  IT MUST NEVER THROW. It is called from `notifyPaid`, after the money has
 *  moved and the row says so. An exception there would fail a webhook Razorpay
 *  would then retry, for a payment recorded perfectly. Same rule as the emails
 *  beside it: a failure here is logged and forgotten. */

/** Graph API version. Pinned, not floating: Meta deprecates versions on a
 *  schedule, and a silent change of wire format on the payment path is not
 *  something to discover from a drop in reported conversions. */
const GRAPH_VERSION = "v21.0";

/** Meta wants user data SHA-256 hashed, lowercased and trimmed first. Raw
 *  values never leave this process. */
function hashed(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const normalised = value.trim().toLowerCase();
  if (!normalised) return undefined;
  return createHash("sha256").update(normalised).digest("hex");
}

/** Phone as digits only, including country code and WITHOUT a leading plus,
 *  which is the shape Meta documents. Our rows are stored normalised as
 *  `+9198…`, so this is mostly stripping that plus. */
function hashedPhone(phone: string | null | undefined): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  return digits ? createHash("sha256").update(digits).digest("hex") : undefined;
}

/** What we keep from the browser at order time so the server event can be
 *  matched to a person later. Deliberately a closed set. */
export type FbAttrib = {
  /** The pixel's own first-party cookie. The single strongest match signal. */
  fbp?: string;
  /** Set only when the visitor arrived from an ad click (an `fbclid` in the
   *  URL). Usually absent, and that is normal. */
  fbc?: string;
  ip?: string;
  ua?: string;
};

/** Read the attribution signals from the request that is creating an order.
 *
 *  ALL SERVER-SIDE, and that is the point. `_fbp` and `_fbc` are ordinary
 *  first-party cookies on the store host, and `/api/preorder/create-order` is a
 *  same-host POST, so the browser sends them with the request already. Nothing
 *  has to be added to the client, nothing crosses the wire that was not crossing
 *  it anyway, and there is no value here the client could lie about that it
 *  could not already lie about.
 *
 *  The IP comes from `clientKey`, which is the extraction hardened in F-14: it
 *  prefers `x-real-ip`, which Vercel sets to the true client address, and never
 *  trusts the caller-suppliable first hop of `x-forwarded-for`.
 *
 *  Returns null when there is nothing worth storing, so the column stays NULL
 *  rather than filling with empty objects. */
export function readFbAttrib(request: Request): FbAttrib | null {
  const cookie = request.headers.get("cookie") ?? "";
  const read = (name: string): string | undefined => {
    const match = cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
    /* Capped: this is a cookie a browser hands us, and it is going into our
       database and then into a request body. */
    return match ? decodeURIComponent(match[1]).slice(0, 256) : undefined;
  };

  const ip = clientKey(request);
  const attrib: FbAttrib = {
    fbp: read("_fbp"),
    fbc: read("_fbc"),
    ip: ip === "unknown" ? undefined : ip,
    ua: request.headers.get("user-agent")?.slice(0, 400) ?? undefined,
  };

  const kept = Object.fromEntries(
    Object.entries(attrib).filter(([, v]) => Boolean(v)),
  ) as FbAttrib;
  return Object.keys(kept).length ? kept : null;
}

/** Narrow an unknown JSONB value back to FbAttrib, because what comes out of a
 *  database column is whatever was put in it, possibly by an older version of
 *  this code. */
function asFbAttrib(value: unknown): FbAttrib {
  if (!value || typeof value !== "object") return {};
  const v = value as Record<string, unknown>;
  const pick = (k: string) => (typeof v[k] === "string" ? (v[k] as string) : undefined);
  return { fbp: pick("fbp"), fbc: pick("fbc"), ip: pick("ip"), ua: pick("ua") };
}

type Payload = {
  data: [Record<string, unknown>];
  access_token: string;
  test_event_code?: string;
};

/** Build the request body. Exported for tests, so the wire format can be
 *  asserted without a network call and without a token. */
export function purchasePayload(
  order: PreorderRow,
  token: string,
  testCode?: string,
): Payload {
  const attrib = asFbAttrib((order as PreorderRow & { fb_attrib?: unknown }).fb_attrib);

  const user_data: Record<string, string> = {};
  const em = hashed(order.email);
  const ph = hashedPhone(order.phone);
  /* Meta takes a hashed first name as `fn`. The parent's name is one field, so
     the first token is the closest honest answer; a full name in `fn` matches
     worse than nothing. */
  const fn = hashed(order.parent_name?.trim().split(/\s+/)[0]);
  if (em) user_data.em = em;
  if (ph) user_data.ph = ph;
  if (fn) user_data.fn = fn;
  if (attrib.fbp) user_data.fbp = attrib.fbp;
  if (attrib.fbc) user_data.fbc = attrib.fbc;
  if (attrib.ip) user_data.client_ip_address = attrib.ip;
  if (attrib.ua) user_data.client_user_agent = attrib.ua;

  const payload: Payload = {
    data: [
      {
        event_name: "Purchase",
        /* Seconds, and the moment the money actually moved where we know it.
           Meta rejects events more than 7 days old. */
        event_time: Math.floor(
          (order.paid_at ? new Date(order.paid_at).getTime() : Date.now()) / 1000,
        ),
        event_id: purchaseEventId(order.order_ref),
        action_source: "website",
        event_source_url: STORE_URL,
        user_data,
        custom_data: {
          currency: "INR",
          /* The amount actually collected, matching the browser event exactly
             (§8.30-f). If these two disagreed, Meta would have two different
             values for one conversion. */
          value: order.amount_paise / 100,
          order_id: order.order_ref,
          content_category: order.tier,
        },
      },
    ],
    access_token: token,
  };

  if (testCode) payload.test_event_code = testCode;
  return payload;
}

/** Send the Purchase. Never throws; returns whether Meta accepted it.
 *
 *  Skipped entirely when no token is configured, which is the same "readiness,
 *  not crashing" rule the rest of the store follows: the store must work before
 *  the founder has pasted every dashboard value in. */
export async function reportPurchaseToMeta(
  env: StoreEnv,
  order: PreorderRow,
): Promise<"sent" | "skipped" | "failed"> {
  if (!env.metaCapiToken) return "skipped";

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${META_PIXEL_ID}/events`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(
          purchasePayload(order, env.metaCapiToken, env.metaCapiTestCode ?? undefined),
        ),
        /* The payment path does not wait on an advertising API. */
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!response.ok) {
      /* The body names the field Meta disliked, which is the only useful part.
         The token is in the REQUEST, never the response, so this is safe to log
         — but the order reference is all we add of our own. */
      const detail = await response.text().catch(() => "");
      console.error(
        `[meta-capi] Purchase rejected for ${order.order_ref}: ${response.status} ${detail.slice(0, 400)}`,
      );
      return "failed";
    }

    return "sent";
  } catch (error) {
    console.error(`[meta-capi] Purchase failed to send for ${order.order_ref}`, error);
    return "failed";
  }
}
