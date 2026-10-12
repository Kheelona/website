import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Logo, logoImage } from "./Logo";

vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: ({ href, children, ...rest }: { href: string; children?: React.ReactNode } & Record<string, unknown>) =>
      React.createElement("a", { href, "data-next-link": "", ...rest }, children),
  };
});

describe("Logo", () => {
  it("renders the nav logo as partials/nav.html does: the DS file in a home link, 30 px tall", () => {
    const { container } = render(<Logo href="/" alt="Kheelona, home" />);
    const link = screen.getByRole("link", { name: "Kheelona, home" });
    expect(link.className).toBe("kh-logo-link");
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveAttribute("data-next-link");
    const img = container.querySelector("img")!;
    expect(img.className).toBe("kh-logo");
    expect(img.getAttribute("src")).toMatch(/kheelona-logo\.svg$/);
    expect(img).toHaveAttribute("height", "30");
  });

  it("renders the footer logo as partials/footer.html does: no link", () => {
    const { container } = render(<Logo alt="Kheelona" />);
    expect(container.querySelector("a")).toBeNull();
    expect(screen.getByRole("img", { name: "Kheelona" })).toHaveClass("kh-logo");
  });

  it("renders the store header's logo as store.html does: a plain link to the site, named on the link", () => {
    render(<Logo href="https://kheelona.com" linkLabel="Kheelona home" alt="Kheelona" />);
    const link = screen.getByRole("link", { name: "Kheelona home" });
    expect(link).toHaveAttribute("href", "https://kheelona.com");
    expect(link).not.toHaveAttribute("data-next-link");
  });

  /* Task 2.12: "//host" (or "/\host") is another site's address, however it starts; only a single slash is a site path. */
  it("treats a protocol-relative address as another site's: a plain link, never next/link", () => {
    render(
      <>
        <Logo href="//kheelona.com" linkLabel="Kheelona home" alt="Kheelona" />
        <Logo href={"/\\kheelona.com"} linkLabel="Kheelona home, backslash" alt="Kheelona" />
      </>,
    );
    const link = screen.getByRole("link", { name: "Kheelona home" });
    expect(link).toHaveAttribute("href", "//kheelona.com");
    expect(link).not.toHaveAttribute("data-next-link");
    expect(screen.getByRole("link", { name: "Kheelona home, backslash" })).not.toHaveAttribute("data-next-link");
  });

  it("takes another height", () => {
    render(<Logo alt="Kheelona" height={40} />);
    expect(screen.getByRole("img")).toHaveAttribute("height", "40");
  });
});

describe("logoImage", () => {
  it("reserves the logo's width from the size Next reads off the file, so nothing shifts while it loads", () => {
    expect(logoImage({ src: "/_next/static/media/kheelona-logo.svg", width: 172, height: 54 }, 30)).toEqual({
      src: "/_next/static/media/kheelona-logo.svg",
      width: 96,
    });
  });

  it("takes a bare URL (Vite, in Storybook and tests) and leaves the width to the browser", () => {
    expect(logoImage("/design-system/project/assets/Logo/kheelona-logo.svg", 30)).toEqual({
      src: "/design-system/project/assets/Logo/kheelona-logo.svg",
      width: undefined,
    });
  });
});
