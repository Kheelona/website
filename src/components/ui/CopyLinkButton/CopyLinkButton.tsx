import { ICON_PATHS, ICON_VIEWBOX } from "@/assets/icons.generated";
import { CopyLinkButtonIsland } from "./CopyLinkButton.client";

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
 * region that says what happened. Not a pre-order CTA, so no cta value; autocapture records its text.
 *
 * Server part: it draws the DS copy icon here and hands it to the client island, so the browser never receives
 * the 30 KB icon map (assets catalogue, Icons row). Render it from a server component.
 */
export function CopyLinkButton({ value, label, copiedMessage }: CopyLinkButtonProps) {
  return (
    <CopyLinkButtonIsland
      value={value}
      label={label}
      copiedMessage={copiedMessage}
      icon={
        // The DS icon markup, as the mockup's {{icon:}} injection writes it (ui/Icon is task 2.2, same wave).
        <svg className="kh-icon" viewBox={ICON_VIEWBOX} aria-hidden="true" focusable="false">
          <path d={ICON_PATHS.copy} />
        </svg>
      }
    />
  );
}
