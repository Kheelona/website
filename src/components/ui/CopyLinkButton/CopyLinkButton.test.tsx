import { readFileSync } from "node:fs";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { CopyLinkButton } from "./CopyLinkButton";

/* CopyLinkButton (task 2.5): the in-app note's "Copy link" (mockup/store.html fold 2): a DS secondary small
 * button with the copy icon, then a polite live region that says "Link copied." once the address is on the
 * clipboard. Its markup inside the note is compared with the mockup in InAppBrowserNote.test.tsx. */

const STORE = "https://store.kheelona.com";

function setClipboard(clipboard: unknown) {
  Object.defineProperty(navigator, "clipboard", { value: clipboard, configurable: true });
}

afterEach(() => {
  // Back to jsdom's own (it has none).
  Reflect.deleteProperty(navigator, "clipboard");
});

function renderButton() {
  const view = render(<CopyLinkButton value={STORE} label="Copy link" copiedMessage="Link copied." />);
  const button = screen.getByRole("button", { name: "Copy link" });
  const live = button.nextElementSibling as HTMLElement;
  return { ...view, button, live };
}

describe("CopyLinkButton", () => {
  it("renders the DS secondary small button with the copy icon, then an empty polite live region", () => {
    const { button, live, container } = renderButton();
    expect(button).toHaveAttribute("type", "button");
    expect(button.className).toBe("kh-btn kh-btn--secondary kh-btn--s");
    const [icon, text] = [...button.children];
    expect(icon.tagName.toLowerCase()).toBe("svg");
    expect(icon.getAttribute("class")).toBe("kh-icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon.querySelector("path")).toHaveAttribute("d", ICON_PATHS.copy);
    expect(text.tagName).toBe("SPAN");
    expect(text).toHaveTextContent("Copy link");
    expect(live.tagName).toBe("SPAN");
    expect(live.className).toBe("kh-label-s");
    expect(live).toHaveAttribute("aria-live", "polite");
    expect(live).toBeEmptyDOMElement();
    // Not a pre-order CTA: no cta value (store copy page, Tracking).
    expect(container.querySelector("[data-ph-capture-attribute-cta]")).toBeNull();
  });

  it("copies the value it is given and says so", async () => {
    const writeText = vi.fn(async () => {});
    setClipboard({ writeText });
    const { button, live } = renderButton();
    fireEvent.click(button);
    expect(await screen.findByText("Link copied.")).toBe(live);
    expect(writeText).toHaveBeenCalledWith(STORE);
  });

  it("is reachable by Tab, and Enter copies (keyboard alone)", async () => {
    const writeText = vi.fn(async () => {});
    const user = userEvent.setup();
    // user-event installs its own clipboard on setup; the page's is the one the button must use.
    setClipboard({ writeText });
    const { button, live } = renderButton();
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Link copied.")).toBe(live);
    expect(writeText).toHaveBeenCalledWith(STORE);
    expect(button).toHaveFocus();
  });

  it("says nothing when the browser refuses (the address is printed in full beside it)", async () => {
    const writeText = vi.fn(async () => {
      throw new Error("NotAllowedError");
    });
    setClipboard({ writeText });
    const { button, live } = renderButton();
    await act(async () => {
      fireEvent.click(button);
    });
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(live).toBeEmptyDOMElement();
  });

  it("says nothing, and does not throw, where there is no clipboard API", async () => {
    const { button, live } = renderButton();
    await act(async () => {
      fireEvent.click(button);
    });
    expect(live).toBeEmptyDOMElement();
  });

  it("ships no icon map to the browser: the client island imports React only, the server part draws the icon", () => {
    // The icon map is about 30 KB; a client island that imports it ships all 76 icons (assets catalogue, Icons row).
    const island = readFileSync("src/components/ui/CopyLinkButton/CopyLinkButton.client.tsx", "utf8");
    const imports = [...island.matchAll(/\bfrom\s+["']([^"']+)["']|\bimport\s*\(\s*["']([^"']+)["']/g)].map((m) => m[1] ?? m[2]);
    expect(imports).toEqual(["react"]);
    expect(readFileSync("src/components/ui/CopyLinkButton/CopyLinkButton.tsx", "utf8")).not.toMatch(/^\s*["']use client["']/m);
  });
});
