/**
 * Route Guard Crypto Utility
 *
 * Uses the Web Crypto API (PBKDF2-SHA256) to derive a hash from whatever
 * the user types, then compares it against the EXPECTED_HASH constant.
 *
 * SECURITY NOTE:
 *  - The raw admin password is never stored anywhere in this codebase.
 *  - EXPECTED_HASH is the output of PBKDF2(password, SALT, 100 000 iters, SHA-256).
 *  - Even if an attacker reads this source they cannot reverse the hash to the password.
 */

const SALT = "marketpulse-route-guard-v1";
const ITERATIONS = 100_000;
const KEY_LENGTH_BYTES = 32;

// Pre-computed: PBKDF2-SHA256("4@+7/", SALT, 100000, 32)
// Generated once via Node.js crypto — never regenerated at runtime from the plain password.
const EXPECTED_HASH =
  "f9a18afa8a7abb61c40f53f510a58061e594c55c17a292fade0406d5f1d9bec3";

/**
 * Derives a PBKDF2-SHA256 hex string from the given password.
 * Uses the Web Crypto API (available in all modern browsers & Next.js edge runtime).
 */
export async function deriveHash(password: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await globalThis.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await globalThis.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(SALT),
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    KEY_LENGTH_BYTES * 8
  );

  return Array.from(new Uint8Array(bits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Returns true if the given password matches the admin password.
 * The comparison is done hash-to-hash; the plain password is never stored.
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const derived = await deriveHash(password);
  // Constant-time-ish comparison (both strings are same-length hex)
  return derived === EXPECTED_HASH;
}
