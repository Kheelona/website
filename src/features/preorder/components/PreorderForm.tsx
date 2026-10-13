"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { Alert } from "@/components/ui/Alert/Alert";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";
import { Field } from "@/components/ui/Field/Field";
import { checkoutPrices, checkoutWords } from "@/components/sections/store/StoreDetails/checkout-words";
import type { PreorderFormCopy } from "@/components/sections/store/StoreDetails/store-details.types";
import { BALANCE_PRICE } from "@/config/site";
import { MARKETING_ORIGIN } from "@/config/env";
import { preorderFormCopy } from "@/content/en-IN/store/preorder-form";
import {
  validateContact,
  hasErrors,
  CHILD_AGE_MAX,
  type ContactInput,
  type FieldErrors,
} from "../lib/validate";
import { startCheckout } from "../lib/checkout";
import { preorderAnalytics } from "../lib/analytics";
import { phDistinctId } from "@/lib/posthog";
import { CAMPAIGN_KEYS } from "@/lib/campaign";

/** The pre-order form (§8.25-s).
 *
 *  Four fields and one tick, which is the whole of it. The founder's call, and
 *  the right one: every extra field costs completions, and the two things we
 *  might have asked (the child's name, the home language) are things we can ask
 *  later on WhatsApp, when a parent is already a customer rather than a visitor.
 *
 *  The address comes AFTER payment, on the confirmation step. That order is
 *  deliberate: a parent typing a house number has not yet decided anything, and
 *  a parent who abandons here still leaves us a name, a number and an email, so
 *  an abandoned payment is a lead rather than nothing.
 *
 *  Validation runs here for kindness and on the server for truth, using the SAME
 *  functions (../lib/validate). Never the amount: this component never sends a
 *  price, it sends a tier, and the server decides what that costs.
 *
 *  RESTYLED ON THE DESIGN SYSTEM (task 5.15; ADR-013: markup, classes, copy and
 *  presentation imports only). The fields are the DS Field and Checkbox, the
 *  failure line a DS danger Alert above the pay button, the pay button the DS
 *  chilli button (its labels unchanged, still a plain <button> with no cta
 *  attribute). The words come from content (content/en-IN/store/preorder-form.ts),
 *  their amounts from the labels the server formatted for this tier. Beside the
 *  button, in the form's own block, the price sentence carries the refund promise;
 *  the store page hands in the rest (`beside`: the trust row, the payment window
 *  line, a person to reach), which a client island cannot draw itself. Every
 *  handler, field attribute and request below is the tag's
 *  (test/guards/checkout-signature.test.ts, checkout-jsx-contract.test.tsx). */
export function PreorderForm({
  tier,
  signature,
  amountLabel,
  mode = "token",
  balanceLabel = BALANCE_PRICE,
  copy = preorderFormCopy,
  beside,
}: {
  tier: string;
  signature?: string;
  /** What the parent is about to pay, already formatted by the server. */
  amountLabel: string;
  /** Display only, decided by the server with the tier (§8.26): "token" keeps
   *  the token-and-balance caption, "full" says the payment is the whole
   *  price. No amount crosses the client boundary because of this prop — it
   *  changes sentences, never numbers. Event pages always pass "token": an
   *  event token is a token, whatever the public mode is. */
  mode?: "token" | "full";
  /** The balance the caption states, formatted by the server. Defaults to the
   *  public ₹4,500; event pages pass ₹4,999 minus the token actually paid, so
   *  a ₹99 booking honestly reads ₹4,900 (2026-08-23). A label, not a charge:
   *  the server still prices the order from the tier alone. */
  balanceLabel?: string;
  /** The form's words: the store's by default (store.md fold 3). Presentation
   *  only: labels, hints, the consent row's words and the price sentence. */
  copy?: PreorderFormCopy;
  /** Server-rendered lines after the price sentence, inside the form's block:
   *  the store's trust row, payment window line and help line (PayBeside). */
  beside?: ReactNode;
}) {
  const [errors, setErrors] = useState<FieldErrors<ContactInput>>({});
  const [state, setState] = useState<"idle" | "working" | "paying">("idle");
  const [failure, setFailure] = useState<string | null>(null);

  /* Fired once per mount, on the first change to any field (§8.40). A ref
     rather than state on purpose: this must not re-render the form a parent is
     typing into, and it must survive StrictMode's double-invoke in development
     the same way ViewContentTracker's does.

     `onChange` on the <form>, not a handler per field: change events bubble, so
     one listener covers every field there is now and every field anyone adds
     later. A per-field list would be right today and wrong at the next edit. */
  const started = useRef(false);
  function onFirstChange() {
    if (started.current) return;
    started.current = true;
    preorderAnalytics.formStarted(tier);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFailure(null);

    const form = new FormData(event.currentTarget);
    const contact: ContactInput = {
      parentName: String(form.get("parentName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      childAge: String(form.get("childAge") ?? ""),
      accepted: form.get("accepted") === "on",
    };

    const found = validateContact(contact);
    setErrors(found);
    if (hasErrors(found)) {
      /* Move the reader to the first problem. Without this, an error above the
         fold on a phone is an invisible error, and the parent taps the button
         again wondering why nothing happens. */
      document.querySelector("[aria-invalid='true']")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setState("working");
    preorderAnalytics.start(tier);

    try {
      const response = await fetch("/api/preorder/create-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...contact,
          tier,
          signature,
          utm: readUtm(),
          /* So the SERVER-sent purchase_confirmed event can join this person's
             funnel (§8.40). The webhook knows a payment is real but has no idea
             whose browser it came from, and this is the last moment anyone
             does. Null when PostHog is absent, which the server accepts. */
          phDistinctId: phDistinctId(),
        }),
      });
      const data = (await response.json()) as CreateOrderResponse;

      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        setFailure(data.message ?? "We could not start that. Please try again.");
        setState("idle");
        return;
      }

      setState("paying");
      preorderAnalytics.beginCheckout(data.amountPaise!, tier);

      const opened = await startCheckout({
        keyId: data.keyId!,
        razorpayOrderId: data.razorpayOrderId!,
        amountPaise: data.amountPaise!,
        orderRef: data.orderRef!,
        prefill: data.prefill ?? {},
        onDismiss: () => {
          preorderAnalytics.dismissed(tier);
          setState("idle");
          setFailure(
            "You closed the payment window, and nothing was charged. Your details are still here when you want to finish.",
          );
        },
        onPaid: (paid) => {
          preorderAnalytics.purchase(data.orderRef!, data.amountPaise!, tier);
          /* Confirm in the background and move on. The parent should not wait on
             our bookkeeping, and the webhook covers us if this request never
             lands. */
          void fetch("/api/preorder/confirm", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: paid.razorpay_order_id,
              razorpayPaymentId: paid.razorpay_payment_id,
              razorpaySignature: paid.razorpay_signature,
            }),
          });
          window.location.assign(
            `/thanks?ref=${encodeURIComponent(data.orderRef!)}&t=${encodeURIComponent(
              data.addressToken!,
            )}`,
          );
        },
      });

      if (!opened) {
        setState("idle");
        setFailure(
          "The payment window would not open, which usually means a blocked script or a shaky connection. Nothing was charged. Try again, or message us on WhatsApp and we will take it from there.",
        );
      }
    } catch {
      setState("idle");
      setFailure(
        "We could not reach our payment provider. Nothing was charged. Please try again in a moment.",
      );
    }
  }

  const busy = state !== "idle";

  return (
    <form onSubmit={onSubmit} onChange={onFirstChange} noValidate className="ks-form">
      <Field
        label={copy.labels.parentName}
        name="parentName"
        type="text"
        required
        autoComplete="name"
        maxLength={80}
        error={errors.parentName}
      />
      {/* The +91 is decoration (the tel-in variant): the value is what the parent
          types, and the shared validator still accepts +91, 0 and spaces. */}
      <Field
        label={copy.labels.phone}
        variant="tel-in"
        name="phone"
        type="tel"
        inputMode="tel"
        required
        autoComplete="tel"
        hint={copy.hints.phone[mode]}
        error={errors.phone}
      />
      <Field
        label={copy.labels.email}
        name="email"
        type="email"
        inputMode="email"
        required
        autoComplete="email"
        hint={copy.hints.email}
        error={errors.email}
      />
      {/* A blank, not a picker, since 2026-08-23 (founder call). */}
      <Field
        label={copy.labels.childAge}
        name="childAge"
        type="text"
        required
        maxLength={CHILD_AGE_MAX}
        hint={copy.hints.childAge}
        error={errors.childAge}
      />

      <Checkbox
        consent
        name="accepted"
        error={errors.accepted}
        label={
          <>
            {copy.consent.lead}{" "}
            <PolicyLink href="/terms" note={copy.newTabNote}>
              {copy.consent.terms}
            </PolicyLink>{" "}
            {copy.consent.join}{" "}
            <PolicyLink href="/refund" note={copy.newTabNote}>
              {copy.consent.refund}
            </PolicyLink>
            {copy.consent.tail}
          </>
        }
      />

      {failure ? (
        /* A DS danger Alert (role=alert) so it is announced, and not only for a
           screen reader: a parent whose payment sheet vanished needs to be told
           nothing was charged, in those words. */
        <Alert tone="danger">
          <p>{failure}</p>
        </Alert>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className={clsx("kh-btn kh-btn--cta kh-btn--l kh-btn--block", busy && "kh-btn--loading")}
      >
        <span>
          {state === "idle"
            ? `Pay ${amountLabel} and ${mode === "token" ? "reserve" : "pre-order"}`
            : null}
          {state === "working" ? "Setting up your payment…" : null}
          {state === "paying" ? "Opening the payment window…" : null}
        </span>
      </button>

      <div className="ks-beside ks-pay-beside">
        <p className="kh-body-s ks-price">
          {checkoutWords(copy.price[mode], checkoutPrices(mode, amountLabel, balanceLabel))}
        </p>
        {beside}
      </div>
    </form>
  );
}

function PolicyLink({ href, note, children }: { href: string; note: string; children: React.ReactNode }) {
  /* Absolute to the marketing site on purpose: the policies are canonical there
     (founder's call), the store must not host a second copy competing with them
     in search, and a new tab keeps a half-filled form intact. MARKETING_ORIGIN is
     kheelona.com on production and the beta site on beta, as for the store
     footer's policy links (task 3.1). */
  return (
    <Link
      href={`${MARKETING_ORIGIN}${href}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span className="kh-sr">{note}</span>
    </Link>
  );
}

type CreateOrderResponse = {
  orderRef?: string;
  razorpayOrderId?: string;
  keyId?: string;
  amountPaise?: number;
  addressToken?: string;
  prefill?: { name?: string; email?: string; contact?: string | null };
  message?: string;
  errors?: FieldErrors<ContactInput>;
};

/** The campaign carried by the store URL, which on most real journeys is
 *  nothing at all.
 *
 *  🔴 THE CROSS-HOST CASE IS HANDLED ON THE SERVER, NOT HERE (§8.40-f). Ads tag
 *  `kheelona.com` and the CTA that crosses to `store.kheelona.com` carries no
 *  query string, so this function finds a campaign only when an ad pointed
 *  straight at the store host. `create-order` PREFERS the `kh_utm` cookie that
 *  `src/proxy.ts` set on the tagged landing, and falls back to what this sends.
 *
 *  A first version of the fix read the campaign back out of PostHog's session
 *  here instead. It did not work and was removed rather than left looking as if
 *  it did: PostHog keeps the entry URL in `$client_session_props` and derives
 *  `utm_*` from it only when building event properties, while
 *  `getSessionProperty()` reads a bucket that never holds campaign data. The
 *  tests passed because they mocked that getter (§8.38-i). */
function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const key of CAMPAIGN_KEYS) {
    const value = params.get(key);
    if (value) out[key] = value;
  }
  return out;
}
