"use client";

import { useState } from "react";
import { TextField, SelectField } from "@/components/atoms/Field";
import { cn } from "@/lib/cn";
import { PRESS_LIFT } from "@/lib/interactions";
import { SUPPORT_WHATSAPP_HREF } from "@/config/site";
import { INDIAN_STATES } from "../lib/india";
import {
  validateAddress,
  hasErrors,
  type AddressInput,
  type FieldErrors,
} from "../lib/validate";
import { preorderAnalytics } from "../lib/analytics";

/** Where the Kheelu goes (§8.25-t).
 *
 *  Shown after payment, and reachable weeks later from the link in the
 *  acknowledgement email, which is the same component either way. The parent has
 *  already paid by the time they see this, so the tone is different from the
 *  form before it: nothing here is a gate, and saying so out loud is what stops
 *  someone abandoning a house number and then worrying about their money.
 *
 *  State is a select, not a text field: a courier reads this value, and
 *  "Karnatka" costs a phone call later. */
export function AddressForm({
  orderRef,
  token,
  existing,
}: {
  orderRef: string;
  token: string;
  existing?: AddressInput | null;
}) {
  const [errors, setErrors] = useState<FieldErrors<AddressInput>>({});
  const [state, setState] = useState<"idle" | "saving" | "saved">(existing ? "saved" : "idle");
  const [failure, setFailure] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFailure(null);

    const form = new FormData(event.currentTarget);
    const address: AddressInput = {
      line1: String(form.get("line1") ?? ""),
      line2: String(form.get("line2") ?? ""),
      city: String(form.get("city") ?? ""),
      state: String(form.get("state") ?? ""),
      pincode: String(form.get("pincode") ?? ""),
    };

    const found = validateAddress(address);
    setErrors(found);
    if (hasErrors(found)) {
      document.querySelector("[aria-invalid='true']")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setState("saving");
    try {
      const response = await fetch("/api/preorder/address", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderRef, token, ...address }),
      });
      const data = (await response.json()) as { message?: string; errors?: FieldErrors<AddressInput> };

      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        setFailure(data.message ?? "We could not save that. Please try again.");
        setState("idle");
        return;
      }

      preorderAnalytics.addressSaved(orderRef);
      setState("saved");
    } catch {
      setState("idle");
      setFailure(
        "We could not reach our server. Your order is safe. Try again, or send us the address on WhatsApp.",
      );
    }
  }

  if (state === "saved") {
    return (
      <div className="rounded-(--radius-card) border border-line bg-white p-6">
        <p className="font-display text-[20px] font-extrabold text-ink-head">
          We have your address.
        </p>
        <p className="mt-2 max-w-[48ch] text-[16px] text-ink">
          That is everything we need. You can change it any time before dispatch:{" "}
          <a
            href={SUPPORT_WHATSAPP_HREF}
            className="rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
          >
            message us on WhatsApp
          </a>{" "}
          and we will update it.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-4 rounded text-[15px] font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        >
          Change it here instead
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <TextField
        label="Flat or house, and street"
        name="line1"
        required
        autoComplete="address-line1"
        defaultValue={existing?.line1}
        maxLength={120}
        error={errors.line1}
      />
      <TextField
        label="Landmark or area"
        name="line2"
        autoComplete="address-line2"
        defaultValue={existing?.line2}
        maxLength={120}
        error={errors.line2}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="PIN code"
          name="pincode"
          inputMode="numeric"
          required
          autoComplete="postal-code"
          defaultValue={existing?.pincode}
          maxLength={6}
          error={errors.pincode}
        />
        <TextField
          label="City or town"
          name="city"
          required
          autoComplete="address-level2"
          defaultValue={existing?.city}
          maxLength={60}
          error={errors.city}
        />
      </div>
      <SelectField
        label="State"
        name="state"
        required
        options={INDIAN_STATES}
        defaultValue={existing?.state}
        error={errors.state}
      />

      {failure ? (
        <p
          role="alert"
          className="rounded-(--radius-card) border border-orange-ink bg-cream px-4 py-3 text-[15px] font-medium text-ink"
        >
          {failure}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === "saving"}
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-action px-7 py-4 text-[17px] font-bold text-white shadow-cta",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
          PRESS_LIFT,
          state === "saving" && "cursor-wait opacity-70",
        )}
      >
        {state === "saving" ? "Saving…" : "Save my address"}
      </button>

      <p className="text-[14px] text-ink-muted">
        Your order is already safe. This can wait if you are in the middle of
        something, and the link in your email brings you straight back here.
      </p>
    </form>
  );
}
