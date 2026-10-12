import type { ReactNode } from "react";
import { clsx } from "clsx";
import { Glyph } from "@/components/ui/Icon/Glyph";
import { ICON_WARNING_CIRCLE } from "./field-icons";

/* The label, hint and error pattern the DS shares between TextField and Select (bundle.js `fieldMeta`:
 * one `<id>-d` element under the control, the error replacing the hint), used by Field and Select, and the
 * error line Checkbox borrows. Errors are announced: each one mounts as a fresh role="alert" element. */

/** `aria-invalid` and `aria-describedby` for a control with this id, hint and error; a description the
 *  caller passed keeps its place after the field's own. */
export function describedControl(
  id: string,
  { hint, error, describedBy }: { hint?: ReactNode; error?: ReactNode; describedBy?: string },
): { "aria-invalid"?: "true"; "aria-describedby"?: string } {
  const ids = [hint || error ? `${id}-d` : null, describedBy || null].filter(Boolean).join(" ");
  return { "aria-invalid": error ? "true" : undefined, "aria-describedby": ids || undefined };
}

/** The DS error line (`kh-field__error`, with its warning-circle icon), announced as it mounts. */
export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <span className="kh-field__error" id={id} role="alert">
      <Glyph d={ICON_WARNING_CIRCLE} />
      {children}
    </span>
  );
}

/** The `kh-field` frame: visible label, the control, then the hint or the error. */
export function FieldFrame({
  id,
  label,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={clsx("kh-field", error && "kh-field--error", className)}>
      <label className="kh-field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {/* Different keys: an error that takes the hint's place is a new element, so screen readers announce it. */}
      {error ? (
        <FieldError key="error" id={`${id}-d`}>
          {error}
        </FieldError>
      ) : hint ? (
        <span key="hint" className="kh-field__hint" id={`${id}-d`}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}
