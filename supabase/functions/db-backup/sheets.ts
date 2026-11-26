import { SHEETS_API, SHEET_WRITE_CHUNK_CHARS } from "./config.ts";
import { BackupError } from "./errors.ts";
import type { FetchLike } from "./http.ts";

export type TabInfo = { sheetId: number; title: string; rowCount: number; columnCount: number };

/** Spare rows added when a tab has to grow, so a tab is not resized every night. */
const ROW_HEADROOM = 100;

const asNumber = (value: unknown, fallback: number): number => (typeof value === "number" ? value : fallback);

/**
 * The few Google Sheets API v4 calls the copy needs, with the service account's access token. Values are always written
 * with `valueInputOption=RAW`: Google stores them as plain text, so a value that starts with `=`, `+` or `-` can never turn
 * into a formula. A fault is reported as `<step>_http_<status>` or `<step>_network`: never a body, a URL or a cell value.
 */
export class SheetsClient {
  private tabs = new Map<string, TabInfo>();

  constructor(
    private readonly http: FetchLike,
    private readonly token: string,
    private readonly spreadsheetId: string,
  ) {}

  private url(path = ""): string {
    return `${SHEETS_API}/${encodeURIComponent(this.spreadsheetId)}${path}`;
  }

  private async call(step: string, url: string, init: RequestInit): Promise<unknown> {
    let response: Response;
    try {
      response = await this.http(url, {
        ...init,
        headers: { authorization: `Bearer ${this.token}`, "content-type": "application/json" },
      });
    } catch {
      throw new BackupError(`${step}_network`);
    }
    if (!response.ok) throw new BackupError(`${step}_http_${response.status}`);
    try {
      return await response.json();
    } catch {
      throw new BackupError(`${step}_bad_response`);
    }
  }

  /** Makes sure every tab named exists, in this order, and remembers each tab's size. New tabs get a frozen header row. */
  async ensureTabs(titles: readonly string[]): Promise<void> {
    const meta = (await this.call(
      "sheets_meta",
      this.url("?fields=sheets.properties(sheetId,title,gridProperties(rowCount,columnCount))"),
      { method: "GET" },
    )) as { sheets?: { properties?: { sheetId?: number; title?: string; gridProperties?: { rowCount?: number; columnCount?: number } } }[] };
    this.tabs = new Map();
    for (const sheet of meta.sheets ?? []) {
      const p = sheet.properties;
      if (p && typeof p.title === "string" && typeof p.sheetId === "number") {
        this.tabs.set(p.title, {
          sheetId: p.sheetId,
          title: p.title,
          rowCount: asNumber(p.gridProperties?.rowCount, 1000),
          columnCount: asNumber(p.gridProperties?.columnCount, 26),
        });
      }
    }
    const missing = titles.filter((title) => !this.tabs.has(title));
    if (missing.length === 0) return;
    const requests = missing.map((title) => ({
      addSheet: { properties: { title, index: titles.indexOf(title), gridProperties: { rowCount: 1000, columnCount: 26, frozenRowCount: 1 } } },
    }));
    const reply = (await this.call("sheets_add_tabs", this.url(":batchUpdate"), {
      method: "POST",
      body: JSON.stringify({ requests }),
    })) as { replies?: { addSheet?: { properties?: { sheetId?: number } } }[] };
    missing.forEach((title, i) => {
      const sheetId = reply.replies?.[i]?.addSheet?.properties?.sheetId;
      if (typeof sheetId !== "number") throw new BackupError("sheets_add_tabs_bad_response");
      this.tabs.set(title, { sheetId, title, rowCount: 1000, columnCount: 26 });
    });
  }

  /** The tab's values as text, row by row. Google leaves out trailing empty rows and columns; a blank tab is `[]`. */
  async readTab(title: string): Promise<string[][]> {
    const range = encodeURIComponent(`'${title}'`);
    const body = (await this.call(
      "sheets_read",
      this.url(`/values/${range}?majorDimension=ROWS&valueRenderOption=UNFORMATTED_VALUE`),
      { method: "GET" },
    )) as { values?: unknown };
    if (body.values === undefined) return [];
    if (!Array.isArray(body.values)) throw new BackupError("sheets_read_bad_response");
    return body.values.map((row) => (Array.isArray(row) ? row.map((cell) => (typeof cell === "string" ? cell : String(cell ?? ""))) : []));
  }

  /** Grows a tab to fit `rows` x `columns` (never shrinks it): Google refuses a write past the grid. */
  async ensureGrid(title: string, rows: number, columns: number): Promise<void> {
    const tab = this.tabs.get(title);
    if (!tab) throw new BackupError("sheets_tab_missing");
    if (tab.rowCount >= rows && tab.columnCount >= columns) return;
    const rowCount = Math.max(tab.rowCount, rows + ROW_HEADROOM);
    const columnCount = Math.max(tab.columnCount, columns);
    await this.call("sheets_resize", this.url(":batchUpdate"), {
      method: "POST",
      body: JSON.stringify({
        requests: [
          {
            updateSheetProperties: {
              properties: { sheetId: tab.sheetId, gridProperties: { rowCount, columnCount } },
              fields: "gridProperties.rowCount,gridProperties.columnCount",
            },
          },
        ],
      }),
    });
    this.tabs.set(title, { ...tab, rowCount, columnCount });
  }

  /** Writes `values` from A1 down, in chunks of about 1.5 MB (Google recommends 2 MB per request), RAW. The caller has
   *  grown the tab first. A tab holding more rows than `values` keeps them: nothing here clears or shrinks. */
  async writeTab(title: string, values: readonly (readonly string[])[]): Promise<void> {
    let start = 0;
    while (start < values.length) {
      let end = start;
      let size = 0;
      while (end < values.length && (end === start || size + rowSize(values[end]) <= SHEET_WRITE_CHUNK_CHARS)) {
        size += rowSize(values[end]);
        end += 1;
      }
      const range = `'${title}'!A${start + 1}`;
      await this.call("sheets_write", this.url(`/values/${encodeURIComponent(range)}?valueInputOption=RAW`), {
        method: "PUT",
        body: JSON.stringify({ range, majorDimension: "ROWS", values: values.slice(start, end) }),
      });
      start = end;
    }
  }
}

const rowSize = (row: readonly string[]): number => row.reduce((n, cell) => n + cell.length + 3, 2);
