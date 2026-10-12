import type { ReactNode } from "react";
import { clsx } from "clsx";
import { ICON_PATHS, ICON_VIEWBOX, type IconName } from "@/assets/icons.generated";

/** The DS status tones (index.d.ts `Status`). */
export type AlertTone = "info" | "success" | "warning" | "danger";

/** The DS's icon per tone (bundle.js `STATUS_ICON`). */
const TONE_ICON: Readonly<Record<AlertTone, IconName>> = {
  info: "info",
  success: "check-circle",
  warning: "warning-circle",
  danger: "warning-circle",
};

export interface AlertProps {
  /** `info` (default, an ink icon), `success`, `warning` or `danger`. Only `danger` is role="alert",
   *  announced at once: use it only for a problem that needs action (DS Alert rule). */
  tone?: AlertTone;
  /** Lead with what happened. */
  title?: ReactNode;
  /** The body: then what to do. Block content (a paragraph) as the mockup has it. */
  children?: ReactNode;
  /** Rendered as given inside the content column, after the body (the store's copy-link row). */
  action?: ReactNode;
  /** Overrides the tone's icon. */
  icon?: IconName;
  className?: string;
}

/**
 * The DS Alert (`kh-alert`, `__icon`, `__content`, `__title`, `__body`): an inline notice on the cream band,
 * the status colour in the icon. Never for marketing (DS Alert rule). The info tone carries no modifier
 * class, as the approved mockup writes it (mockup/store.html fold 2); the others add `kh-alert--<tone>`.
 */
export function Alert({ tone = "info", title, children, action, icon, className }: AlertProps) {
  return (
    <div className={clsx("kh-alert", tone !== "info" && `kh-alert--${tone}`, className)} role={tone === "danger" ? "alert" : "status"}>
      {/* The DS icon markup, as the mockup writes it (ui/Icon is task 2.2, same wave). */}
      <svg className="kh-icon kh-alert__icon" viewBox={ICON_VIEWBOX} aria-hidden="true" focusable="false">
        <path d={ICON_PATHS[icon ?? TONE_ICON[tone]]} />
      </svg>
      <div className="kh-alert__content">
        {title ? <p className="kh-alert__title">{title}</p> : null}
        {children ? <div className="kh-alert__body">{children}</div> : null}
        {action}
      </div>
    </div>
  );
}
