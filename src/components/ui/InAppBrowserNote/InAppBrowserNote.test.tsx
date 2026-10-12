import { readFileSync } from "node:fs";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InAppBrowserNote, type InAppBrowserNoteContent } from "./InAppBrowserNote";

/* InAppBrowserNote (task 2.5; B12, N7): the store's fold 2 (mockup/store.html, `mk-inapp`, ported as
 * `ks-inapp`). It renders only when its content's `enabled` flag is true AND the page is open inside the
 * Instagram, Facebook or WhatsApp browser. The user agent is read on the client after hydration, never on the
 * server, so the store page stays static and hydrates without a mismatch. "Copy link" copies the store URL the
 * note is given. */

const INSTAGRAM =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 310.0.0.27.110 (iPhone14,5; iOS 17_1; en_IN; en; scale=3.00; 1170x2532; 541635890)";
const FACEBOOK =
  "Mozilla/5.0 (Linux; Android 13; SM-A536E Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.163 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/442.0.0.33.113;]";
const WHATSAPP =
  "Mozilla/5.0 (Linux; Android 13; RMX3630 Build/TP1A.220905.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.43 Mobile Safari/537.36 WhatsApp/2.23.25.83 A";
const CHROME = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

/** The approved wording (wiki/site/pages/store.md fold 2); the store page passes it from content. */
const CONTENT: InAppBrowserNoteContent = {
  enabled: true,
  title: "Paying by UPI? Open this page in Chrome or Safari.",
  body: "Do it first, so you don’t type your details twice. Copy the link and paste it into Chrome or Safari:",
  copyLabel: "Copy link",
  copiedMessage: "Link copied.",
};
const STORE = "https://store.kheelona.com";

let userAgent = CHROME;
beforeEach(() => {
  userAgent = CHROME;
  vi.spyOn(navigator, "userAgent", "get").mockImplementation(() => userAgent);
});
afterEach(() => {
  vi.restoreAllMocks();
  Reflect.deleteProperty(navigator, "clipboard");
});

function tidy<T extends Node>(node: T): T {
  node.normalize();
  const walk = (n: Node) => {
    for (const child of [...n.childNodes]) {
      if (child.nodeType === 8 || (child.nodeType === 3 && !(child.textContent ?? "").trim())) child.remove();
      else if (child.nodeType === 1) walk(child);
    }
    if (n instanceof Element && n.hasAttribute("class")) n.setAttribute("class", n.getAttribute("class")!.replace(/\bmk-/g, "ks-"));
  };
  walk(node);
  return node;
}

/** The mockup's note without what never ships: the Gate A review annotation and the mockup script's own
 *  data hooks (`data-copy`, `data-copied`; the build's button has its own handler). */
function mockupNote(): Element {
  const doc = new DOMParser().parseFromString(readFileSync("mockup/store.html", "utf8"), "text/html");
  const note = doc.querySelector(".mk-inapp")!.cloneNode(true) as Element;
  note.querySelectorAll(".mk-review-note").forEach((n) => n.remove());
  note.querySelectorAll("[data-copy], [data-copied]").forEach((n) => {
    n.removeAttribute("data-copy");
    n.removeAttribute("data-copied");
  });
  return tidy(note);
}

describe("InAppBrowserNote", () => {
  it.each([
    ["Instagram", INSTAGRAM],
    ["Facebook", FACEBOOK],
    ["WhatsApp", WHATSAPP],
  ])("enabled, inside %s: shows the note", (_app, ua) => {
    userAgent = ua;
    render(<InAppBrowserNote content={CONTENT} storeUrl={STORE} />);
    const note = screen.getByRole("status");
    expect(note).toHaveTextContent("Paying by UPI? Open this page in Chrome or Safari.");
    expect(screen.getByRole("button", { name: "Copy link" })).toBeInTheDocument();
  });

  it("enabled, in Chrome or Safari: shows nothing", () => {
    const { container } = render(<InAppBrowserNote content={CONTENT} storeUrl={STORE} />);
    expect(container).toBeEmptyDOMElement();
  });

  it.each([
    ["Instagram", INSTAGRAM],
    ["Chrome", CHROME],
  ])("disabled (until QA's device check), in %s: shows nothing", (_app, ua) => {
    userAgent = ua;
    const { container } = render(<InAppBrowserNote content={{ ...CONTENT, enabled: false }} storeUrl={STORE} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("never reads the user agent on the server: no note in the server HTML, then it appears after hydration without a mismatch", async () => {
    userAgent = INSTAGRAM;
    const html = renderToString(<InAppBrowserNote content={CONTENT} storeUrl={STORE} />);
    expect(html).not.toContain("kh-alert");
    expect(html).not.toContain("Paying by UPI");

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);
    const recoverable = vi.fn();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    await act(async () => {
      hydrateRoot(container, <InAppBrowserNote content={CONTENT} storeUrl={STORE} />, { onRecoverableError: recoverable });
    });
    expect(container.querySelector(".ks-inapp .kh-alert")).not.toBeNull();
    expect(recoverable).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    container.remove();
  });

  it("prints the address it copies, and copies the store URL it is given", async () => {
    userAgent = WHATSAPP;
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<InAppBrowserNote content={CONTENT} storeUrl="https://betastore.kheelona.com" />);
    const address = screen.getByText("betastore.kheelona.com");
    expect(address.tagName).toBe("STRONG");
    expect(address).toHaveClass("ks-nowrap");
    fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    expect(await screen.findByText("Link copied.")).toHaveAttribute("aria-live", "polite");
    expect(writeText).toHaveBeenCalledWith("https://betastore.kheelona.com");
  });

  it("matches the approved mockup's in-app note", () => {
    userAgent = INSTAGRAM;
    const { container } = render(<InAppBrowserNote content={CONTENT} storeUrl={STORE} />);
    const built = tidy(container.firstElementChild!.cloneNode(true) as Element);
    const mockup = mockupNote();
    expect(built.isEqualNode(mockup), `built:\n${built.outerHTML}\nmockup:\n${mockup.outerHTML}`).toBe(true);
  });
});
