import { render, screen } from "@testing-library/react";
import postcss, { type Rule } from "postcss";
import { describe, expect, it } from "vitest";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { HelpLine } from "./HelpLine";

const icon = <svg className="kh-icon" data-icon="whatsapp-logo" aria-hidden="true" />;
/* The contact slot takes RichText on the pages ("[WhatsApp](https://wa.me/…) or [{nowrap:call …}](tel:…)"). */
const contact = (
  <>
    <a href="https://wa.me/919187546483">WhatsApp</a> or <a href="tel:+919187546483">call +91 91875 46483</a>
  </>
);

describe("HelpLine", () => {
  it("renders the help line as home.html fold 1 does: p.kh-body-s.ks-help > icon, lead, contact", () => {
    const { container } = render(<HelpLine icon={icon} lead="Questions?" contact={contact} />);
    const p = container.firstElementChild as HTMLElement;
    expect(p.tagName).toBe("P");
    expect(p.className).toBe("kh-body-s ks-help");
    expect(p.firstElementChild?.getAttribute("data-icon")).toBe("whatsapp-logo");
    expect(p.textContent).toBe(" Questions? WhatsApp or call +91 91875 46483");
  });

  it("keeps both ways to reach a person as real links", () => {
    render(<HelpLine icon={icon} lead="Questions?" contact={contact} />);
    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", "https://wa.me/919187546483");
    expect(screen.getByRole("link", { name: "call +91 91875 46483" })).toHaveAttribute("href", "tel:+919187546483");
  });

  it.each([
    [undefined, "kh-body-s ks-help"],
    ["body-s", "kh-body-s ks-help"],
    ["body", "kh-body ks-help"],
    ["body-l", "kh-body-l ks-help"],
  ] as const)("size %s sets the DS body step %s (one step only: tokens.css puts kh-body-s after kh-body)", (size, classes) => {
    const { container } = render(<HelpLine size={size} lead="Questions?" contact={contact} />);
    expect((container.firstElementChild as HTMLElement).className).toBe(classes);
  });

  it("renders /thanks' help line exactly as store-confirmation.html:129: kh-body, the icon, then the links and the words after them, no lead", () => {
    const svg = '<svg class="kh-icon" aria-hidden="true"></svg>';
    const { container } = render(
      <HelpLine
        size="body"
        icon={<svg className="kh-icon" aria-hidden="true" />}
        contact={
          <>
            <a href="https://wa.me/919187546483">WhatsApp</a> or{" "}
            <a href="tel:+919187546483" className="ks-nowrap">
              call +91 91875 46483
            </a>
            , quoting your order number, or email <a href="mailto:hello@kheelona.com">hello@kheelona.com</a>.
          </>
        }
      />,
    );
    expect(container.innerHTML).toBe(
      `<p class="kh-body ks-help">${svg} <a href="https://wa.me/919187546483">WhatsApp</a> or <a href="tel:+919187546483" class="ks-nowrap">call +91 91875 46483</a>, quoting your order number, or email <a href="mailto:hello@kheelona.com">hello@kheelona.com</a>.</p>`,
    );
  });

  it("renders /setup's contact line exactly as setup.html:112: kh-body-l, no icon, no lead, the page's class last", () => {
    const { container } = render(
      <HelpLine
        size="body-l"
        className="ks-setup-help"
        contact={
          <>
            <a href="https://wa.me/919187546483">WhatsApp</a> or{" "}
            <a href="tel:+919187546483">
              call us on <span className="ks-nowrap">+91 91875 46483</span>
            </a>
            , or email <a href="mailto:hello@kheelona.com">hello@kheelona.com</a>. Tell us your order number, and what you see on Kheelu and in the app.
          </>
        }
      />,
    );
    expect(container.innerHTML).toBe(
      `<p class="kh-body-l ks-help ks-setup-help"><a href="https://wa.me/919187546483">WhatsApp</a> or <a href="tel:+919187546483">call us on <span class="ks-nowrap">+91 91875 46483</span></a>, or email <a href="mailto:hello@kheelona.com">hello@kheelona.com</a>. Tell us your order number, and what you see on Kheelu and in the app.</p>`,
    );
  });

  it("prints no stray space without a lead: none at the start, and one only after the icon", () => {
    const bare = render(<HelpLine contact={contact} />).container.firstElementChild as HTMLElement;
    expect(bare.textContent).toBe("WhatsApp or call +91 91875 46483");
    const withIcon = render(<HelpLine icon={icon} contact={contact} />).container.firstElementChild as HTMLElement;
    expect(withIcon.textContent).toBe(" WhatsApp or call +91 91875 46483");
  });

  it("keeps a lead and its one space on the body-size lines (setup.html:117: no icon, kh-body)", () => {
    const { container } = render(
      <HelpLine size="body" lead="Don’t have Kheelu yet?" contact={<a href="/meet-kheelu">Meet Kheelu</a>} className="ks-setup-meet" />,
    );
    expect(container.innerHTML).toBe(`<p class="kh-body ks-help ks-setup-meet">Don’t have Kheelu yet? <a href="/meet-kheelu">Meet Kheelu</a></p>`);
  });

  it("renders without an icon in the store header, with the header's own class", () => {
    const { container } = render(<HelpLine lead="Need help?" contact={contact} className="ks-store-head__help" />);
    const p = container.firstElementChild as HTMLElement;
    expect(p.className).toBe("kh-body-s ks-help ks-store-head__help");
    expect(p.querySelector("svg")).toBeNull();
    expect(p.textContent).toBe("Need help? WhatsApp or call +91 91875 46483");
  });
});

/* Task Q2.14 (tasks.md SPA 4; first-screen.spec.ts "tap targets"): a help line's one link ("Questions? Message us on
   WhatsApp.", every close's and the store's) is a 44 x 44 target by its own padding, --space-3 above and below its words
   (no bigger font). A line with two links (/thanks, /setup's contact line) keeps the 28 px link box of task 7.1a, so a
   link's area never lies over the words of the link on the line above it. The rules are read from help-line.css and
   matched against the rendered lines. */
describe("HelpLine: the tap target", () => {
  const rules = new Map<string, Record<string, string>>();
  postcss.parse(readRepoFile("src/components/ui/HelpLine/help-line.css")).walkRules((rule: Rule) => {
    for (const selector of rule.selectors) {
      const decls: Record<string, string> = { ...rules.get(selector) };
      rule.walkDecls((decl) => void (decls[decl.prop] = decl.value));
      rules.set(selector, decls);
    }
  });
  /** The padding a link gets from the last rule that matches it, as the cascade gives it (equal origin, later wins). */
  const paddingOf = (link: Element) => [...rules].filter(([selector, decls]) => link.matches(selector) && decls["padding-block"]).at(-1)?.[1];

  it("pads a help line's one link to a 44 px target with DS space tokens, its reach --space-3 above and below", () => {
    const { container } = render(
      <HelpLine
        icon={icon}
        lead="Questions?"
        contact={
          <>
            <a href="https://wa.me/919187546483">Message us on WhatsApp</a>.
          </>
        }
      />,
    );
    const link = container.querySelector("a")!;
    expect(paddingOf(link)).toEqual({ "padding-block": "var(--space-3)", "margin-block": "calc(var(--space-3) * -1)" });
  });

  it("keeps the 28 px link box on a line with two links, whose areas would lie over each other's words (task 7.1a)", () => {
    const { container } = render(
      <HelpLine
        size="body"
        contact={
          <>
            <a href="https://wa.me/919187546483">Message us on WhatsApp</a>, quoting your order number, or email{" "}
            <a href="mailto:hello@kheelona.com">hello@kheelona.com</a>.
          </>
        }
      />,
    );
    for (const link of container.querySelectorAll("a")) {
      expect(paddingOf(link), link.textContent!).toMatchObject({ "padding-block": "var(--space-1)", "margin-block": "calc(var(--space-1) * -1)" });
    }
  });
});
