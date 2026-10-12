import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { describedControl, FieldFrame } from "./field-parts";

/** What the `tel-in` variant means: an Indian number, so India's dialling code sits before the digits. It is
 *  decoration (aria-hidden, outside the input): the value is what the parent types, and the shared validators
 *  accept it with or without +91 or a leading 0 (mockup/pages/store.html fold 3). */
const TEL_IN_DIALLING_CODE = "+91";

export type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> & {
  /** Always visible (DS TextField rule): never a placeholder standing in for it. */
  label: ReactNode;
  /** Under the input, tied by `aria-describedby` (`<id>-d`). */
  hint?: ReactNode;
  /** Replaces the hint; marks the input invalid and is announced (role="alert"). Say how to fix it. */
  error?: ReactNode;
  /** The input's id; generated when absent. */
  id?: string;
  /** On the `kh-field` wrapper. */
  className?: string;
  /** `tel-in`: the store's phone field, +91 shown before the digits (`ks-tel`, from the mockup's `mk-tel`). */
  variant?: "tel-in";
  ref?: Ref<HTMLInputElement>;
};

/**
 * The DS TextField (`kh-field`, `__label`, `__input`, `__hint`, `__error`): a visible label, a 48 px input at
 * 16/24 (bundle.css; iOS zooms the page on a smaller focused field), the hint or the error under it. Every input
 * attribute is forwarded unchanged (`name`, `type`, `inputMode`, `autoComplete`, `maxLength`, `required`, values
 * and handlers), which is what lets the frozen checkout forms take it without a logic change (ADR-013).
 */
export function Field({ label, hint, error, id, className, variant, "aria-describedby": describedBy, ...input }: FieldProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const control = (
    <input className="kh-field__input" id={inputId} {...describedControl(inputId, { hint, error, describedBy })} {...input} />
  );
  return (
    <FieldFrame id={inputId} label={label} hint={hint} error={error} className={className}>
      {variant === "tel-in" ? (
        <div className="ks-tel">
          <span className="ks-tel__cc" aria-hidden="true">
            {TEL_IN_DIALLING_CODE}
          </span>
          {control}
        </div>
      ) : (
        control
      )}
    </FieldFrame>
  );
}
