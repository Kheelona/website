"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/Alert/Alert";
import { Card } from "@/components/ui/Card/Card";
import { Field } from "@/components/ui/Field/Field";
import { Select } from "@/components/ui/Select/Select";
import { SUPPORT_WHATSAPP_HREF } from "@/config/site";
import { addressForm as copy } from "@/content/en-IN/store/confirmation";
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
 *  "Karnatka" costs a phone call later.
 *
 *  RESTYLED IN TASK 5.16 (ADR-013: markup, classes, copy and presentation
 *  imports only; everything above the JSX is as it was at the freeze tag). The
 *  look is the approved /thanks fold 3 (mockup/pages/store-confirmation.html):
 *  the DS Field and Select (client-safe, so this island never ships the icon
 *  map), the PIN code and city side by side from 720 px (`ks-addr__pair`), and
 *  the DS PRIMARY button, not Chilli: saving an address is an everyday action
 *  ("Chilli means buying", DS Button README). A failure is a DS danger Alert;
 *  the saved state a DS card. The words come from content
 *  (src/content/en-IN/store/confirmation.ts `addressForm`); the handler's own
 *  failure lines stay where the frozen logic has them. Layout classes are
 *  styled by the AddressStep section around the form. */
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
      <Card
        as="div"
        className="ks-addr__saved"
        title={copy.saved.title}
        body={
          <>
            {copy.saved.before}
            <a href={SUPPORT_WHATSAPP_HREF}>{copy.saved.link}</a>
            {copy.saved.after}
          </>
        }
      >
        <button type="button" onClick={() => setState("idle")} className="kh-btn kh-btn--secondary">
          <span>{copy.saved.change}</span>
        </button>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="ks-form ks-addr">
      <Field
        label={copy.labels.line1}
        name="line1"
        required
        autoComplete="address-line1"
        defaultValue={existing?.line1}
        maxLength={120}
        error={errors.line1}
      />
      <Field
        label={copy.labels.line2}
        name="line2"
        autoComplete="address-line2"
        defaultValue={existing?.line2}
        maxLength={120}
        error={errors.line2}
      />
      <div className="ks-addr__pair">
        <Field
          label={copy.labels.pincode}
          name="pincode"
          inputMode="numeric"
          required
          autoComplete="postal-code"
          defaultValue={existing?.pincode}
          maxLength={6}
          error={errors.pincode}
        />
        <Field
          label={copy.labels.city}
          name="city"
          required
          autoComplete="address-level2"
          defaultValue={existing?.city}
          maxLength={60}
          error={errors.city}
        />
      </div>
      <Select
        label={copy.labels.state}
        name="state"
        required
        options={INDIAN_STATES}
        defaultValue={existing?.state}
        error={errors.state}
        placeholder={copy.statePlaceholder}
      />

      {failure ? (
        <Alert tone="danger">
          <p>{failure}</p>
        </Alert>
      ) : null}

      <button type="submit" disabled={state === "saving"} className="kh-btn kh-btn--primary kh-btn--l kh-btn--block">
        <span>{state === "saving" ? copy.saving : copy.save}</span>
      </button>

      <p className="kh-body-s ks-muted">{copy.reassurance}</p>
    </form>
  );
}
