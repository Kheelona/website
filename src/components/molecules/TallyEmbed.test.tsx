import { render, screen } from "@testing-library/react";
import { TallyEmbed } from "./TallyEmbed";
import { readFileSync } from "node:fs";

describe("TallyEmbed", () => {
  /* V4-a (2026-07-31): the form URL is a public constant in config/site, so
     the REAL form renders by default — on the preview and locally too. The
     test env has no NEXT_PUBLIC_TALLY_FORM_URL, which is exactly the
     fall-through path being asserted. */
  it("renders the real form by default from the config constant", () => {
    const { container } = render(<TallyEmbed />);
    const iframe = container.querySelector("iframe")!;
    expect(iframe).toBeInTheDocument();
    expect(iframe.getAttribute("src")).toContain("https://tally.so/r/Y5XW7J");
    expect(iframe.getAttribute("src")).toContain("transparentBackground=1");
    expect(iframe).toHaveAttribute("title", "Reserve Lumi: the pre-order form");
    expect(
      screen.queryByText("The pre-order list opens here soon."),
    ).toBeNull();
  });

  it("offers the open-in-new-tab fallback pointing at the same form", () => {
    render(<TallyEmbed />);
    expect(screen.getByRole("link", { name: /Open it in a new tab/i })).toHaveAttribute(
      "href",
      "https://tally.so/r/Y5XW7J",
    );
  });

  it("degrades to the placeholder panel if the form URL is ever blanked", async () => {
    vi.resetModules();
    vi.doMock("@/config/site", async (importOriginal) => ({
      ...(await importOriginal<Record<string, unknown>>()),
      TALLY_FORM_URL: "",
    }));
    const { TallyEmbed: Unconfigured } = await import("./TallyEmbed");
    const { container } = render(<Unconfigured />);
    expect(
      screen.getByText("The pre-order list opens here soon."),
    ).toBeInTheDocument();
    expect(screen.getByText(/₹4,999 held for you/)).toBeInTheDocument();
    expect(container.querySelector("iframe")).toBeNull();
    vi.doUnmock("@/config/site");
    vi.resetModules();
  });

  /* Two failure modes, opposite directions, both real and both seen on this
     component. TOO SHORT hides the submit button behind an inner scroll most
     people never discover (the original 560px bug). TOO TALL leaves dead white
     space on the site's one conversion panel (the 900px bug the review team
     flagged). So the test brackets both sides of the content height, measured
     INSIDE the shipping iframe on 2026-07-31 (5-field form): submit bottom at
     609px in the 680px desktop frame, 627px in the 290px mobile frame. */
  it("brackets the iframe height around the measured form: tall enough to submit, tight enough to look built", () => {
    const cls = readFileSync(
      `${process.cwd()}/src/components/molecules/TallyEmbed.tsx`,
      "utf8",
    );
    const mobile = cls.match(/h-\[(\d+)px\]/);
    const desktop = cls.match(/sm:h-\[(\d+)px\]/);
    expect(mobile, "mobile iframe height not found").toBeTruthy();
    expect(desktop, "desktop iframe height not found").toBeTruthy();
    const m = Number(mobile![1]);
    const d = Number(desktop![1]);
    // clears the measured content plus room for validation messages
    expect(m).toBeGreaterThanOrEqual(680);
    expect(d).toBeGreaterThanOrEqual(660);
    // ...without reintroducing a field of empty white
    expect(m).toBeLessThanOrEqual(780);
    expect(d).toBeLessThanOrEqual(740);
    /* Mobile is the TALLER frame, which is counter-intuitive and therefore worth
       locking: the 290px mobile iframe wraps labels and fields onto more lines
       than the 680px desktop one, so the narrow form is the tall one. If someone
       "fixes" this by making desktop taller, the desktop panel grows a field of
       dead white again. */
    expect(m).toBeGreaterThan(d);
  });
});
