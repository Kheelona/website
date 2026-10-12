import { render } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it, vi } from "vitest";
import { Avatar } from "./Avatar";

/* Avatar (task 2.3; DS Avatar kh-avatar, bundle.css:1109-1113 and bundle.js Avatar). Approved markup (team.html:44):
   `<span class="kh-avatar kh-avatar--xl kh-tone-sun" aria-hidden="true"><span>AS</span></span>`, initials beside the
   founder's visible name. Rendered through the real next/image. */
vi.unmock("next/image");

const span = (c: HTMLElement) => c.firstElementChild as HTMLElement;

describe("Avatar: initials", () => {
  it("beside a visible name: the team page's badge, hidden from assistive technology (no name read twice)", () => {
    const { container } = render(<Avatar initials="AS" size="xl" tone="sun" />);
    expect(span(container).tagName.toLowerCase()).toBe("span");
    expect(span(container).className).toBe("kh-avatar kh-avatar--xl kh-tone-sun");
    expect(span(container)).toHaveAttribute("aria-hidden", "true");
    expect(span(container)).not.toHaveAttribute("role");
    expect(span(container).innerHTML).toBe("<span>AS</span>");
  });

  it("standing alone: one image named by its label, as the DS does", () => {
    const { container } = render(<Avatar initials="KC" label="Kashyap" />);
    expect(span(container)).toHaveAttribute("role", "img");
    expect(span(container)).toHaveAttribute("aria-label", "Kashyap");
    expect(span(container)).not.toHaveAttribute("aria-hidden");
    expect(span(container).firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(span(container).firstElementChild).toHaveTextContent("KC");
  });

  it.each([
    ["the DS default: m, Kheelu Blue", {}, "kh-avatar kh-tone-blue"],
    ["s", { size: "s" as const }, "kh-avatar kh-avatar--s kh-tone-blue"],
    ["l in Chilli", { size: "l" as const, tone: "chilli" as const }, "kh-avatar kh-avatar--l kh-tone-chilli"],
    ["with a section class", { className: "ks-founder__avatar" }, "kh-avatar kh-tone-blue ks-founder__avatar"],
  ])("%s", (_name, props, classes) => {
    expect(span(render(<Avatar initials="AS" {...props} />).container).className).toBe(classes);
  });
});

describe("Avatar: photo (founders' photos once supplied, B24)", () => {
  const PHOTO = { src: { src: "/_next/static/media/aman.jpg", width: 600, height: 750 } as StaticImageData, alt: "" };

  it("holds the photo through next/image, with its alt text and sizes, lazily", () => {
    const { container } = render(<Avatar image={PHOTO} sizes="96px" size="xl" />);
    const img = span(container).querySelector("img")!;
    expect(span(container).className).toBe("kh-avatar kh-avatar--xl kh-tone-blue");
    expect(span(container)).not.toHaveAttribute("role");
    expect(span(container)).not.toHaveAttribute("aria-hidden");
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("sizes", "96px");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("names a photo that stands alone through its alt text", () => {
    const { container } = render(<Avatar image={{ ...PHOTO, alt: "Aman Soni" }} sizes="48px" />);
    expect(container.querySelector("img")).toHaveAttribute("alt", "Aman Soni");
  });
});
