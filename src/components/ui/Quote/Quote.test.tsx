import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Quote } from "./Quote";

const QUOTE = "The hard part of AI for children is not the model. It is the trust.";

describe("Quote", () => {
  it("renders the quote card as team.html fold 4 does: figure.kh-quote > blockquote, figcaption with avatar, name, role", () => {
    const { container } = render(
      <Quote tone="sun" quote={QUOTE} cite={{ name: "Apoorva Sahu", role: "Co-Founder and CEO", initials: "AS" }} className="ks-team-quote" />,
    );
    const figure = container.firstElementChild as HTMLElement;
    expect(figure.tagName).toBe("FIGURE");
    expect(figure.className).toBe("kh-quote kh-tone-sun ks-team-quote");
    expect(figure.innerHTML).toBe(
      `<blockquote class="kh-quote__text">${QUOTE}</blockquote>` +
        '<figcaption class="kh-quote__who"><span class="kh-quote__avatar" aria-hidden="true">AS</span>' +
        '<span><span class="kh-quote__name">Apoorva Sahu</span><span class="kh-quote__role">Co-Founder and CEO</span></span></figcaption>',
    );
  });

  it("shows the person's photo in the avatar's place: the DS Avatar (48 px), alt empty beside the printed name (task 7.1a)", () => {
    const photo = { src: "/team/apoorva.jpg", width: 480, height: 480, alt: "" } as const;
    const { container } = render(<Quote tone="sun" quote={QUOTE} cite={{ name: "Apoorva Sahu", role: "Co-Founder and CEO", initials: "AS", photo }} />);
    const who = container.querySelector("figcaption.kh-quote__who")!;
    expect(who.querySelector(".kh-quote__avatar"), "the photo wins over the initials").toBeNull();
    const avatar = who.firstElementChild as HTMLElement;
    expect(avatar.className).toBe("kh-avatar kh-tone-blue");
    const img = avatar.querySelector("img")!;
    expect(img.getAttribute("alt")).toBe("");
    expect(img.getAttribute("sizes")).toBe("48px");
    expect(new URL(img.getAttribute("src")!, "https://kheelona.com").searchParams.get("url") ?? img.getAttribute("src")).toBe("/team/apoorva.jpg");
    expect(who.textContent).toBe("Apoorva SahuCo-Founder and CEO");
  });

  it("leaves out the avatar and the role when the content has none", () => {
    const { container } = render(<Quote quote={QUOTE} cite={{ name: "A parent" }} />);
    expect(container.querySelector(".kh-quote__avatar")).toBeNull();
    expect(container.querySelector(".kh-quote__role")).toBeNull();
    expect(container.querySelector("figure")?.className).toBe("kh-quote");
  });
});
