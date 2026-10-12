import clsx from "clsx";
import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import { CTAS, type CtaId } from "@/lib/tracking/cta";
import { Icon, type IconName } from "../Icon/Icon";

/**
 * DS Button (design-system/project/components/Button; markup as bundle.js renders it and the approved
 * mockup ports it): `kh-btn` and its variants, the label in a `<span>`, an optional icon before it and
 * one after it.
 *
 * - `variant="cta"` (Chilli) is for buying only and must carry a `cta` value (`CtaId`, the registry in
 *   src/lib/tracking/cta.ts): it refuses to compile without one, and refuses at render time a value
 *   whose role is not "preorder". Other variants may carry a secondary value (the ghost links' `hero-learn`
 *   and the like). The value is written to `data-ph-capture-attribute-cta`, which PostHog promotes to
 *   `cta` (architecture §8.3). A store link is `PreorderButton`, which wraps this.
 * - `arrow` (Chilli only) ends the button with the arrow-right icon carrying `ks-btn__arrow`, the hook
 *   motion.css nudges on hover with a fine pointer (D049 pick 6; architecture §11.3).
 * - `href` renders a link: a site path through next/link, anything else (store URL, anchor) a plain `<a>`.
 * - Ghost buttons keep the mockup's markup (`kh-btn kh-btn--ghost`); button.css ports mockup.css's ghost rule onto
 *   `.kh-btn--ghost`, so a long label may wrap on a phone.
 *
 * Server component. A client component never imports Button or Icon (either would ship the whole icon map,
 * src/assets/icons.generated.ts, to the browser): a server parent renders the Button and passes it in as
 * children or a prop. `onClick` therefore belongs to client-only markup, not to this component.
 */

type Size = "s" | "m" | "l";

interface Common {
  size?: Size;
  block?: boolean;
  /** Before the label: an icon that carries meaning (WhatsApp, shield). */
  icon?: IconName;
  id?: string;
  /** Composition hooks (`ks-…`), after the DS classes. */
  className?: string;
  /** The label, from content. */
  children: ReactNode;
}

type Chilli = { variant: "cta"; cta: CtaId } & (
  | { arrow: true; iconEnd?: never }
  | { arrow?: false; iconEnd?: IconName }
);

interface Other {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  cta?: CtaId;
  arrow?: never;
  /** After the label: an icon of direction (arrow-right). */
  iconEnd?: IconName;
}

interface AsLink {
  href: string;
  type?: never;
  loading?: never;
  disabled?: never;
  onClick?: never;
}

interface AsButton {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  /** Shows the DS spinner, sets aria-busy and disables the button; keep the label. */
  loading?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export type ButtonProps = Common & (Chilli | Other) & (AsLink | AsButton);

/** The CTA value must fit the button: pre-order values on Chilli only, secondary values elsewhere. */
function checkCta(variant: string, cta: string | undefined): void {
  if (cta === undefined) {
    if (variant === "cta") throw new Error("A Chilli button (variant=\"cta\") needs a pre-order CTA value (cta, src/lib/tracking/cta.ts).");
    return;
  }
  const spec = Object.hasOwn(CTAS, cta) ? CTAS[cta as keyof typeof CTAS] : undefined;
  if (spec === undefined || spec.reserved) {
    throw new Error(`"${cta}" is not a CTA value an element may carry (src/lib/tracking/cta.ts).`);
  }
  if (variant === "cta" && spec.role !== "preorder") {
    throw new Error(`"${cta}" is a ${spec.role} value; a Chilli button carries a pre-order value.`);
  }
  if (variant !== "cta" && spec.role !== "secondary") {
    const what = spec.role === "preorder" ? "pre-order" : spec.role;
    throw new Error(`"${cta}" is a ${what} value; a ${variant} button carries a secondary value only.`);
  }
}

/** The DS Spinner as bundle.js draws it inside a button (size 18). */
function Spinner() {
  return (
    <span className="kh-spinner-wrap">
      <svg className="kh-spinner" viewBox="0 0 24 24" width={18} height={18} aria-hidden="true" focusable="false">
        <circle className="kh-spinner__track" cx={12} cy={12} r={9.5} />
        <circle className="kh-spinner__arc" cx={12} cy={12} r={9.5} />
      </svg>
    </span>
  );
}

export function Button(props: ButtonProps) {
  const { size, block, icon, iconEnd, arrow, id, className, children, cta } = props;
  const variant = props.variant ?? "secondary";
  checkCta(variant, cta);
  const loading = props.href === undefined && props.loading === true;
  const cls = clsx(
    "kh-btn",
    `kh-btn--${variant}`,
    size && size !== "m" && `kh-btn--${size}`,
    block && "kh-btn--block",
    loading && "kh-btn--loading",
    className,
  );
  const track = cta ? { "data-ph-capture-attribute-cta": cta } : {};
  const content = (
    <>
      {loading ? <Spinner /> : icon ? <Icon name={icon} /> : null}
      <span>{children}</span>
      {arrow ? <Icon name="arrow-right" className="ks-btn__arrow" /> : iconEnd && !loading ? <Icon name={iconEnd} /> : null}
    </>
  );

  if (props.href !== undefined) {
    const { href } = props;
    return href.startsWith("/") ? (
      <Link id={id} href={href} className={cls} {...track}>
        {content}
      </Link>
    ) : (
      <a id={id} href={href} className={cls} {...track}>
        {content}
      </a>
    );
  }
  return (
    <button
      id={id}
      type={props.type ?? "button"}
      className={cls}
      {...track}
      disabled={props.disabled || loading || undefined}
      aria-busy={loading ? "true" : undefined}
      onClick={props.onClick}
    >
      {content}
    </button>
  );
}
