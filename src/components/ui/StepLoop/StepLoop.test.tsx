import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StepLoop } from "./StepLoop";

const THREE = [
  { title: "Check your email", body: "Your confirmation has your order number.", tone: "sun" },
  { title: "Pay the balance", body: "We send a payment link on WhatsApp.", tone: "blue" },
  { title: "Track your delivery", body: "We send the courier details.", tone: "chilli" },
] as const;
const FOUR = [
  { title: "Open the parent app.", body: "Follow the steps on screen.", tone: "sun" },
  { title: "Press and hold the button.", body: "Hold it for 3 seconds.", tone: "blue" },
  { title: "Join Kheelu’s own Wi‑Fi.", body: "Connect your phone to it.", tone: "chilli" },
  { title: "Add your home Wi‑Fi.", body: "Finish in the app.", tone: "sun" },
] as const;
const list = (ui: React.ReactElement) => render(ui).container.firstElementChild as HTMLElement;

describe("StepLoop", () => {
  it("renders the DS step loop as store-confirmation.html does: ol.kh-steps > li.kh-step.kh-tone-* > num, h3, p", () => {
    const ol = list(<StepLoop steps={THREE} />);
    expect(ol.tagName).toBe("OL");
    expect(ol.className).toBe("kh-steps");
    const items = [...ol.children];
    expect(items.map((li) => li.className)).toEqual(["kh-step kh-tone-sun", "kh-step kh-tone-blue", "kh-step kh-tone-chilli"]);
    expect(items[1].innerHTML).toBe(
      '<span class="kh-step__num" aria-hidden="true">2</span><h3 class="kh-step__title">Pay the balance</h3><p class="kh-step__body">We send a payment link on WhatsApp.</p>',
    );
  });

  it("numbers the steps for sight only; the ordered list carries the order for screen readers", () => {
    render(<StepLoop steps={THREE} />);
    expect(screen.getByRole("list").tagName).toBe("OL");
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(["Check your email", "Pay the balance", "Track your delivery"]);
    expect([...document.querySelectorAll(".kh-step__num")].every((n) => n.getAttribute("aria-hidden") === "true")).toBe(true);
  });

  it("leaves the tone off a step that has none (the guide's five checks)", () => {
    const ol = list(<StepLoop variant="checks" steps={[{ title: "Does it have a screen?", body: "A screen gives your child something to watch." }]} />);
    expect(ol.firstElementChild?.className).toBe("kh-step");
  });

  it.each([
    ["loop", THREE, "kh-steps"],
    ["checks", THREE, "kh-steps ks-steps--checks"],
    ["four", FOUR, "kh-steps ks-steps--four"],
  ] as const)("the %s variant carries %s", (variant, steps, classes) => {
    expect(list(<StepLoop variant={variant} steps={steps} />).className).toBe(classes);
  });

  it("refuses the four-step layout with any other number of steps (its two-by-two rows assume four)", () => {
    expect(() => render(<StepLoop variant="four" steps={THREE} />)).toThrow(/four steps/);
  });

  it("reveals on scroll only when asked, and takes the parent's class", () => {
    expect(list(<StepLoop steps={THREE} />).hasAttribute("data-reveal")).toBe(false);
    const ol = list(<StepLoop steps={THREE} reveal className="ks-thanks__steps" />);
    expect(ol.getAttribute("data-reveal")).toBe("");
    expect(ol.className).toBe("kh-steps ks-thanks__steps");
  });
});
