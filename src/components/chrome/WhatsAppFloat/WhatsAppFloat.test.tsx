import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ICON_WHATSAPP_LOGO } from "@/assets/icons.generated";
import type { SupportChat } from "@/content/types";
import { WhatsAppFloat, whatsAppChatUrl } from "./WhatsAppFloat";

/* WhatsAppFloat (task 3.1; D050, architecture §5.3, §11.2 row D050, §11.3). A real link to WhatsApp with the
 * context's pre-filled text, in the DS icon-button look with WhatsApp green (G-20). Its lift above the buy bar,
 * its hiding under an open dialog and its laptop label are CSS (whatsapp-float.css and motion.css), so it renders
 * on the server with no client part. */

/** The support chat as content/en-IN/seller.ts words it (fixture copy; the shell passes the real one). */
const CHAT: SupportChat = {
  number: "919187546483",
  label: "Chat with us on WhatsApp",
  shortLabel: "Chat on WhatsApp",
  texts: {
    site: "Hi Kheelona! I have a question about Kheelu.",
    store: "Hi Kheelona! I need help with my pre-order.",
    thanks: "Hi Kheelona! I have a question about my order.",
  },
};

const CSS = readFileSync("src/components/chrome/WhatsAppFloat/whatsapp-float.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

/** The declarations of the first rule whose selector list is exactly `selector`. */
function rule(selector: string, css = CSS): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = new RegExp(`(?:^|})\\s*${escaped}\\s*\\{([^}]*)\\}`).exec(css);
  if (!m) throw new Error(`whatsapp-float.css has no rule "${selector}"`);
  return m[1].replace(/\s+/g, " ").trim();
}

describe("whatsAppChatUrl", () => {
  it("is the D050 address: wa.me, the support number and the context's text, encoded", () => {
    expect(whatsAppChatUrl(CHAT, "site")).toBe("https://wa.me/919187546483?text=Hi%20Kheelona!%20I%20have%20a%20question%20about%20Kheelu.");
    expect(whatsAppChatUrl(CHAT, "store")).toBe("https://wa.me/919187546483?text=Hi%20Kheelona!%20I%20need%20help%20with%20my%20pre-order.");
    expect(whatsAppChatUrl(CHAT, "thanks")).toBe(
      "https://wa.me/919187546483?text=Hi%20Kheelona!%20I%20have%20a%20question%20about%20my%20order.",
    );
  });

  it("decodes back to exactly the content's words", () => {
    for (const context of ["site", "store", "thanks"] as const) {
      expect(new URL(whatsAppChatUrl(CHAT, context)).searchParams.get("text")).toBe(CHAT.texts[context]);
    }
  });
});

describe("WhatsAppFloat", () => {
  it("is one real link named for screen readers, opening WhatsApp in a new tab", () => {
    render(<WhatsAppFloat chat={CHAT} context="site" />);
    const link = screen.getByRole("link", { name: "Chat with us on WhatsApp" });
    expect(link).toHaveAttribute("href", whatsAppChatUrl(CHAT, "site"));
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("wears the DS large icon button with the bubble's own hook, and says which CTA it is", () => {
    render(<WhatsAppFloat chat={CHAT} context="site" />);
    const link = screen.getByRole("link");
    expect(link.className.split(/\s+/)).toEqual(["kh-iconbtn", "kh-iconbtn--l", "ks-wa"]);
    expect(link).toHaveAttribute("data-ph-capture-attribute-cta", "whatsapp-float");
  });

  it("draws the DS whatsapp-logo icon, hidden from screen readers", () => {
    const { container } = render(<WhatsAppFloat chat={CHAT} context="site" />);
    const svg = container.querySelector("a > svg.kh-icon");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg?.querySelector("path")).toHaveAttribute("d", ICON_WHATSAPP_LOGO);
  });

  it("carries the laptop label as hidden-from-readers text (the link's name says it already)", () => {
    const { container } = render(<WhatsAppFloat chat={CHAT} context="site" />);
    const label = container.querySelector("a > .ks-wa__label");
    expect(label).toHaveTextContent("Chat on WhatsApp");
    expect(label).toHaveClass("kh-label-s");
    expect(label).toHaveAttribute("aria-hidden", "true");
  });

  it.each(["site", "store", "thanks"] as const)("uses the %s text", (context) => {
    render(<WhatsAppFloat chat={CHAT} context={context} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", whatsAppChatUrl(CHAT, context));
  });

  it("keeps PostHog autocapture off the bubble on /thanks only (inventory row 18)", () => {
    const { rerender } = render(<WhatsAppFloat chat={CHAT} context="thanks" />);
    expect(screen.getByRole("link")).toHaveClass("ph-no-capture");
    expect(screen.getByRole("link")).toHaveAttribute("data-ph-capture-attribute-cta", "whatsapp-float");
    for (const context of ["site", "store"] as const) {
      rerender(<WhatsAppFloat chat={CHAT} context={context} />);
      expect(screen.getByRole("link")).not.toHaveClass("ph-no-capture");
    }
  });
});

describe("whatsapp-float.css", () => {
  it("defines WhatsApp green once, as the D050 exception, and paints the bubble with it, also on hover", () => {
    expect(CSS.match(/--ks-wa-green\s*:/g)).toHaveLength(1);
    expect(CSS).toMatch(/--ks-wa-green:\s*#25D366;/i);
    expect(rule(".ks-wa")).toContain("background: var(--ks-wa-green)");
    expect(rule(".ks-wa:hover")).toBe("background: var(--ks-wa-green);");
  });

  it("sits fixed at the bottom right: space-4 plus the safe area on phones, space-5 from 900 px", () => {
    const base = rule(".ks-wa");
    expect(base).toContain("position: fixed");
    expect(base).toContain("right: var(--space-4)");
    expect(base).toContain("bottom: calc(var(--space-4) + env(safe-area-inset-bottom))");
    expect(base).toContain("margin: 0");
    expect(base).toContain("box-shadow: var(--shadow-lift)");
    const laptop = /@media \(min-width: 900px\)\s*\{([\s\S]*?)\n\}/.exec(CSS)?.[1] ?? "";
    expect(rule(".ks-wa", laptop)).toContain("right: var(--space-5)");
    expect(rule(".ks-wa", laptop)).toContain("bottom: var(--space-5)");
  });

  it("adds no transition of its own: the lift and the label move only through motion.css", () => {
    expect(CSS).not.toMatch(/transition|animation/);
  });

  it("hides under any open modal dialog", () => {
    expect(rule("html:has(dialog[open]) .ks-wa")).toContain("visibility: hidden");
  });

  it("shows the label on laptops only, beside the bubble, as dark text on a raised surface", () => {
    const label = rule(".ks-wa__label");
    expect(label).toContain("display: none");
    const laptop = /@media \(min-width: 900px\)\s*\{([\s\S]*?)\n\}/.exec(CSS)?.[1] ?? "";
    const shown = rule(".ks-wa__label", laptop);
    expect(shown).toContain("display: block");
    expect(shown).toContain("color: var(--text)");
    expect(shown).toContain("background: var(--surface-raised)");
  });

  it("keeps every page's last content clear of the bubble (body.ks-has-float)", () => {
    expect(rule(".ks-has-float .kh-footer")).toBe(
      "padding-bottom: calc(var(--space-8) + var(--space-4) + env(safe-area-inset-bottom));",
    );
  });
});
