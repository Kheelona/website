import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { seller } from "@/content/en-IN/seller";
import { NotFoundPanel } from "./NotFoundPanel";

/* NotFoundPanel's props added after the freeze tag (task 7.1c; CMO review C m4 and the 7.1c copy review's m2).
 * NotFoundPanel.test.tsx is one of the six frozen checkout tests (ADR-013: zero diff, or a literal-only reviewed
 * patch), so no assertion can be added there; the props it never saw are held here. Both serve /thanks when a signed
 * link's order will not load: a muted line that carries a link (the call line's tel: number), and the whole panel
 * inside ph-no-capture, since it renders outside the order's container (tracking inventory row 18). */

describe("NotFoundPanel: a note that carries a link", () => {
  it("prints a node as the muted line, in the line's own paragraph", () => {
    render(
      <NotFoundPanel
        title="We cannot open that order right now."
        cta={false}
        note={
          <>
            Or <a href={seller.support.tel}>call {seller.support.phone}</a> with your order number and a person will find it.
          </>
        }
      />,
    );
    const line = document.querySelector("p.kh-body-s.ks-muted.ks-store-closed")!;
    expect(line.textContent).toBe(`Or call ${seller.support.phone} with your order number and a person will find it.`);
    expect(within(line as HTMLElement).getByRole("link", { name: `call ${seller.support.phone}` })).toHaveAttribute("href", seller.support.tel);
    expect(screen.queryByRole("link", { name: /message us on whatsapp/i })).toBeNull();
  });

  it("still takes a plain string, as the store page's not-configured state passes it", () => {
    render(<NotFoundPanel cta={false} note="We will reserve one for you by hand in the meantime." />);
    expect(document.querySelector("p.ks-store-closed")!.textContent).toBe("We will reserve one for you by hand in the meantime.");
  });
});

describe("NotFoundPanel: noCapture", () => {
  it("puts the whole panel inside ph-no-capture, so nothing in it reaches PostHog autocapture", () => {
    const { container } = render(<NotFoundPanel title="We cannot open that order right now." cta={false} noCapture />);
    const section = container.querySelector("section")!;
    expect(section.className).toBe("kh-section ph-no-capture");
    expect(section.querySelector("h1")!.closest(".ph-no-capture")).toBe(section);
    expect(section.querySelector("a")!.closest(".ph-no-capture")).toBe(section);
  });

  it("is off by default: the store's other panels keep their markup", () => {
    const { container } = render(<NotFoundPanel />);
    expect(container.querySelector("section")!.className).toBe("kh-section");
    expect(container.querySelector(".ph-no-capture")).toBeNull();
  });
});
