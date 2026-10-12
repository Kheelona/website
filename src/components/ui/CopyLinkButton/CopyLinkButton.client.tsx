"use client";

import { useState } from "react";
import { ICON_PATHS, ICON_VIEWBOX } from "@/assets/icons.generated";

export interface CopyLinkButtonProps {
  /** What goes on the clipboard: the store URL the page is given. */
  value: string;
  /** The button's words ("Copy link"), from content. */
  label: string;
  /** Said in the polite live region once the value is on the clipboard ("Link copied."), from content. */
  copiedMessage: string;
}

/**
 * "Copy link" (mockup/store.html fold 2): the DS secondary small button with the copy icon, then a polite live
 * region that says what happened. If the browser refuses or has no Clipboard API, nothing is said: the note
 * prints the address in full beside the button, so it works without this (as approved). Not a pre-order CTA,
 * so no cta value; autocapture records its text.
 */
export function CopyLinkButton({ value, label, copiedMessage }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Refused, or no Clipboard API (navigator.clipboard undefined): the printed address stands in.
    }
  }

  return (
    <>
      {/* DS Button markup (secondary, s) and the DS icon markup as the mockup writes them; ui/Button and
          ui/Icon are task 2.2, same wave. */}
      <button type="button" className="kh-btn kh-btn--secondary kh-btn--s" onClick={copy}>
        <svg className="kh-icon" viewBox={ICON_VIEWBOX} aria-hidden="true" focusable="false">
          <path d={ICON_PATHS.copy} />
        </svg>
        <span>{label}</span>
      </button>
      <span className="kh-label-s" aria-live="polite">
        {copied ? copiedMessage : null}
      </span>
    </>
  );
}
