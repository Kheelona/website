import { storeEnv } from "@/lib/store/env";
import { db } from "@/lib/store/db";
import { verifyAddressToken } from "@/lib/store/signing";
import { isOrderRef } from "@/lib/store/order-ref";
import { rateLimit, clientKey } from "@/lib/store/rate-limit";
import { json, str, NOT_CONFIGURED } from "@/lib/store/http";
import { validateAddress, hasErrors } from "@/features/preorder/lib/validate";

/** Attach or change a delivery address (§8.25-n).
 *
 *  Reached twice: straight after payment, and from the link in the
 *  acknowledgement email weeks later. Both are the same operation, which is why
 *  there is one route rather than a "confirm" and an "edit".
 *
 *  AUTHORISATION IS THE SIGNED TOKEN, and nothing else. There are no accounts
 *  here, so the token is what proves the person editing this order is the person
 *  who paid for it. It is bound to one order reference and it expires, so a
 *  forwarded email cannot be used to point somebody else's Kheelu at a new house
 *  forever. An address is a family's home: this is the one route where getting
 *  authorisation slightly wrong is a safety problem, not a billing one. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const env = storeEnv();
  if (!env) return json(503, NOT_CONFIGURED);

  const limit = rateLimit(`address:${clientKey(request)}`);
  if (!limit.allowed) {
    return json(429, { error: "too-many", message: "Give it a minute and try again." });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return json(400, { error: "bad-request", message: "We could not read that." });

  const orderRef = str(body.orderRef, 20);
  const token = str(body.token, 80);

  if (!isOrderRef(orderRef) || !verifyAddressToken(env.signingSecret, orderRef, token)) {
    /* One message for "wrong order", "bad signature" and "expired", on purpose:
       a caller poking at this must not learn which order references exist. */
    return json(403, {
      error: "forbidden",
      message:
        "This link cannot be used any more. Message us on WhatsApp and we will add your address for you.",
    });
  }

  const address = {
    line1: str(body.line1, 120).trim(),
    line2: str(body.line2, 120).trim(),
    city: str(body.city, 60).trim(),
    state: str(body.state, 60).trim(),
    pincode: str(body.pincode, 10).trim(),
  };

  const errors = validateAddress(address);
  if (hasErrors(errors)) return json(422, { error: "invalid", errors });

  /* Allowed while 'created' as well as 'paid': a parent can reach /thanks
     before the webhook has landed, and making them wait for a queue they cannot
     see would be a strange thing to do to someone who has just paid us. */
  const { data, error } = await db(env)
    .from("preorders")
    .update({ address })
    .eq("order_ref", orderRef)
    .in("status", ["created", "paid"])
    .select("order_ref")
    .maybeSingle();

  if (error) {
    console.error("[address] update failed", error);
    return json(500, {
      error: "server",
      message: "Something broke on our side. Message us on WhatsApp and we will sort it out.",
    });
  }

  if (!data) {
    return json(409, {
      error: "not-editable",
      message:
        "This order cannot be changed here any more. Message us on WhatsApp and we will help.",
    });
  }

  return json(200, { ok: true });
}
