import { storeEnv } from "@/lib/store/env";
import { db } from "@/lib/store/db";
import { resolveTier, tierRefusalMessage } from "@/lib/store/tiers";
import { createRazorpayOrder } from "@/lib/store/razorpay";
import { newOrderRef } from "@/lib/store/order-ref";
import { signAddressToken, ADDRESS_TOKEN_TTL_MS } from "@/lib/store/signing";
import { rateLimit, clientKey } from "@/lib/store/rate-limit";
import { json, str, NOT_CONFIGURED } from "@/lib/store/http";
import {
  validateContact,
  normalisePhone,
  hasErrors,
  CHILD_AGE_MAX,
} from "@/features/preorder/lib/validate";

/** Start a pre-order (§8.25-l).
 *
 *  THE ONE RULE: the amount is decided here, from our own tier table. The client
 *  says which tier it wants and never how much that costs. Every other mistake
 *  in this file can be corrected afterwards; a client-supplied price cannot be
 *  un-charged.
 *
 *  Order of operations, which matters more than it looks:
 *    1. resolve the tier (server-side price, cap and expiry checked)
 *    2. validate the parent's details
 *    3. insert OUR row first, status 'created'
 *    4. then create the gateway order and attach its id
 *
 *  Our row first, deliberately. If step 4 fails we hold a lead we can follow up;
 *  if it were the other way round we would hold a Razorpay order that could be
 *  paid with no local record of who paid it, which is the one failure here with
 *  no clean recovery. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const env = storeEnv();
  if (!env) return json(503, NOT_CONFIGURED);

  const limit = rateLimit(`create-order:${clientKey(request)}`);
  if (!limit.allowed) {
    return json(
      429,
      { error: "too-many", message: "That was a lot of tries. Give it a minute and start again." },
      { "retry-after": String(limit.retryAfterSeconds) },
    );
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return json(400, { error: "bad-request", message: "We could not read that." });

  const tierResult = await resolveTier(env, {
    tier: str(body.tier, 64) || null,
    signature: str(body.signature, 64) || null,
  });
  if (!tierResult.ok) {
    return json(409, {
      error: tierResult.reason,
      message: tierRefusalMessage(tierResult.reason),
    });
  }

  const contact = {
    parentName: str(body.parentName, 80).trim(),
    phone: str(body.phone, 20),
    email: str(body.email, 160).trim().toLowerCase(),
    childAge: str(body.childAge, CHILD_AGE_MAX),
    accepted: body.accepted === true,
  };
  const errors = validateContact(contact);
  if (hasErrors(errors)) return json(422, { error: "invalid", errors });

  const client = db(env);
  const orderRef = newOrderRef();

  const { data: row, error: insertError } = await client
    .from("preorders")
    .insert({
      order_ref: orderRef,
      tier: tierResult.tier.id,
      amount_paise: tierResult.tier.amountPaise,
      parent_name: contact.parentName,
      // stored normalised: one shape in the table means one shape in a WhatsApp
      // export, and a support search that actually finds people
      phone: normalisePhone(contact.phone)!,
      email: contact.email,
      child_age: contact.childAge,
      /* The single tick covers the terms, the refund policy and order updates on
         WhatsApp. Recording it as a fact WITH A TIME is the difference between
         "they agreed" and "they agreed, on this date, to this version". */
      wa_consent: true,
      terms_accepted_at: new Date().toISOString(),
      utm: readUtm(body.utm),
    })
    .select("id, order_ref")
    .single();

  if (insertError || !row) {
    console.error("[create-order] insert failed", insertError);
    return json(500, {
      error: "server",
      message: "Something broke on our side, and it is not your fault. Try again in a moment.",
    });
  }

  try {
    const rzpOrder = await createRazorpayOrder(env, {
      amountPaise: tierResult.tier.amountPaise,
      orderRef,
      notes: { tier: tierResult.tier.id },
    });

    await client
      .from("preorders")
      .update({ rzp_order_id: rzpOrder.id })
      .eq("order_ref", orderRef);

    return json(200, {
      orderRef,
      razorpayOrderId: rzpOrder.id,
      keyId: env.razorpayKeyId,
      amountPaise: tierResult.tier.amountPaise,
      tierLabel: tierResult.tier.label,
      /* Handed to the browser so it can reach its own confirmation page. The
         token is bound to this order reference and expires, so giving it to the
         person who just created the order gives away nothing: it is the same
         token that will arrive in their email. */
      addressToken: signAddressToken(
        env.signingSecret,
        orderRef,
        Date.now() + ADDRESS_TOKEN_TTL_MS,
      ),
      prefill: {
        name: contact.parentName,
        email: contact.email,
        contact: normalisePhone(contact.phone),
      },
    });
  } catch (error) {
    /* The row stays 'created'. That is not a wasted write: it is a parent who
       tried to pay us, with a working phone number and email, which is exactly
       who to follow up. */
    console.error("[create-order] razorpay failed", error);
    return json(502, {
      error: "gateway",
      message:
        "Our payment provider did not answer. Nothing has been charged. Please try again in a minute.",
    });
  }
}

/** UTM parameters, captured silently rather than asked for. Only the five
 *  standard keys, only short values: this is a marketing breadcrumb, not a
 *  place for a client to store whatever it likes in our database. */
function readUtm(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const v = source[key];
    if (typeof v === "string" && v.trim()) out[key] = v.trim().slice(0, 120);
  }
  return Object.keys(out).length ? out : null;
}
