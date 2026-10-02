import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TwoReasons } from "./TwoReasons";
import { KHEELU_LANGUAGES } from "@/config/site";

describe("TwoReasons", () => {
  it("lists every launch language, each tagged with its own lang", () => {
    render(<TwoReasons />);
    const list = screen.getByRole("list", { name: "Languages" });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(KHEELU_LANGUAGES.length);
    expect(items.find((li) => li.getAttribute("lang") === "hi")).toHaveTextContent("हिन्दी");
  });

  it("has no language buttons that would do nothing (there are no clips)", () => {
    render(<TwoReasons />);
    expect(screen.queryByRole("button", { name: "English" })).toBeNull();
  });

  it("labels the app mock as sample data", () => {
    render(<TwoReasons />);
    expect(screen.getByText("Sample screens with sample data.")).toBeInTheDocument();
  });

  it("walks the app screens and toggles a named switch", async () => {
    const user = userEvent.setup();
    render(<TwoReasons />);
    await user.click(screen.getByRole("button", { name: "Controls" }));
    const quiet = screen.getByRole("switch", { name: "Quiet hours (8 pm to 7 am)" });
    expect(quiet).toHaveAttribute("aria-checked", "true");
    await user.click(quiet);
    expect(quiet).toHaveAttribute("aria-checked", "false");
  });

  it("deleting the sample conversation says what the real app would do", async () => {
    const user = userEvent.setup();
    render(<TwoReasons />);
    await user.click(screen.getByRole("button", { name: "Talk log" }));
    await user.click(screen.getByRole("button", { name: "Delete this conversation" }));
    expect(screen.getByRole("status")).toHaveTextContent(/removes the conversation for good/);
  });
});
