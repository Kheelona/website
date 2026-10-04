import { render, screen } from "@testing-library/react";
import { Hero, HERO_LEAD, HERO_TICKS } from "./Hero";
import { STORE_URL, RESERVE_LABEL } from "@/config/site";
import { KHEELU_ART } from "@/lib/kheelu-art";
import { hasVideoMoments } from "@/lib/video-moments";

describe("Hero (CMO merge, 2026-10-04)", () => {
  it("renders the sales-first H1 in its two lines", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Screens make children watch\.[\s\S]*Kheelu makes them think\./,
      }),
    ).toBeInTheDocument();
  });

  /* Founder decision 4: research-anchored. Conversation helps a brain grow;
     Kheelu gives a child more of it. Never "Kheelu grows the brain". */
  it("words the brain claim through conversation, never as Kheelu's own effect", () => {
    render(<Hero />);
    expect(screen.getByText(HERO_LEAD)).toBeInTheDocument();
    expect(HERO_LEAD).toMatch(/conversation that helps a young brain grow/);
    expect(HERO_LEAD).not.toMatch(/Kheelu (helps|grows|builds|develops)[^.]*brain/i);
  });

  it("keeps the priority Kheelu artwork as the LCP element", () => {
    render(<Hero />);
    const art = screen.getByAltText(KHEELU_ART.alt);
    expect(art).toHaveAttribute("src", KHEELU_ART.src);
    expect(art).toHaveAttribute("data-priority", "true");
  });

  it("reserves in one tap, with the hero cta value", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: RESERVE_LABEL });
    expect(cta).toHaveAttribute("href", STORE_URL);
    expect(cta).toHaveAttribute("data-ph-capture-attribute-cta", "hero");
  });

  it("offers the films only when there are films to watch (§8.37-d)", () => {
    render(<Hero />);
    const watch = screen.queryByRole("link", { name: /Watch a child meet Kheelu/ });
    if (hasVideoMoments()) expect(watch).toHaveAttribute("href", "#watch");
    else expect(watch).toBeNull();
  });

  /* Kept from V6: the 500-unit urgency on a lifted card, one clause per line
     (founder, 2026-08-23). The mockup's caption alone would bury it. */
  it("keeps the offer card with the unit cap, one clause per line", () => {
    render(<Hero />);
    const clause = screen.getByText(/₹499 reserves one of the first 500 units at ₹4,999/i);
    expect(clause.className).toContain("block");
    const card = clause.closest("p")!;
    expect(card.className).toContain("bg-white");
    expect(card.textContent).toContain("₹7,999 once they are gone.");
  });

  it("lists the four ticks, the language count derived from config", () => {
    render(<Hero />);
    for (const t of HERO_TICKS) expect(screen.getByText(t)).toBeInTheDocument();
    expect(HERO_TICKS[1]).toBe("8 home languages");
  });

  it("carries Kheelu's own age band", () => {
    render(<Hero />);
    expect(screen.getByText(/Ages 3\+/)).toBeInTheDocument();
  });

  /* CMO merge (2026-10-04): the guide is retired; the hero greets no one. */
  it("feeds no guide", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section")!;
    expect(section).not.toHaveAttribute("data-guide");
    expect(section).not.toHaveAttribute("data-say");
  });
});
