"use client";

import { useState } from "react";
import Link from "next/link";
import { TextField, ChoiceField } from "@/components/atoms/Field";
import { cn } from "@/lib/cn";
import { PRESS_LIFT } from "@/lib/interactions";
import {
  TOKEN_PRICE,
  BALANCE_PRICE,
  LAUNCH_PRICE,
  LUMI_AGES,
  SUPPORT_WHATSAPP_HREF,
} from "@/config/site";
import {
  validateContact,
  hasErrors,
  CHILD_AGE_MAX,
  type ContactInput,
  type FieldErrors,
} from "../lib/validate";
import { startCheckout } from "../lib/checkout";
import { preorderAnalytics } from "../lib/analytics";

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
 *  price, it sends a tier, and the server decides what that costs. */
export function PreorderForm({
  tier,
  signature,
  amountLabel,
  mode = "token",
  balanceLabel = BALANCE_PRICE,
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
}) {
  const [errors, setErrors] = useState<FieldErrors<ContactInput>>({});
  const [state, setState] = useState<"idle" | "working" | "paying">("idle");
  const [failure, setFailure] = useState<string | null>(null);

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
        body: JSON.stringify({ ...contact, tier, signature, utm: readUtm() }),
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
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <TextField
        label="Your name"
        name="parentName"
        required
        autoComplete="name"
        maxLength={80}
        error={errors.parentName}
      />
      <TextField
        label="WhatsApp number"
        name="phone"
        type="tel"
        inputMode="tel"
        required
        autoComplete="tel"
        hint={
          mode === "token"
            ? "Where we send your confirmation, and the balance link before dispatch."
            : "Where we send your confirmation, and updates before dispatch."
        }
        error={errors.phone}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        inputMode="email"
        required
        autoComplete="email"
        error={errors.email}
      />
      {/* A blank, not a picker, since 2026-08-23 (founder call). Ages render
          from LUMI_AGES per standing law, never inline. */}
      <TextField
        label="Your child's age"
        name="childAge"
        required
        maxLength={CHILD_AGE_MAX}
        hint={`Lumi is built for ages ${LUMI_AGES}. A number is fine, and so is "nearly 3".`}
        error={errors.childAge}
      />

      <ChoiceField name="accepted" error={errors.accepted}>
        I accept the{" "}
        <PolicyLink href="/terms">pre-order terms</PolicyLink> and the{" "}
        <PolicyLink href="/refund">refund policy</PolicyLink>, and I am happy to
        hear about my own order on WhatsApp.
      </ChoiceField>

      {failure ? (
        /* role=alert so it is announced, and not only for a screen reader: a
           parent whose payment sheet vanished needs to be told nothing was
           charged, in those words. */
        <p
          role="alert"
          className="rounded-(--radius-card) border border-orange-ink bg-cream px-4 py-3 text-[15px] font-medium text-ink"
        >
          {failure}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-action px-7 py-4 text-[17px] font-bold text-ink-head shadow-cta",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
          PRESS_LIFT,
          busy && "cursor-wait opacity-70",
        )}
      >
        {state === "idle"
          ? `Pay ${amountLabel} and ${mode === "token" ? "reserve" : "pre-order"}`
          : null}
        {state === "working" ? "Setting up your payment…" : null}
        {state === "paying" ? "Opening the payment window…" : null}
      </button>

      <p className="text-[14px] leading-[1.55] text-ink-muted">
        {mode === "token" ? (
          <>
            {amountLabel} today, {balanceLabel} when your Lumi is ready to
            ship, for the {LAUNCH_PRICE} price. Refundable in full until we
            dispatch it. We never see your card details, and nothing is ever
            charged automatically.
          </>
        ) : (
          <>
            {amountLabel} today, and nothing more to pay before dispatch.
            Refundable in full until we dispatch it. We never see your card
            details, and nothing is ever charged automatically.
          </>
        )}
      </p>
      <p className="text-[14px] text-ink-muted">
        Rather do this over a message?{" "}
        <a
          href={SUPPORT_WHATSAPP_HREF}
          className="rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        >
          WhatsApp us
        </a>{" "}
        and a person will help.
      </p>
    </form>
  );
}

function PolicyLink({ href, children }: { href: string; children: React.ReactNode }) {
  /* Absolute to the marketing site on purpose: the policies are canonical there
     (founder's call), the store must not host a second copy competing with them
     in search, and a new tab keeps a half-filled form intact. */
  return (
    <Link
      href={`https://kheelona.com${href}`}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
    >
      {children}
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

/** UTMs from the URL, passed through so attribution survives the redirect to
 *  the payment sheet and back. Not a field, not a question, not a cookie. */
function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const value = params.get(key);
    if (value) out[key] = value;
  }
  return out;
}
