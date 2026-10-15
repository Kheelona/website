import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { buildOffer } from "@/lib/offer/offer";
import { ExampleConversation } from "./ExampleConversation";
import storiesMeta, * as stories from "./ExampleConversation.stories";
import type { ExampleConversationConfig } from "./example-conversation.types";

/* ExampleConversation (task 8c.3; D061 and the main session's rulings): the labelled example of what asking back sounds
 * like (home.md fold 2 variant b), on the product page right after its four steps. No mockup fold: the approved pages
 * carry none (the pre-Gate A review build drew it as `mk-chat`, mockup.css:39-44 at c0f1668, ported here as
 * `ks-exchange` on DS tokens). The label sits above the exchange and is never removed (DS 08-accessibility: snippets
 * written by us are marked as illustrative); the exchange is an ordered list the label names, each line led by who says
 * it. Nothing moves (no reveal: SPA 9 reveals only where a mockup does). */

const OFFER = buildOffer("token");
const CONFIG: ExampleConversationConfig = {
  heading: { title: "What {hand:asking back} sounds like." },
  note: "Illustrative example, not a recording.",
  lines: [
    { speaker: "child", who: "Your child", text: "“Why does the moon follow our car?”" },
    { speaker: "kheelu", who: "Kheelu", text: "“The moon is very, very far away. What else looks like it follows you?”" },
    { speaker: "child", who: "Your child", text: "“My shadow?”" },
  ],
  after: "It answers first, then asks a question back.",
};
/* Task Q2.10 (the D2C plan v2 §3 fold 6, ruling 6): three exchanges as labelled DS Tabs, the label above each exchange. */
const TABBED: ExampleConversationConfig = {
  heading: CONFIG.heading,
  note: CONFIG.note,
  tabs: {
    label: "What asking back sounds like.",
    items: [
      { id: "chat-moon", label: "The moon", lines: CONFIG.lines },
      {
        id: "chat-dosa",
        label: "The dosa pan",
        lines: [
          { speaker: "child", who: "Your child", text: "“Why does the dosa pan sizzle?”" },
          { speaker: "kheelu", who: "Kheelu", text: "“The pan is very hot. Why do you think the pan has to be hot first?”" },
          { speaker: "child", who: "Your child", text: "“So the dosa gets crispy?”" },
        ],
      },
      {
        id: "chat-spider",
        label: "Spider legs",
        lines: [
          { speaker: "child", who: "Your child", text: "“How many legs does a spider have?”" },
          { speaker: "kheelu", who: "Kheelu", text: "“Eight. What else do you know that has more than four legs?”" },
          { speaker: "child", who: "Your child", text: "“A centipede?”" },
        ],
      },
    ],
  },
  after: "Hear it in two languages: watch [“Two languages”](#a-story-in-two-languages).",
};
const CSS = readFileSync(join(process.cwd(), "src/components/sections/ExampleConversation/example-conversation.css"), "utf8");

describe("ExampleConversation: the fold", () => {
  it("is a section named by its h2, the Hand accent on its words, on the page surface", () => {
    const { container } = render(<ExampleConversation {...CONFIG} offer={OFFER} />);
    const section = screen.getByRole("region", { name: "What asking back sounds like." });
    expect(container.firstElementChild).toBe(section);
    expect(section.className).toBe("kh-section");
    expect(section).toHaveAttribute("aria-labelledby", "example-title");
    const h2 = section.querySelector(".kh-section__head > header.kh-heading > h2.kh-heading__title#example-title")!;
    expect(h2).not.toBeNull();
    expect([...h2.querySelectorAll(".kh-hand")].map((s) => s.textContent)).toEqual(["asking back"]);
  });

  it("heads its own reading column, aligned to the start like the steps fold before it", () => {
    const { container } = render(<ExampleConversation {...CONFIG} offer={OFFER} />);
    const column = container.querySelector(".kh-container > .ks-exchange")!;
    expect(column.firstElementChild).toHaveClass("kh-section__head");
    expect(column.querySelector(".kh-heading--center")).toBeNull();
    expect(column.firstElementChild?.nextElementSibling).toHaveClass("ks-exchange__note");
  });

  it("puts the label above the exchange and lets it name the list", () => {
    render(<ExampleConversation {...CONFIG} offer={OFFER} />);
    const note = screen.getByText(CONFIG.note);
    expect(note.tagName).toBe("P");
    expect(note).toHaveClass("kh-label-s", "ks-exchange__note");
    const list = screen.getByRole("list", { name: CONFIG.note });
    expect(list.tagName).toBe("OL");
    expect(note.nextElementSibling).toBe(list);
    expect(note.closest(".ks-exchange")).toBe(list.closest(".ks-exchange"));
  });

  it("lists the lines in order, each led by who says it, the child's and Kheelu's apart", () => {
    render(<ExampleConversation {...CONFIG} offer={OFFER} />);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items.map((li) => [li.className, li.querySelector(".ks-exchange__who")?.textContent, li.textContent])).toEqual(
      CONFIG.lines.map((l) => [`kh-body ks-exchange__line ks-exchange__line--${l.speaker}`, l.who, `${l.who}${l.text}`]),
    );
    for (const li of items) expect(li.firstElementChild).toHaveClass("kh-label-s", "ks-exchange__who");
  });

  it("ends on the line after the exchange", () => {
    const { container } = render(<ExampleConversation {...CONFIG} offer={OFFER} />);
    const after = container.querySelector(".ks-exchange > p.kh-body-l.ks-exchange__after")!;
    expect(after.textContent).toBe(CONFIG.after);
    expect(after.previousElementSibling?.tagName).toBe("OL");
    expect(container.querySelector(".ks-exchange")?.lastElementChild).toBe(after);
  });

  it("takes the band, an anchor and another heading id when the page gives them", () => {
    const { container } = render(<ExampleConversation {...CONFIG} band id="asking-back" heading={{ ...CONFIG.heading, id: "asking-title" }} offer={OFFER} />);
    const section = container.firstElementChild!;
    expect(section.className).toBe("kh-section kh-section--band");
    expect(section.id).toBe("asking-back");
    expect(section).toHaveAttribute("aria-labelledby", "asking-title");
    expect(screen.getByRole("list", { name: CONFIG.note })).toBeInTheDocument();
  });

  it("leaves the after line out when none is given", () => {
    const { container } = render(<ExampleConversation {...CONFIG} after={undefined} offer={OFFER} />);
    expect(container.querySelector(".ks-exchange__after")).toBeNull();
    expect(container.querySelector(".ks-exchange")?.lastElementChild?.tagName).toBe("OL");
  });

  it("refuses to render without its label: the exchange is never shown unmarked", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ExampleConversation {...CONFIG} note="  " offer={OFFER} />)).toThrow(/label/);
    vi.mocked(console.error).mockRestore();
  });

  it("moves nothing: no reveal and no motion hook", () => {
    const { container } = render(<ExampleConversation {...CONFIG} offer={OFFER} />);
    expect(container.querySelector("[data-reveal], [data-draw]")).toBeNull();
  });
});

describe("ExampleConversation: three exchanges on DS Tabs (task Q2.10; the D2C plan v2 §3 fold 6)", () => {
  const tabs = TABBED.tabs!;

  it("serves the exchanges stacked under their headings, the tab row hidden, every exchange in the HTML (no JavaScript)", () => {
    const host = document.createElement("div");
    host.innerHTML = renderToStaticMarkup(<ExampleConversation {...TABBED} offer={OFFER} />);
    const box = host.querySelector(".ks-exchange > .kh-tabs[data-tabs]")!;
    expect(box).not.toBeNull();
    expect(box.className).toBe("kh-tabs");
    const list = box.querySelector('[role="tablist"]')!;
    expect(list).toHaveAttribute("hidden");
    expect(list.getAttribute("aria-label")).toBe(tabs.label);
    expect([...list.querySelectorAll('[role="tab"]')].map((t) => [t.id, t.getAttribute("aria-controls"), t.textContent])).toEqual(
      tabs.items.map((item) => [`tab-${item.id}`, `panel-${item.id}`, item.label]),
    );
    const panels = [...box.querySelectorAll(":scope > .kh-tabs__panel")];
    expect(panels.map((p) => [p.id, p.querySelector("h3.kh-subtitle[data-tab-heading]")?.textContent])).toEqual(
      tabs.items.map((item) => [`panel-${item.id}`, item.label]),
    );
    expect(panels.map((p) => p.querySelectorAll("li.ks-exchange__line").length)).toEqual(tabs.items.map((item) => item.lines.length));
  });

  it("puts the label above every exchange and lets it name that exchange's list (each its own id)", () => {
    const host = document.createElement("div");
    host.innerHTML = renderToStaticMarkup(<ExampleConversation {...TABBED} offer={OFFER} />);
    for (const item of tabs.items) {
      const panel = host.querySelector(`#panel-${item.id}`)!;
      const note = panel.querySelector("p.kh-label-s.ks-exchange__note")!;
      expect(note.textContent).toBe(TABBED.note);
      expect(note.id).toBe(`panel-${item.id}-note`);
      expect(note.previousElementSibling?.matches("h3[data-tab-heading]")).toBe(true);
      const ol = note.nextElementSibling!;
      expect(ol.tagName).toBe("OL");
      expect(ol.getAttribute("aria-labelledby")).toBe(note.id);
      expect([...ol.querySelectorAll("li")].map((li) => [li.className, li.textContent])).toEqual(
        item.lines.map((l) => [`kh-body ks-exchange__line ks-exchange__line--${l.speaker}`, `${l.who}${l.text}`]),
      );
    }
    expect(new Set([...host.querySelectorAll("[id]")].map((el) => el.id)).size).toBe(host.querySelectorAll("[id]").length);
  });

  it("makes tabs of them after hydration: the first exchange shown, the others one tap or arrow key away", async () => {
    const user = userEvent.setup();
    render(<ExampleConversation {...TABBED} offer={OFFER} />);
    const list = screen.getByRole("tablist", { name: tabs.label });
    expect(within(list).getAllByRole("tab").map((t) => t.textContent)).toEqual(tabs.items.map((item) => item.label));
    expect(screen.getAllByRole("tabpanel").map((p) => p.id)).toEqual(["panel-chat-moon"]);
    expect(within(screen.getByRole("tabpanel", { name: "The moon" })).getByRole("list", { name: TABBED.note })).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Spider legs" }));
    expect(screen.getAllByRole("tabpanel").map((p) => p.id)).toEqual(["panel-chat-spider"]);
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "The moon" })).toHaveFocus();
  });

  it("ends on the line under the tabs, then the page's CTA block, both outside the tabs", () => {
    const { container } = render(
      <ExampleConversation {...TABBED} offer={OFFER} cta={<p className="cta-slot">Pre-order Kheelu</p>} />,
    );
    const column = container.querySelector(".ks-exchange")!;
    const after = column.querySelector(":scope > p.kh-body-l.ks-exchange__after")!;
    expect(after.textContent).toBe("Hear it in two languages: watch “Two languages”.");
    expect(after.querySelector("a")?.getAttribute("href")).toBe("#a-story-in-two-languages");
    expect(after.previousElementSibling).toHaveClass("kh-tabs");
    expect(after.nextElementSibling).toHaveClass("cta-slot");
    expect(column.lastElementChild).toHaveClass("cta-slot");
  });

  it("takes the CTA block after a single exchange too", () => {
    const { container } = render(<ExampleConversation {...CONFIG} offer={OFFER} cta={<p className="cta-slot">Pre-order Kheelu</p>} />);
    expect(container.querySelector(".ks-exchange")?.lastElementChild).toHaveClass("cta-slot");
    expect(container.querySelector(".ks-exchange__after")?.nextElementSibling).toHaveClass("cta-slot");
  });

  it("refuses an empty label, so no tab shows its exchange unmarked", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ExampleConversation {...TABBED} note=" " offer={OFFER} />)).toThrow(/label/);
    vi.mocked(console.error).mockRestore();
  });

  it("moves nothing: no reveal and no draw", () => {
    const { container } = render(<ExampleConversation {...TABBED} offer={OFFER} />);
    expect(container.querySelector("[data-reveal], [data-draw]")).toBeNull();
  });
});

describe("ExampleConversation: its CSS", () => {
  it("lays the exchange out on DS tokens only, Kheelu's lines to the start, the child's to the end", () => {
    expect(CSS).toMatch(/\.ks-exchange__line--kheelu\s*\{[^}]*justify-self:\s*start/);
    expect(CSS).toMatch(/\.ks-exchange__line--child\s*\{[^}]*justify-self:\s*end/);
    // The child's line is the quiet cream; on a band it switches to the page cream, as the DS's quiet panels do.
    expect(CSS).toMatch(/\.kh-section--band \.ks-exchange__line--child\s*\{[^}]*background:\s*var\(--surface\)/);
    expect(CSS).not.toMatch(/\d+px|#[0-9a-f]{3,8}\b/i);
  });

  /* Task Q2.10: the line under the tabs links to film 6; without a rule the browser's own blue showed (screenshots at
     390 and 1440). The DS link colour, as the page's other links in running text take it (rich-text.css, help-line.css). */
  it("gives a link in the line after the exchange the DS link colour", () => {
    expect(CSS).toMatch(/\.ks-exchange__after a\s*\{[^}]*color:\s*var\(--link\)/);
  });
});

describe("ExampleConversation: the stories", () => {
  it("show the product page's own fold (the page's words, read from its content): three tabbed exchanges, and one alone", () => {
    expect(stories.Product.args).toBeUndefined();
    expect(storiesMeta.args.note).toBe("Illustrative example, not a recording.");
    expect(storiesMeta.args.tabs?.items.map((item) => item.label)).toEqual(["The moon", "The dosa pan", "Spider legs"]);
    expect(stories.OnBand.args?.band).toBe(true);
    expect(stories.OneExchange.args?.lines).toHaveLength(3);
    expect(stories.OneExchange.args?.tabs).toBeUndefined();
  });
});
