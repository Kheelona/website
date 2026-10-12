import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { Alert } from "./Alert";

/* Alert (task 2.5): the DS Alert (`kh-alert`), an inline notice. Its markup is the approved store mockup's
 * in-app note (mockup/store.html fold 2: `kh-alert` role="status", the info icon, title, body, then the
 * action row); that whole note is compared with the mockup in InAppBrowserNote.test.tsx. */

const iconPath = (el: Element | null) => el?.querySelector("path")?.getAttribute("d");

describe("Alert", () => {
  it("info (the default): role=status, the info icon, the title, then the body", () => {
    const { container } = render(
      <Alert title="Paying by UPI? Open this page in Chrome or Safari.">
        <p>Copy the link and paste it into Chrome or Safari.</p>
      </Alert>,
    );
    const alert = screen.getByRole("status");
    expect(alert).toBe(container.firstElementChild);
    // The default tone carries no modifier, as in the mockup (bundle.css styles none for info).
    expect(alert.className).toBe("kh-alert");
    const [icon, content] = [...alert.children];
    expect(icon.tagName.toLowerCase()).toBe("svg");
    expect(icon).toHaveClass("kh-icon", "kh-alert__icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(iconPath(icon)).toBe(ICON_PATHS.info);
    expect(content).toHaveClass("kh-alert__content");
    const [title, body] = [...content.children];
    expect(title.tagName).toBe("P");
    expect(title).toHaveClass("kh-alert__title");
    expect(title).toHaveTextContent("Paying by UPI? Open this page in Chrome or Safari.");
    expect(body.tagName).toBe("DIV");
    expect(body).toHaveClass("kh-alert__body");
    expect(body.querySelector("p")).toHaveTextContent("Copy the link and paste it into Chrome or Safari.");
  });

  it.each([
    ["success", "status", "check-circle"],
    ["warning", "status", "warning-circle"],
    ["danger", "alert", "warning-circle"],
  ] as const)("%s: modifier class, role %s, icon %s", (tone, role, icon) => {
    render(<Alert tone={tone} title="Title" />);
    const alert = screen.getByRole(role);
    expect(alert).toHaveClass("kh-alert", `kh-alert--${tone}`);
    expect(iconPath(alert.querySelector(".kh-alert__icon"))).toBe(ICON_PATHS[icon]);
  });

  it("only danger is an alert (announced at once); the rest are polite status", () => {
    render(<Alert tone="danger" title="We could not save your address." />);
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByRole("alert")).toHaveTextContent("We could not save your address.");
  });

  it("takes an icon override", () => {
    const { container } = render(<Alert icon="whatsapp-logo" title="Title" />);
    expect(iconPath(container.querySelector(".kh-alert__icon"))).toBe(ICON_PATHS["whatsapp-logo"]);
  });

  it("renders the action slot inside the content, after the body", () => {
    const { container } = render(
      <Alert title="Title" action={<div className="ks-x">Act</div>}>
        <p>Body</p>
      </Alert>,
    );
    const content = container.querySelector(".kh-alert__content")!;
    expect([...content.children].map((c) => c.className)).toEqual(["kh-alert__title", "kh-alert__body", "ks-x"]);
  });

  it("leaves out the title and body elements it has nothing for", () => {
    const { container } = render(<Alert>Just a body</Alert>);
    expect(container.querySelector(".kh-alert__title")).toBeNull();
    expect(container.querySelector(".kh-alert__body")).toHaveTextContent("Just a body");
    const titleOnly = render(<Alert title="Only a title" />);
    expect(titleOnly.container.querySelector(".kh-alert__body")).toBeNull();
  });

  it("puts a className on the root", () => {
    const { container } = render(<Alert className="ks-x" title="T" />);
    expect(container.firstElementChild).toHaveClass("kh-alert", "ks-x");
  });
});
