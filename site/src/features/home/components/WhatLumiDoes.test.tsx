import { render, screen } from "@testing-library/react";
import { WhatLumiDoes } from "./WhatLumiDoes";

describe("WhatLumiDoes", () => {
  it("renders the section heading", () => {
    render(<WhatLumiDoes />);
    expect(
      screen.getByRole("heading", {
        name: /Not a speaker with a face\. A companion with a memory\./i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the feature cards", () => {
    render(<WhatLumiDoes />);
    expect(
      screen.getByRole("heading", { name: "Real conversation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "10 languages" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Safe by design" }),
    ).toBeInTheDocument();
  });

  it("links to the PlayOS platform page", () => {
    render(<WhatLumiDoes />);
    expect(
      screen.getByRole("link", { name: /PlayOS page/i }),
    ).toHaveAttribute("href", "/playos");
  });
});
