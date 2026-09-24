// Voucher codes members show in store and merchants validate at the till.
//
// Format matches the NV-#### shape the UI already used in its placeholders, so
// existing copy and screenshots stay accurate. The random source prefers
// crypto.getRandomValues and falls back to Math.random in locked-down
// environments (same trade-off as the session-id helper in dataClient).

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // no 0/O/1/I — read aloud at a till

function randomInt(max) {
  if (globalThis.crypto?.getRandomValues) {
    const buf = new Uint32Array(1);
    globalThis.crypto.getRandomValues(buf);
    return buf[0] % max;
  }
  return Math.floor(Math.random() * max);
}

/** A short human-readable voucher code, e.g. NV-K7M2B9. */
export function makeVoucherCode() {
  let body = "";
  for (let i = 0; i < 6; i++) body += ALPHABET[randomInt(ALPHABET.length)];
  return `NV-${body}`;
}

/** Normalise user input so "nv k7m2b9" still matches "NV-K7M2B9". */
export function normalizeVoucherCode(raw) {
  return String(raw || "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
}
