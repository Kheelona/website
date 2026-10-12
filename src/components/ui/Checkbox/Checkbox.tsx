import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { clsx } from "clsx";
import { ICON_CHECK, ICON_VIEWBOX } from "@/components/ui/Field/field-icons";
import { FieldError } from "@/components/ui/Field/field-parts";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className" | "type"> & {
  /** The whole sentence; it may carry links (pass them with their "(opens in a new tab)" note). */
  label: ReactNode;
  /** Under the label text (`kh-check__hint`, `<id>-h`), tied by `aria-describedby`. */
  hint?: ReactNode;
  /** Under the row, outside the label (so it is never read as part of the name); marks the input invalid and
   *  is announced (role="alert"). The DS line `kh-field__error`, as the text field shows its errors. */
  error?: ReactNode;
  /** The store's consent row (`ks-consent`, from the mockup's `mk-consent`): links in the sentence take the
   *  link colour. A consent box is never pre-ticked (DS Checkbox rule): leave `defaultChecked` out. */
  consent?: boolean;
  id?: string;
  /** On the `kh-check` wrapper. */
  className?: string;
  ref?: Ref<HTMLInputElement>;
};

/**
 * The DS Checkbox (`kh-check`, `__input`, `__label`, `__box`, `__text`): a visually hidden real checkbox, then
 * its label with the 24 px box (Kheelu Blue with a white tick when checked) and the text, in a 48 px tap row.
 * Every input attribute is forwarded unchanged (`name`, `required`, `checked`, handlers).
 */
export function Checkbox({ label, hint, error, consent, id, className, "aria-describedby": describedBy, ...input }: CheckboxProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const described = [hint ? `${inputId}-h` : null, error ? `${inputId}-e` : null, describedBy || null].filter(Boolean).join(" ");
  return (
    <div className={clsx("kh-check", consent && "ks-consent", className)}>
      <input
        type="checkbox"
        id={inputId}
        className="kh-check__input"
        aria-describedby={described || undefined}
        aria-invalid={error ? "true" : undefined}
        {...input}
      />
      <label htmlFor={inputId} className="kh-check__label">
        <span className="kh-check__box" aria-hidden="true">
          {/* The DS icon markup, as the mockup's {{icon:}} injection writes it (ui/Icon is task 2.2, same wave). */}
          <svg className="kh-icon kh-check__tick" viewBox={ICON_VIEWBOX} aria-hidden="true" focusable="false">
            <path d={ICON_CHECK} />
          </svg>
          <span className="kh-check__dash" />
        </span>
        <span className="kh-check__text">
          <span>{label}</span>
          {hint ? (
            <span className="kh-check__hint" id={`${inputId}-h`}>
              {hint}
            </span>
          ) : null}
        </span>
      </label>
      {error ? <FieldError id={`${inputId}-e`}>{error}</FieldError> : null}
    </div>
  );
}
