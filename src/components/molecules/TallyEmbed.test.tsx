import { render, screen } from "@testing-library/react";
import { TallyEmbed } from "./TallyEmbed";
import { readFileSync } from "node:fs";

// The launch price string (mirrors LAUNCH_PRICE in @/config/site). Inlined
// because vite-tsconfig-paths does not apply the "@/" alias to imports that
// originate in test files (tsconfig excludes **/*.test.tsx).
const LAUNCH_PRICE = "₹4,999";

describe("TallyEmbed", () => {
  // NEXT_PUBLIC_TALLY_FORM_URL is unset in the test env, so the component
  // is unconfigured and must render the flagged placeholder, never an iframe.
  it("renders the placeholder panel when the form URL is not configured", () => {
    render(<TallyEmbed />);
    expect(
      screen.getByText("The pre-order list opens here soon."),
    ).toBeInTheDocument();
  });

  it("shows the price-hold reassurance with the launch price", () => {
    render(<TallyEmbed />);
    expect(
      screen.getByText(new RegExp(`${LAUNCH_PRICE} held for you`)),
    ).toBeInTheDocument();
  });

  it("does not mount the form iframe while unconfigured", () => {
    const { container } = render(<TallyEmbed />);
    expect(container.querySelector("iframe")).toBeNull();
  });

  /* The form is 886px tall (measured on the live embed, 6 fields + Submit).
     A shorter iframe hides the submit button behind an inner scroll, which is
     invisible to most people. This asserts the height stays above the form. */
  it("gives the iframe enough height to show the submit button", () => {
    // jsdom gives import.meta.url an http:// base, so resolve from the Vitest root.
    const cls = readFileSync(
      `${process.cwd()}/src/components/molecules/TallyEmbed.tsx`,
      "utf8",
    );
    const m = cls.match(/className="h-\[(\d+)px\] w-full"/);
    expect(m, "iframe height class not found in TallyEmbed.tsx").toBeTruthy();
    expect(Number(m![1])).toBeGreaterThanOrEqual(900);
  });
});
