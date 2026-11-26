import { GOOGLE_SCOPE, GOOGLE_TOKEN_URL } from "./config.ts";
import { BackupError } from "./errors.ts";
import type { FetchLike } from "./http.ts";

/** The two fields of a Google service-account key file this function uses. */
export type ServiceAccount = { email: string; privateKey: string };

/** Reads the key file's JSON (the Edge Function secret `GOOGLE_SERVICE_ACCOUNT_JSON`). A fault is reported as a code only:
 *  the text is the key itself and never goes into an error. */
export function parseServiceAccount(json: string | undefined): ServiceAccount {
  if (!json) throw new BackupError("google_key_missing");
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new BackupError("google_key_invalid");
  }
  const key = parsed as { client_email?: unknown; private_key?: unknown } | null;
  if (
    !key ||
    typeof key.client_email !== "string" ||
    typeof key.private_key !== "string" ||
    !/^-----BEGIN PRIVATE KEY-----[\s\S]+-----END PRIVATE KEY-----\s*$/.test(key.private_key)
  ) {
    throw new BackupError("google_key_invalid");
  }
  return { email: key.client_email, privateKey: key.private_key };
}

const bytesToBase64Url = (bytes: Uint8Array): string => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const textToBase64Url = (text: string) => bytesToBase64Url(new TextEncoder().encode(text));

/** The PKCS#8 PEM of the key file as the bytes WebCrypto imports. */
function pemToDer(pem: string): Uint8Array {
  const body = pem.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, "").replace(/\s+/g, "");
  let binary: string;
  try {
    binary = atob(body);
  } catch {
    throw new BackupError("google_key_invalid");
  }
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

/** The signed assertion Google's token endpoint exchanges for an access token: RS256, claims `iss`, `scope`, `aud`, `iat`,
 *  `exp` (one hour at most). The scope is the Sheets scope and nothing else. */
export async function signAssertion(account: ServiceAccount, nowSeconds: number, subtle: SubtleCrypto): Promise<string> {
  const header = textToBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = textToBase64Url(
    JSON.stringify({
      iss: account.email,
      scope: GOOGLE_SCOPE,
      aud: GOOGLE_TOKEN_URL,
      iat: nowSeconds,
      exp: nowSeconds + 3600,
    }),
  );
  const signingInput = `${header}.${claims}`;
  let signature: ArrayBuffer;
  try {
    const key = await subtle.importKey(
      "pkcs8",
      pemToDer(account.privateKey) as BufferSource,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );
    signature = await subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(signingInput) as BufferSource);
  } catch (error) {
    throw error instanceof BackupError ? error : new BackupError("google_key_invalid");
  }
  return `${signingInput}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

/** One access token for the Sheets API, by the JWT-bearer grant. Only a status code can leave this function on a fault. */
export async function fetchAccessToken(
  http: FetchLike,
  account: ServiceAccount,
  nowSeconds: number,
  subtle: SubtleCrypto,
): Promise<string> {
  const assertion = await signAssertion(account, nowSeconds, subtle);
  const body = new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }).toString();
  let response: Response;
  try {
    response = await http(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
  } catch {
    throw new BackupError("google_token_network");
  }
  if (!response.ok) throw new BackupError(`google_token_http_${response.status}`);
  let token: unknown;
  try {
    token = ((await response.json()) as { access_token?: unknown }).access_token;
  } catch {
    throw new BackupError("google_token_bad_response");
  }
  if (typeof token !== "string" || token === "") throw new BackupError("google_token_bad_response");
  return token;
}
