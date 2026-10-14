/* The one copy-page reader (task 6.3, from the 5.19 review: the three article tests each carried their own).
 *
 * An article without a mockup has its approved copy page as its reference (wiki/site/pages/story-<slug>.md, D013): only
 * the text inside a fold's **Copy** block is published, everything else on the page is notes. The article tests
 * (screen-time-articles, talking-articles, ai-safety-and-learning) read the page through here and keep their own rules
 * for how a Copy line prints (markers, links, crumbs), which differ by family. Proven on every shape the copy pages use
 * by copy-page.test.ts beside it.
 *
 * The page's shape, as every story copy page writes it:
 *   - a fold is a level-2 section headed "## Fold <n> · <title>"; other sections ("At a glance", "Changes after
 *     approval", the sources table) are never folds;
 *   - a fold's Copy block is the run of quoted ("> ") lines after its first line that starts "**Copy" (the label may
 *     run over two lines, as the close folds' "**Copy (from the article template's … never retyped):**" does); the
 *     first unquoted line ends it, so a quoted note further down is not copy;
 *   - "At a glance" states the title and the description with their lengths: "| Title (58 characters) | … |".
 */
import { readRepoFile } from "../e2e/support/repo";

export interface CopyFold {
  /** The fold's heading after "Fold n · ": "Article head", "The answer first", "Sources (article foot)". */
  readonly title: string;
  /** Everything under the heading, notes included, as written. */
  readonly text: string;
  /** The Copy block's lines, quote marks off, blank lines kept as "" (they part the paragraphs); [] without one. */
  readonly copy: readonly string[];
}

export interface CopyPage {
  /** Where the page was read from (the repo path, or the name a test gave it). */
  readonly path: string;
  /** The whole page, as written. */
  readonly markdown: string;
  /** The folds, in page order. */
  readonly folds: readonly CopyFold[];
}

/** An article's copy page, by its slug. */
export const copyPagePath = (slug: string): string => `wiki/site/pages/story-${slug}.md`;

/** The quoted run after the fold's first Copy line. */
function copyBlock(lines: readonly string[]): string[] {
  let i = lines.findIndex((line) => line.startsWith("**Copy"));
  if (i === -1) return [];
  while (i < lines.length && !lines[i].startsWith(">")) i += 1;
  const block: string[] = [];
  for (; i < lines.length && lines[i].startsWith(">"); i += 1) block.push(lines[i].replace(/^>\s?/, ""));
  return block;
}

export function parseCopyPage(markdown: string, path = "the copy page"): CopyPage {
  const folds = markdown
    .split(/^## /m)
    .slice(1)
    .filter((section) => section.startsWith("Fold "))
    .map((section): CopyFold => {
      const [heading, ...rest] = section.split("\n");
      return { title: heading.replace(/^Fold \d+ · /, "").trim(), text: rest.join("\n"), copy: copyBlock(rest) };
    });
  return { path, markdown, folds };
}

const read = new Map<string, CopyPage>();

/** An article's copy page, read once per run. */
export function readCopyPage(slug: string): CopyPage {
  const path = copyPagePath(slug);
  let page = read.get(path);
  if (page === undefined) {
    page = parseCopyPage(readRepoFile(path), path);
    read.set(path, page);
  }
  return page;
}

/** The fold whose title starts with `name`, or matches it; a missing fold is an error naming the page. */
export function copyFold(page: CopyPage, name: string | RegExp): CopyFold {
  const found = page.folds.find((f) => (typeof name === "string" ? f.title.startsWith(name) : name.test(f.title)));
  if (found === undefined) throw new Error(`${page.path} has no fold ${typeof name === "string" ? `"${name}…"` : String(name)}`);
  return found;
}

/** The Copy block without its blank lines: each line is one paragraph, item or heading. */
export function copyLines(fold: CopyFold): string[] {
  return fold.copy.filter((line) => line.trim() !== "");
}

/** The Copy block's paragraphs: its lines grouped by the blank lines between them. */
export function copyParagraphs(fold: CopyFold): string[][] {
  const paragraphs: string[][] = [[]];
  for (const line of fold.copy) {
    if (line.trim() === "") paragraphs.push([]);
    else paragraphs[paragraphs.length - 1].push(line);
  }
  return paragraphs.filter((p) => p.length > 0);
}

/** A row of "At a glance" ("| Title (58 characters) | … |"): the first row whose label states a length, so a later
 *  table's "| Title (card title, …) |" is never read. Its stated length must be the value's. */
export function glanceRow(page: CopyPage, label: "Title" | "Meta description"): string {
  const row = new RegExp(`^\\|\\s*${label} \\((\\d+) characters\\)\\s*\\|\\s*(.+?)\\s*\\|\\s*$`);
  for (const line of page.markdown.split("\n")) {
    const m = row.exec(line);
    if (!m) continue;
    const [, stated, value] = m;
    if (value.length !== Number(stated)) {
      throw new Error(`${page.path}: the ${label} row says ${stated} characters; its value has ${value.length}`);
    }
    return value;
  }
  throw new Error(`${page.path} has no "${label} (n characters)" row`);
}
