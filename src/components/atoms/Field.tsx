"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/** The form field atoms (§8.25-o).
 *
 *  New atoms, because the catalog had none: this site had no form of its own
 *  until the store, only a Tally iframe. They are generic on purpose (a
 *  labelled text input is not a pre-order concept) and they live here rather
 *  than inside the feature so the next form does not hand-roll its own.
 *
 *  ACCESSIBILITY IS THE WHOLE JOB of these three components, and the a11y gate
 *  is 90+ regardless of styling preference (spec §3):
 *   - a real <label>, tied by id. Placeholder-as-label is the most common way a
 *     form becomes unusable, because the label vanishes as soon as you type.
 *   - `aria-describedby` covers BOTH the hint and the error, so a screen reader
 *     hears the requirement and the problem, not one or the other.
 *   - `aria-invalid` plus a written sentence. Colour never carries the message
 *     alone, which also means the palette needs no error token it does not have.
 *   - the brand focus ring, the same one every other control uses.
 *
 *  On the error colour: there is no red in this palette and inventing one is
 *  forbidden (§8.2), so errors use `orange-ink`, the darkened small-text orange
 *  that holds 4.5:1 on every wash. It reads as attention rather than danger,
 *  which is why the wording carries the weight. */

const LABEL = "mb-1.5 block text-[15px] font-bold text-ink-head";
const HINT = "mt-1.5 text-[14px] text-ink-muted";
const ERROR = "mt-1.5 text-[14px] font-bold text-orange-ink";
const CONTROL =
  "w-full rounded-(--radius-card) border bg-white px-4 py-3.5 text-[17px] text-ink " +
  "placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-orange focus-visible:ring-offset-2 " +
  /* 16px minimum on the control: iOS Safari zooms the whole viewport when a
     focused input is smaller, which on a payment form looks like the page
     breaking at the exact moment trust matters. */
  "text-[17px]";

type Common = {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
};

function Shell({
  id,
  label,
  hint,
  error,
  required,
  className,
  children,
}: Common & { id: string; children: (aria: AriaProps) => React.ReactNode }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL}>
        {label}
        {!required ? <span className="font-medium text-ink-muted"> (optional)</span> : null}
      </label>
      {children({ id, describedBy, invalid: Boolean(error), required })}
      {hint ? (
        <p id={hintId} className={HINT}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={ERROR}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

type AriaProps = {
  id: string;
  describedBy?: string;
  invalid: boolean;
  required?: boolean;
};

function borderFor(invalid: boolean): string {
  return invalid ? "border-orange-deep" : "border-line";
}

export function TextField({
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  defaultValue,
  maxLength,
  ...common
}: Common & {
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  placeholder?: string;
  defaultValue?: string;
  maxLength?: number;
}) {
  const id = useId();
  return (
    <Shell {...common} id={id}>
      {(aria) => (
        <input
          id={aria.id}
          name={common.name}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          defaultValue={defaultValue}
          maxLength={maxLength}
          required={aria.required}
          aria-invalid={aria.invalid || undefined}
          aria-describedby={aria.describedBy}
          className={cn(CONTROL, borderFor(aria.invalid))}
        />
      )}
    </Shell>
  );
}

export function SelectField({
  options,
  defaultValue,
  placeholder = "Choose one",
  ...common
}: Common & {
  options: readonly string[];
  defaultValue?: string;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <Shell {...common} id={id}>
      {(aria) => (
        <select
          id={aria.id}
          name={common.name}
          defaultValue={defaultValue ?? ""}
          required={aria.required}
          aria-invalid={aria.invalid || undefined}
          aria-describedby={aria.describedBy}
          className={cn(CONTROL, borderFor(aria.invalid), "appearance-none pr-10")}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </Shell>
  );
}

/** A single checkbox with its consequence written next to it.
 *
 *  Not built on Shell: a checkbox's label sits AFTER the control and the whole
 *  sentence is the label, so reusing the stacked shell would put the tick above
 *  its own explanation. */
export function ChoiceField({
  name,
  children,
  error,
  defaultChecked,
  className,
}: {
  name: string;
  children: React.ReactNode;
  error?: string;
  defaultChecked?: boolean;
  className?: string;
}) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          /* 20px and a touch target of at least 44px via the label padding:
             a tick box that needs aim is a tick box people mis-tap. */
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0 rounded border-2 accent-orange",
            error ? "border-orange-deep" : "border-line",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
          )}
        />
        <label htmlFor={id} className="text-[15px] leading-[1.5] text-ink">
          {children}
        </label>
      </div>
      {error ? (
        <p id={errorId} className={cn(ERROR, "ml-8")}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
