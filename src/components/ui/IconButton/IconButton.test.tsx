import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ICON_CARET_LEFT, ICON_CARET_RIGHT, ICON_LIST, ICON_PLAY, ICON_WHATSAPP_LOGO, ICON_X } from "@/assets/icons.generated";
import { IconButton } from "./IconButton";

/* The DS x icon (design-system/project/assets/Icons/x.svg), hand-copied from partials/drawer.html as built. */
const X_PATH =
  "M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z";

describe("IconButton", () => {
  it("renders the drawer's close button as partials/drawer.html does", () => {
    expect(renderToStaticMarkup(<IconButton icon={ICON_X} label="Close menu" title="Close menu" />)).toBe(
      '<button type="button" class="kh-iconbtn" aria-label="Close menu" title="Close menu">' +
        `<svg class="kh-icon" viewBox="0 0 256 256" aria-hidden="true" focusable="false"><path d="${X_PATH}"></path></svg>` +
        "</button>",
    );
  });

  it("has no native tooltip unless asked (the films controls, home.html fold 2)", () => {
    render(<IconButton icon={ICON_CARET_RIGHT} label="Next video" variant="outline" />);
    const button = screen.getByRole("button", { name: "Next video" });
    expect(button.className).toBe("kh-iconbtn kh-iconbtn--outline");
    expect(button).not.toHaveAttribute("title");
  });

  it.each([
    [{}, "kh-iconbtn"],
    [{ variant: "ghost" }, "kh-iconbtn"],
    [{ variant: "outline" }, "kh-iconbtn kh-iconbtn--outline"],
    [{ variant: "primary" }, "kh-iconbtn kh-iconbtn--primary"],
    [{ size: "s" }, "kh-iconbtn kh-iconbtn--s"],
    [{ size: "m" }, "kh-iconbtn"],
    [{ size: "l" }, "kh-iconbtn kh-iconbtn--l"],
    [{ variant: "primary", size: "l", className: "ks-film__play" }, "kh-iconbtn kh-iconbtn--primary kh-iconbtn--l ks-film__play"],
  ] as const)("classes for %j", (props, cls) => {
    render(<IconButton icon={ICON_PLAY} label="Play" {...props} />);
    expect(screen.getByRole("button", { name: "Play" }).className).toBe(cls);
  });

  it("names the button by its label and hides the icon", () => {
    const { container } = render(<IconButton icon={ICON_LIST} label="Menu" />);
    expect(screen.getByRole("button", { name: "Menu" })).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("draws the icon constant it is given, not another", () => {
    const { container } = render(<IconButton icon={ICON_CARET_LEFT} label="Previous video" />);
    expect(container.querySelector("path")).toHaveAttribute("d", ICON_CARET_LEFT);
    expect(ICON_CARET_LEFT).not.toBe(ICON_CARET_RIGHT);
  });

  it("forwards button attributes: click, disabled, controls and expanded state", () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <IconButton icon={ICON_CARET_LEFT} label="Previous video" onClick={onClick} aria-controls="films" aria-expanded={false} />,
    );
    const button = screen.getByRole("button", { name: "Previous video" });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("aria-controls", "films");
    expect(button).toHaveAttribute("aria-expanded", "false");
    rerender(<IconButton icon={ICON_CARET_LEFT} label="Previous video" disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is reached by the keyboard; a disabled control (the films strip at its end) is skipped", async () => {
    const user = userEvent.setup();
    render(
      <>
        <IconButton icon={ICON_CARET_LEFT} label="Previous video" variant="outline" disabled />
        <IconButton icon={ICON_CARET_RIGHT} label="Next video" variant="outline" />
      </>,
    );
    await user.tab();
    expect(screen.getByRole("button", { name: "Next video" })).toHaveFocus();
  });

  it("renders a link when given an address, with the link attributes it is given", () => {
    render(
      <IconButton icon={ICON_WHATSAPP_LOGO} label="Chat with us on WhatsApp" size="l" href="https://wa.me/919187546483" target="_blank" rel="noopener" />,
    );
    const link = screen.getByRole("link", { name: "Chat with us on WhatsApp" });
    expect(link).toHaveAttribute("href", "https://wa.me/919187546483");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
    expect(link.className).toBe("kh-iconbtn kh-iconbtn--l");
    expect(link).not.toHaveAttribute("type");
  });

  it("takes a named icon constant only: an icon name or a typed path does not compile", () => {
    // @ts-expect-error an icon name is not an IconPath: use ICON_X (task 2.11)
    render(<IconButton icon="x" label="Close" />);
    // @ts-expect-error a typed string is not an IconPath
    render(<IconButton icon="M0,0Z" label="Open" />);
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("is client-safe: it draws through Glyph and never imports Icon or the icon map", () => {
    const source = readFileSync("src/components/ui/IconButton/IconButton.tsx", "utf8");
    expect(source).toMatch(/^import \{ Glyph \} from "\.\.\/Icon\/Glyph";$/m);
    expect(source).not.toMatch(/Icon\/Icon"|ICON_PATHS|\bIconName\b/);
  });
});
