import type { ReactNode } from "react";
import { clsx } from "clsx";
import { Glyph } from "@/components/ui/Icon/Glyph";
import { ALERT_TONE_ICON } from "./alert-icons";

/** The DS status tones (index.d.ts `Status`). */
export type AlertTone = keyof typeof ALERT_TONE_ICON;

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
  className?: string;
}

/**
 * The DS Alert (`kh-alert`, `__icon`, `__content`, `__title`, `__body`): an inline notice on the cream band,
 * the status colour in the icon. Never for marketing (DS Alert rule). The info tone carries no modifier
 * class, as the approved mockup writes it (mockup/store.html fold 2); the others add `kh-alert--<tone>`.
 *
 * The icon is always the tone's (no DS `icon` override): an override would need the whole icon map, and the
 * checkout forms' client islands render this Alert for their failure lines (alert-icons.ts).
 */
export function Alert({ tone = "info", title, children, action, className }: AlertProps) {
  return (
    <div className={clsx("kh-alert", tone !== "info" && `kh-alert--${tone}`, className)} role={tone === "danger" ? "alert" : "status"}>
      <Glyph d={ALERT_TONE_ICON[tone]} className="kh-alert__icon" />
      <div className="kh-alert__content">
        {title ? <p className="kh-alert__title">{title}</p> : null}
        {children ? <div className="kh-alert__body">{children}</div> : null}
        {action}
      </div>
    </div>
  );
}
