import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { confirmation } from "@/content/en-IN/store/confirmation";
import { mockupFold, skeleton, words } from "../../../../../test/support/mockup-compare";
import { ConfirmationHead } from "./ConfirmationHead";
import stories, { LinkNeeded, SAMPLE_ORDER } from "./ConfirmationHead.stories";

/* ConfirmationHead (task 5.16): /thanks fold 1 (store-confirmation.html): say it worked, in the first line, and where
   the proof went. The mockup's lede carries two sample values (a value marker on the amount, a placeholder for the
   email: sample data, architecture §19); the real page prints the order row's, as plain text, so both are unwrapped. */

const OPTIONS = { unwrap: "[data-src], .mk-placeholder" };

describe("ConfirmationHead", () => {
  it("markup and words equal store-confirmation.html fold 1, the order's values in the lede", () => {
    const { container } = render(<ConfirmationHead copy={confirmation.head.paid} amount={SAMPLE_ORDER.amount} email={SAMPLE_ORDER.email} />);
    const mockup = mockupFold("store-confirmation", "section[aria-labelledby='thanks-title']");
    expect(skeleton(container.firstElementChild!, OPTIONS)).toBe(skeleton(mockup, OPTIONS));
    expect(words(container.firstElementChild!)).toBe(words(mockup));
  });

  it("is a section named by the page's one h1, the eyebrow's icon hidden", () => {
    render(<ConfirmationHead copy={confirmation.head.paid} amount="₹499" email="parent@example.com" />);
    const section = screen.getByRole("region", { name: "Your Kheelu is reserved." });
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(section.querySelector(".kh-eyebrow")!.className).toBe("kh-eyebrow ks-thanks__eyebrow");
    expect(section.querySelector(".kh-eyebrow svg")).toHaveAttribute("aria-hidden", "true");
    expect(section.querySelector(".ks-thanks__lede")!.className).toBe("kh-body-l ks-thanks__lede");
  });

  it("prints the amount and the email as plain text in one line, never as markup", () => {
    const { container } = render(<ConfirmationHead copy={confirmation.head.paid} amount="₹99" email="<b>x</b>@example.com" />);
    const lede = container.querySelector(".ks-thanks__lede")!;
    expect(lede.children).toHaveLength(0);
    expect(lede.textContent).toBe(
      "We have your ₹99, and your place in the queue is held from the moment you paid. Your confirmation is on its way to <b>x</b>@example.com.",
    );
  });

  it("renders a state with no slots and no values (confirming), with its own icon", () => {
    const { container } = render(<ConfirmationHead copy={confirmation.head.created} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Thank you. We are confirming it now.");
    expect(container.querySelector(".kh-eyebrow")!.textContent).toBe("Confirming your payment");
    expect(container.querySelector(".kh-eyebrow svg")).not.toBeNull();
  });

  it("draws no icon where the state names none", () => {
    const { container } = render(<ConfirmationHead copy={{ ...confirmation.head.created, icon: undefined }} />);
    expect(container.querySelector(".kh-eyebrow svg")).toBeNull();
  });

  it("puts a help line after the lede, inside the head (the link-needed state: a person who can find the order)", () => {
    render(<ConfirmationHead copy={confirmation.head.linkNeeded} help={confirmation.linkNeededHelp} />);
    const header = screen.getByRole("heading", { level: 1 }).parentElement!;
    const line = header.lastElementChild!;
    expect(line.className).toBe("kh-body ks-help");
    /* WhatsApp, the call off (D063 item 2; task Q2.3). */
    expect(line.textContent).toBe("Cannot find the email? Message us on WhatsApp and a person will pull up your order and add your address for you.");
    expect(screen.getByRole("link", { name: "Message us on WhatsApp" })).toHaveAttribute("href", "https://wa.me/919187546483");
    expect(line.querySelector('a[href^="tel:"]')).toBeNull();
  });

  it("its LinkNeeded story shows the state as the page renders it, the help line included (every variant in Storybook)", () => {
    const { container } = render(<ConfirmationHead {...stories.args} {...LinkNeeded.args} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("We need your link again.");
    expect(container.querySelector(".ks-help")!.textContent).toBe(
      `${confirmation.linkNeededHelp.lead} Message us on WhatsApp and a person will pull up your order and add your address for you.`,
    );
  });

  it("has no help line unless it is given one", () => {
    const { container } = render(<ConfirmationHead copy={confirmation.head.created} />);
    expect(container.querySelector(".ks-help")).toBeNull();
  });

  it("refuses a lede slot it has no value for", () => {
    expect(() => render(<ConfirmationHead copy={confirmation.head.paid} amount="₹499" />)).toThrow(/email/);
  });

  it("refuses an icon the DS does not have", () => {
    expect(() => render(<ConfirmationHead copy={{ ...confirmation.head.paid, icon: "linkedin-logo" }} amount="₹499" email="a@b.c" />)).toThrow();
  });
});
