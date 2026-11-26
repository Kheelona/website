/** A failed step, described by a short CODE only. The message never holds a token, a key, a cell value, a response body
 *  or a URL: it ends up in the sheet's Status tab, in the PostHog event and in the function's logs. */
export class BackupError extends Error {
  readonly code: string;
  constructor(code: string) {
    super(code);
    this.name = "BackupError";
    this.code = code;
  }
}

/** The code of whatever was thrown: a BackupError's own, or a generic one (never the thrown message). */
export function codeOf(error: unknown, fallback = "unexpected_error"): string {
  return error instanceof BackupError ? error.code : fallback;
}
