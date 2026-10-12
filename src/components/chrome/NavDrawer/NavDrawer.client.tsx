"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

export interface NavDrawerDialogProps {
  /** The id the menu button's `aria-controls` names. */
  id: string;
  /** The dialog's name ("Menu"). */
  label: string;
  /** The panel, rendered by the server part (NavDrawer.tsx): this island never imports Icon or Button. */
  children: ReactNode;
}

/** What closes the drawer when clicked inside it: any link (the page is changing) and the close button. */
const CLOSES = "a[href], [data-close-menu]";

/**
 * The drawer's `<dialog>` and its behaviour, ported from mockup/mockup.js §3. The menu button opens it with
 * `showModal()` (NavBar.client.tsx); the browser then keeps focus inside, makes the page inert, closes it on Escape and
 * returns focus to the button. Here, one click handler closes it from a link, from the close button, or from the
 * backdrop: the dialog covers the screen (nav-drawer.css) and the panel sits inside it, so a click that lands on the
 * dialog itself landed outside the panel.
 */
export function NavDrawerDialog({ id, label, children }: NavDrawerDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  function onClick(event: MouseEvent<HTMLDialogElement>) {
    const dialog = ref.current;
    if (!dialog) return;
    const target = event.target;
    if (target === dialog || (target instanceof Element && target.closest(CLOSES))) dialog.close();
  }

  return (
    <dialog ref={ref} className="kh-drawer" id={id} aria-label={label} onClick={onClick}>
      {children}
    </dialog>
  );
}
