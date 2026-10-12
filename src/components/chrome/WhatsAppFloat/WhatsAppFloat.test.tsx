import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ICON_WHATSAPP_LOGO } from "@/assets/icons.generated";
import { seller } from "@/content/en-IN/seller";
import type { SupportChat } from "@/content/types";
import { WhatsAppFloat, whatsAppChatUrl } from "./WhatsAppFloat";

/* WhatsAppFloat (task 3.1; D050, architecture §5.3, §11.2 row D050, §11.3). A real link to WhatsApp with the
 * context's pre-filled text, in the DS icon-button look with WhatsApp green (G-20). Its lift above the buy bar,
 * its hiding under an open dialog and its laptop label are CSS (whatsapp-float.css and motion.css), so it renders
 * on the server with no client part. */

/** The support line's click-to-chat link and the chat's words, as content/en-IN/seller.ts gives them (fixture copy;
 *  the shell passes `seller.support.whatsapp`, which is config's SUPPORT_WHATSAPP_HREF, and `seller.chat`). A number
 *  unlike the real one, so a test can tell where the link's number comes from. */
const HREF = "https://wa.me/910000000001";
const CHAT: Omit<SupportChat, "number"> = {
  label: "Chat with us on WhatsApp",
  shortLabel: "Chat with us on WhatsApp",
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
  it("is the D050 address: the support line's own wa.me link, then the context's text, encoded", () => {
    expect(whatsAppChatUrl(HREF, CHAT.texts.site)).toBe("https://wa.me/910000000001?text=Hi%20Kheelona!%20I%20have%20a%20question%20about%20Kheelu.");
    expect(whatsAppChatUrl(HREF, CHAT.texts.store)).toBe("https://wa.me/910000000001?text=Hi%20Kheelona!%20I%20need%20help%20with%20my%20pre-order.");
    expect(whatsAppChatUrl(HREF, CHAT.texts.thanks)).toBe(
      "https://wa.me/910000000001?text=Hi%20Kheelona!%20I%20have%20a%20question%20about%20my%20order.",
    );
  });

  it("decodes back to exactly the content's words", () => {
    for (const context of ["site", "store", "thanks"] as const) {
      expect(new URL(whatsAppChatUrl(HREF, CHAT.texts[context])).searchParams.get("text")).toBe(CHAT.texts[context]);
    }
  });

  it("refuses a link that already carries a query (the text would not be the only parameter)", () => {
    expect(() => whatsAppChatUrl("https://wa.me/910000000001?text=x" as typeof HREF, CHAT.texts.site)).toThrow(/query/);
  });
});

describe("WhatsAppFloat", () => {
  it("is one real link named for screen readers, opening WhatsApp in a new tab", () => {
    render(<WhatsAppFloat href={HREF} chat={CHAT} context="site" />);
    const link = screen.getByRole("link", { name: "Chat with us on WhatsApp" });
    expect(link).toHaveAttribute("href", whatsAppChatUrl(HREF, CHAT.texts.site));
    // The number is the support line's (config), never a second copy of it.
    expect(link.getAttribute("href")).toMatch(/^https:\/\/wa\.me\/910000000001\?text=/);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("wears the DS large icon button with the bubble's own hook, and says which CTA it is", () => {
    render(<WhatsAppFloat href={HREF} chat={CHAT} context="site" />);
    const link = screen.getByRole("link");
    expect(link.className.split(/\s+/)).toEqual(["kh-iconbtn", "kh-iconbtn--l", "ks-wa"]);
    expect(link).toHaveAttribute("data-ph-capture-attribute-cta", "whatsapp-float");
  });

  it("draws the DS whatsapp-logo icon, hidden from screen readers", () => {
    const { container } = render(<WhatsAppFloat href={HREF} chat={CHAT} context="site" />);
    const svg = container.querySelector("a > svg.kh-icon");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg?.querySelector("path")).toHaveAttribute("d", ICON_WHATSAPP_LOGO);
  });

  it("carries the laptop label as hidden-from-readers text (the link's name says it already)", () => {
    const { container } = render(<WhatsAppFloat href={HREF} chat={CHAT} context="site" />);
    const label = container.querySelector("a > .ks-wa__label");
    expect(label).toHaveTextContent(CHAT.shortLabel);
    expect(label).toHaveClass("kh-label-s");
    expect(label).toHaveAttribute("aria-hidden", "true");
  });

  /* Task 3.6 item 17 (P13 default): with the site's own words, the laptop label reads the link's name, so what a
     sighted keyboard or voice user sees is what the link is called (WCAG 2.5.3, label in name). */
  it("with the content's words: the laptop label reads the link's accessible name, 'Chat with us on WhatsApp'", () => {
    const { container } = render(<WhatsAppFloat href={seller.support.whatsapp} chat={seller.chat} context="site" />);
    const link = screen.getByRole("link", { name: seller.chat.label });
    expect(container.querySelector(".ks-wa__label")?.textContent).toBe(seller.chat.shortLabel);
    expect(link).toHaveAccessibleName("Chat with us on WhatsApp");
    expect(container.querySelector(".ks-wa__label")).toHaveTextContent("Chat with us on WhatsApp");
  });

  it.each(["site", "store", "thanks"] as const)("uses the %s text", (context) => {
    render(<WhatsAppFloat href={HREF} chat={CHAT} context={context} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", whatsAppChatUrl(HREF, CHAT.texts[context]));
  });

  it("keeps PostHog autocapture off the bubble on /thanks only (inventory row 18)", () => {
    const { rerender } = render(<WhatsAppFloat href={HREF} chat={CHAT} context="thanks" />);
    expect(screen.getByRole("link")).toHaveClass("ph-no-capture");
    expect(screen.getByRole("link")).toHaveAttribute("data-ph-capture-attribute-cta", "whatsapp-float");
    for (const context of ["site", "store"] as const) {
      rerender(<WhatsAppFloat href={HREF} chat={CHAT} context={context} />);
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

  it("sits fixed at the bottom right: space-4 plus the safe areas on phones, space-5 from 900 px", () => {
    const base = rule(".ks-wa");
    expect(base).toContain("position: fixed");
    // The right offset adds the right inset (architecture §5.3, task 3.6): a phone held sideways has one.
    expect(base).toContain("right: calc(var(--space-4) + env(safe-area-inset-right))");
    expect(base).toContain("bottom: calc(var(--space-4) + env(safe-area-inset-bottom))");
    expect(base).toContain("margin: 0");
    expect(base).toContain("box-shadow: var(--shadow-lift)");
    const laptop = /@media \(min-width: 900px\)\s*\{([\s\S]*?)\n\}/.exec(CSS)?.[1] ?? "";
    expect(rule(".ks-wa", laptop)).toContain("right: calc(var(--space-5) + env(safe-area-inset-right))");
    expect(rule(".ks-wa", laptop)).toContain("bottom: var(--space-5)");
  });

  /* Architecture §5.3 (task 3.6 item 16): the buy bar's height already holds the bottom inset (its safe-area padding,
     G-09), and the bubble already sits that inset above the edge, so the lift is the bar's height less the inset: on a
     notched phone the bubble stays space-4 above the bar, as everywhere else (D050). */
  it("lifts by the bar's height less the bottom inset while the bar shows (motion.css)", () => {
    const motion = readFileSync("src/motion/motion.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(rule('html[data-buybar="shown"] .ks-wa', motion)).toBe(
      "transform: translateY(calc((var(--ks-buybar-h, 0px) - env(safe-area-inset-bottom)) * -1));",
    );
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
