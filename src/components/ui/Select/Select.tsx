import { useId, type ReactNode, type Ref, type SelectHTMLAttributes } from "react";
import { ICON_CARET_DOWN } from "@/components/ui/Field/field-icons";
import { Glyph } from "@/components/ui/Icon/Glyph";
import { describedControl, FieldFrame } from "@/components/ui/Field/field-parts";

/** A choice: its text, or a value with its own label (DS SelectProps). */
export type SelectOption = string | { readonly value: string; readonly label: ReactNode; readonly disabled?: boolean };

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "className"> & {
  label: ReactNode;
  options: readonly SelectOption[];
  /** A disabled first option ("Choose your state"): an instruction, chosen until the parent picks, never a default. */
  placeholder?: string;
  hint?: ReactNode;
  /** Replaces the hint; marks the select invalid and is announced (role="alert"). */
  error?: ReactNode;
  id?: string;
  /** On the `kh-field` wrapper. */
  className?: string;
  ref?: Ref<HTMLSelectElement>;
};

/**
 * The DS Select (`kh-select`): a native `<select>` (phones show their own picker) styled as the text field,
 * with the same label, hint and error pattern and a caret. Every select attribute is forwarded unchanged
 * (`name`, `required`, `autoComplete`, values and handlers).
 */
export function Select({
  label,
  options,
  placeholder,
  hint,
  error,
  id,
  className,
  value,
  defaultValue,
  "aria-describedby": describedBy,
  ...select
}: SelectProps) {
  const generated = useId();
  const selectId = id ?? generated;
  // With a placeholder and nothing saved, the placeholder is what shows (and what an untouched form submits).
  const initial = placeholder !== undefined && value === undefined && defaultValue === undefined ? "" : defaultValue;
  return (
    <FieldFrame id={selectId} label={label} hint={hint} error={error} className={className}>
      <div className="kh-select">
        <select
          className="kh-field__input kh-select__input"
          id={selectId}
          {...describedControl(selectId, { hint, error, describedBy })}
          {...(value === undefined ? { defaultValue: initial } : { value })}
          {...select}
        >
          {placeholder !== undefined ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => {
            const o = typeof option === "string" ? { value: option, label: option } : option;
            return (
              <option key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}
              </option>
            );
          })}
        </select>
        <Glyph d={ICON_CARET_DOWN} className="kh-select__caret" />
      </div>
    </FieldFrame>
  );
}
