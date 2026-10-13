import { describe, expect, it } from "vitest";
import { fillSlots, fillSteps, type SlotText } from "./slot-text";

/* Words with the order's own values in them (task 5.16): /thanks prints amounts and an email from the order row, never
   from the store's current mode (ADR-013; store-confirmation copy, "How to read this page"), so content holds the words
   around named slots and the page fills them. */

const LEDE: SlotText<"amount" | "email"> = ["We have your ", { slot: "amount" }, ", sent to ", { slot: "email" }, "."];

describe("fillSlots", () => {
  it("puts each value in its slot, as one string", () => {
    expect(fillSlots(LEDE, { amount: "₹499", email: "parent@example.com" })).toBe("We have your ₹499, sent to parent@example.com.");
  });

  it("keeps words without a slot as they are", () => {
    expect(fillSlots(["Nothing to fill."], {})).toBe("Nothing to fill.");
  });

  it("refuses a slot it was given no value for", () => {
    expect(() => fillSlots(LEDE, { amount: "₹499" } as unknown as Record<"amount" | "email", string>)).toThrow(/email/);
  });
});

describe("fillSteps", () => {
  const STEPS = [
    { tone: "sun", title: "Check your email", body: ["Your confirmation is on its way."] },
    { tone: "blue", title: "Pay the balance", body: ["A link for the ", { slot: "balance" }, " balance."] },
  ] as const;

  it("fills each step's body and keeps its title and tone", () => {
    expect(fillSteps(STEPS, { balance: "₹4,500" })).toEqual([
      { tone: "sun", title: "Check your email", body: "Your confirmation is on its way." },
      { tone: "blue", title: "Pay the balance", body: "A link for the ₹4,500 balance." },
    ]);
  });

  it("needs no value for steps that name none (a full-payment order's), and refuses a named one it lacks", () => {
    expect(fillSteps([STEPS[0]])).toEqual([{ tone: "sun", title: "Check your email", body: "Your confirmation is on its way." }]);
    expect(() => fillSteps(STEPS)).toThrow(/balance/);
  });

  it("refuses a value that would read as content syntax once the step renders it", () => {
    expect(() => fillSteps(STEPS, { balance: "[x](https://example.com)" })).toThrow(/syntax/);
    expect(() => fillSteps(STEPS, { balance: "{price:token}" })).toThrow(/syntax/);
  });
});
