/** The 32-byte SHA-256 of a text. */
async function digest(subtle: SubtleCrypto, text: string): Promise<Uint8Array> {
  return new Uint8Array(await subtle.digest("SHA-256", new TextEncoder().encode(text) as BufferSource));
}

/**
 * Does the caller know the secret? The function is deployed with Supabase's own JWT check OFF (the scheduler cannot send a
 * user token), so this check is the only gate: `x-backup-secret` must equal the Edge Function secret `BACKUP_CRON_SECRET`.
 * Both sides are hashed first, then the hashes are compared without stopping at the first difference, so neither the
 * length nor any prefix of the secret shows in the time taken. An unset or empty secret admits nobody.
 */
export async function isAuthorised(received: string | null, expected: string | undefined, subtle: SubtleCrypto): Promise<boolean> {
  const [a, b] = await Promise.all([digest(subtle, received ?? ""), digest(subtle, expected ?? "")]);
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i];
  return difference === 0 && received !== null && received !== "" && expected !== undefined && expected !== "";
}
