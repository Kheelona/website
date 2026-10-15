import postcss from "postcss";
import { renderToStaticMarkup } from "react-dom/server";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { Button } from "./Button";

/** The declarations of the top-level rule with exactly these selectors, in order. */
function declarations(path: string, selector: string): string[] {
  const out: string[] = [];
  postcss.parse(readRepoFile(path)).each((node) => {
    if (node.type === "rule" && node.selectors.join(", ") === selector) {
      node.each((d) => void (d.type === "decl" && out.push(`${d.prop}: ${d.value}`)));
    }
  });
  return out;
}

/* Internal paths go through next/link (client navigation between pages); this stand-in marks them so the
   test can tell a Link from a plain anchor. */
vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: ({ href, children, ...rest }: { href: string; children?: React.ReactNode } & Record<string, unknown>) =>
      React.createElement("a", { href, "data-next-link": "", ...rest }, children),
  };
});

const ARROW_PATH =
  "M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z";

describe("Button: markup ported from the mockup", () => {
  it("renders the Home hero CTA as home.html fold 1 does, the arrow carrying ks-btn__arrow", () => {
    // home.html:13, with the store URL for store.html and the D049 pick 6 hook on the arrow.
    const html = renderToStaticMarkup(
      <Button variant="cta" size="l" block id="hero-cta" href="https://store.kheelona.com" cta="hero" arrow>
        Pre-order Kheelu
      </Button>,
    );
    expect(html).toBe(
      '<a id="hero-cta" href="https://store.kheelona.com" class="kh-btn kh-btn--cta kh-btn--l kh-btn--block" data-ph-capture-attribute-cta="hero">' +
        "<span>Pre-order Kheelu</span>" +
        `<svg class="kh-icon ks-btn__arrow" viewBox="0 0 256 256" aria-hidden="true" focusable="false"><path d="${ARROW_PATH}"></path></svg>` +
        "</a>",
    );
  });

  it("renders the sticky-bar CTA without size, block or arrow (partials/buybar.html)", () => {
    const html = renderToStaticMarkup(
      <Button variant="cta" href="https://store.kheelona.com" cta="sticky-bar">
        Pre-order Kheelu
      </Button>,
    );
    expect(html).toBe(
      '<a href="https://store.kheelona.com" class="kh-btn kh-btn--cta" data-ph-capture-attribute-cta="sticky-bar"><span>Pre-order Kheelu</span></a>',
    );
  });

  it("renders a ghost link with a plain end arrow and a secondary CTA value (home.html:18), markup as the mockup", () => {
    const html = renderToStaticMarkup(
      <Button variant="ghost" href="/products/kheelu" iconEnd="arrow-right" cta="hero-learn">
        See how it works
      </Button>,
    );
    expect(html).toBe(
      '<a href="/products/kheelu" data-next-link="" class="kh-btn kh-btn--ghost" data-ph-capture-attribute-cta="hero-learn">' +
        "<span>See how it works</span>" +
        `<svg class="kh-icon" viewBox="0 0 256 256" aria-hidden="true" focusable="false"><path d="${ARROW_PATH}"></path></svg>` +
        "</a>",
    );
  });

  it("adds a composition class last (partials/nav.html: the laptop nav CTA)", () => {
    const { container } = render(
      <Button variant="cta" size="s" href="https://store.kheelona.com" cta="navbar" className="ks-nav-cta">
        Pre-order Kheelu
      </Button>,
    );
    expect(container.querySelector("a")!.className).toBe("kh-btn kh-btn--cta kh-btn--s ks-nav-cta");
  });
});

describe("Button: variants and sizes", () => {
  it.each([
    ["primary", "kh-btn kh-btn--primary"],
    ["secondary", "kh-btn kh-btn--secondary"],
    ["ghost", "kh-btn kh-btn--ghost"],
    ["danger", "kh-btn kh-btn--danger"],
  ] as const)("%s", (variant, cls) => {
    render(<Button variant={variant}>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" }).className).toBe(cls);
  });

  it("defaults to the DS default, secondary", () => {
    render(<Button>Cancel</Button>);
    expect(screen.getByRole("button", { name: "Cancel" }).className).toBe("kh-btn kh-btn--secondary");
  });

  it.each([
    ["s", "kh-btn kh-btn--secondary kh-btn--s"],
    ["m", "kh-btn kh-btn--secondary"],
    ["l", "kh-btn kh-btn--secondary kh-btn--l"],
  ] as const)("size %s", (size, cls) => {
    render(<Button size={size}>Go</Button>);
    expect(screen.getByRole("button").className).toBe(cls);
  });

  it("block makes it full width", () => {
    render(<Button block>Go</Button>);
    expect(screen.getByRole("button")).toHaveClass("kh-btn--block");
  });

  it("puts a start icon before the label", () => {
    const { container } = render(
      <Button variant="secondary" icon="whatsapp-logo">
        WhatsApp us
      </Button>,
    );
    const kids = [...container.querySelector("button")!.children].map((el) => el.tagName.toLowerCase());
    expect(kids).toEqual(["svg", "span"]);
  });
});

describe("Button: as a button or a link", () => {
  it("is a type=button by default, and takes submit", () => {
    const { rerender } = render(<Button>Go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    rerender(<Button type="submit">Go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("routes a site path through next/link and leaves other addresses as plain anchors", () => {
    render(
      <>
        <Button href="/safety">Safety</Button>
        <Button href="#faq">FAQ</Button>
        <Button href="https://store.kheelona.com">Store</Button>
      </>,
    );
    expect(screen.getByRole("link", { name: "Safety" })).toHaveAttribute("data-next-link");
    expect(screen.getByRole("link", { name: "FAQ" })).not.toHaveAttribute("data-next-link");
    expect(screen.getByRole("link", { name: "Store" })).not.toHaveAttribute("data-next-link");
  });

  /* Task 2.12: only a single leading slash is a site path. A browser reads "//host/path" (and "/\host/path", whose
     backslash it turns into a slash) as another site's address, so neither may go through next/link. */
  it("treats a protocol-relative address as another site's: a plain anchor, never next/link", () => {
    render(
      <>
        <Button href="//store.kheelona.com/thanks">Thanks</Button>
        <Button href={"/\\store.kheelona.com/thanks"}>Backslash</Button>
        <Button href="/">Home</Button>
      </>,
    );
    const thanks = screen.getByRole("link", { name: "Thanks" });
    expect(thanks).toHaveAttribute("href", "//store.kheelona.com/thanks");
    expect(thanks).not.toHaveAttribute("data-next-link");
    expect(screen.getByRole("link", { name: "Backslash" })).not.toHaveAttribute("data-next-link");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("data-next-link");
  });

  /* Task 8c.5 (the 8c merge's follow-up): a link that leaves the site for an app, such as D061's share link to WhatsApp,
     opens in a new tab with rel="noopener", as the D050 bubble does (WhatsAppFloat). Without `target` a link opens in
     place and carries neither attribute. */
  it("opens a link in a new tab with rel=noopener when target is _blank, a plain anchor or next/link alike", () => {
    render(
      <>
        <Button variant="ghost" href="https://wa.me/?text=hi" target="_blank" cta="share-whatsapp">
          Share
        </Button>
        <Button href="/safety" target="_blank">
          Safety
        </Button>
        <Button href="https://store.kheelona.com">Store</Button>
      </>,
    );
    const share = screen.getByRole("link", { name: "Share" });
    expect(share).toHaveAttribute("target", "_blank");
    expect(share).toHaveAttribute("rel", "noopener");
    expect(share).toHaveAttribute("data-ph-capture-attribute-cta", "share-whatsapp");
    const safety = screen.getByRole("link", { name: "Safety" });
    expect(safety).toHaveAttribute("data-next-link");
    expect(safety).toHaveAttribute("target", "_blank");
    expect(safety).toHaveAttribute("rel", "noopener");
    const store = screen.getByRole("link", { name: "Store" });
    expect(store).not.toHaveAttribute("target");
    expect(store).not.toHaveAttribute("rel");
  });

  it("is reached by the keyboard in order, as a link or a button; a disabled or loading button is skipped", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Button variant="cta" cta="hero" href="https://store.kheelona.com" arrow>
          Pre-order Kheelu
        </Button>
        <Button disabled>Off</Button>
        <Button loading>Saving</Button>
        <Button variant="ghost" href="/products/kheelu">
          See how it works
        </Button>
      </>,
    );
    await user.tab();
    expect(screen.getByRole("link", { name: "Pre-order Kheelu" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "See how it works" })).toHaveFocus();
  });

  it("names a button by its label alone: the icons are hidden", () => {
    render(
      <Button variant="secondary" icon="whatsapp-logo" iconEnd="arrow-right">
        Message on WhatsApp
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Message on WhatsApp" })).toBeInTheDocument();
  });

  it("forwards disabled", () => {
    render(<Button disabled>Go</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("while loading: keeps the label, shows the DS spinner instead of the icons, is busy and disabled", () => {
    const { container } = render(
      <Button variant="primary" icon="check" iconEnd="arrow-right" loading>
        Saving
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Saving" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("kh-btn--loading");
    expect(container.querySelector(".kh-spinner-wrap .kh-spinner")).not.toBeNull();
    expect(container.querySelectorAll(".kh-icon")).toHaveLength(0);
  });
});

describe("Button: CTA tracking value (architecture §8.3)", () => {
  it("writes no tracking attribute when no cta is given", () => {
    render(<Button href="/team">Team</Button>);
    expect(screen.getByRole("link")).not.toHaveAttribute("data-ph-capture-attribute-cta");
  });

  it("refuses a chilli button without a CTA value at run time too", () => {
    // A JavaScript caller (or a cast) can skip the type; the button refuses to render rather than ship an untagged chilli button.
    const props = { variant: "cta", href: "https://store.kheelona.com", children: "Pre-order Kheelu" } as unknown as Parameters<typeof Button>[0];
    expect(() => renderToStaticMarkup(<Button {...props} />)).toThrow(/needs a pre-order CTA value/);
  });

  it("refuses a secondary value on a chilli button", () => {
    expect(() =>
      renderToStaticMarkup(
        <Button variant="cta" href="https://store.kheelona.com" cta="hero-learn">
          Pre-order Kheelu
        </Button>,
      ),
    ).toThrow(/"hero-learn" is a secondary value/);
  });

  it("refuses a pre-order value on a button that is not chilli", () => {
    expect(() =>
      renderToStaticMarkup(
        <Button variant="ghost" href="/products/kheelu" cta="hero">
          See how it works
        </Button>,
      ),
    ).toThrow(/"hero" is a pre-order value/);
  });

  it("refuses the WhatsApp bubble's value and any unregistered value", () => {
    expect(() =>
      renderToStaticMarkup(
        <Button variant="secondary" href="https://wa.me/919187546483" cta="whatsapp-float">
          Chat
        </Button>,
      ),
    ).toThrow(/"whatsapp-float"/);
    const unknown = { variant: "ghost", href: "/", cta: "compare", children: "x" } as unknown as Parameters<typeof Button>[0];
    expect(() => renderToStaticMarkup(<Button {...unknown} />)).toThrow(/"compare" is not a CTA value an element may carry/);
  });
});

describe("Button CSS", () => {
  it("ports mockup.css's ghost rule verbatim onto .kh-btn--ghost (mockup.css:135: a long ghost label wraps on a 360 px phone)", () => {
    const ported = declarations("src/components/ui/Button/button.css", ".kh-btn--ghost");
    expect(ported.length).toBeGreaterThan(0);
    expect(ported).toEqual(declarations("mockup/mockup.css", ".kh-btn--ghost"));
  });
});
