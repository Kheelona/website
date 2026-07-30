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

  /* The live embed measures 827px after the founder's 5-field edit
     (2026-07-31; was 886px with 6 fields). A shorter iframe hides the submit
     button behind an inner scroll, which is invisible to most people. This
     asserts the height stays above the form with room for validation
     messages. */
  it("gives the iframe enough height to show the submit button", () => {
    const cls = readFileSync(
      `${process.cwd()}/src/components/molecules/TallyEmbed.tsx`,
      "utf8",
    );
    const m = cls.match(/className="h-\[(\d+)px\] w-full"/);
    expect(m, "iframe height class not found in TallyEmbed.tsx").toBeTruthy();
    expect(Number(m![1])).toBeGreaterThanOrEqual(860);
  });
});
