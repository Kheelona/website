import { render, screen } from "@testing-library/react";
import { AnswerBlock } from "./AnswerBlock";

describe("AnswerBlock", () => {
  it("leads with the question as a heading and answers it in visible copy", () => {
    render(
      <AnswerBlock
        question="Are AI toys safe for children?"
        answer="Not all of them. Kheelu wakes to a word and is off the rest of the time."
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Are AI toys safe for children?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Kheelu wakes to a word and is off the rest of the time/),
    ).toBeInTheDocument();
  });

  it("can drop to h3 inside a room that already has an h2", () => {
    render(<AnswerBlock as="h3" question="What is PlayOS?" answer="The friend inside." />);
    expect(screen.getByRole("heading", { level: 3, name: "What is PlayOS?" })).toBeInTheDocument();
  });

  it("gives the answer a deep-link anchor that clears the sticky navbar", () => {
    const { container } = render(
      <AnswerBlock id="always-listening" question="Is Kheelu always listening?" answer="No." />,
    );
    const block = container.querySelector("#always-listening");
    expect(block).not.toBeNull();
    expect(block?.className).toContain("scroll-mt-28");
  });

  it("renders follow-on content after the answer", () => {
    render(
      <AnswerBlock question="Can I delete everything?" answer="Yes, in one tap.">
        <p>The log lives in the parent app.</p>
      </AnswerBlock>,
    );
    expect(screen.getByText("The log lives in the parent app.")).toBeInTheDocument();
  });
});
