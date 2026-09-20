/**
 * Locks in the SHA-256 fallback used when WebCrypto is unavailable.
 *
 * `crypto.subtle` only exists in a secure context. Over plain HTTP on a LAN
 * address it is undefined, and hashing a password used to throw — which made
 * registration fail and every sign-in report "Incorrect email or password."
 *
 * Run: node scripts/sha256-check.mjs
 */
import { createHash } from "node:crypto";
import { sha256Hex, sha256HexAsync } from "../src/lib/sha256.js";

let failures = 0;
const check = (ok, label, detail = "") => {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  ${detail}` : ""}`);
};

// Published NIST/FIPS test vectors.
const VECTORS = [
  ["", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"],
  ["abc", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"],
  [
    "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq",
    "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1",
  ],
  ["a".repeat(1000), "41edece42d63e8d9bf515a9ba6932e1c20cbc9f5a5d134645adb5db1b9737ea3"],
];

for (const [input, expected] of VECTORS) {
  check(sha256Hex(input) === expected, `vector ${JSON.stringify(input.slice(0, 20))}`);
}

// Block-boundary lengths: the padding arithmetic must be exact at 55/56/119/120,
// which is where a naive implementation silently produces a wrong digest.
const againstNode = (input) => createHash("sha256").update(input, "utf8").digest("hex");
for (const len of [0, 1, 54, 55, 56, 63, 64, 65, 111, 112, 118, 119, 120, 127, 128, 129, 191, 192, 193, 255, 256, 1000]) {
  const s = "a".repeat(len);
  check(sha256Hex(s) === againstNode(s), `length boundary ${len}`);
}

// Random cross-check against Node's implementation.
let mismatches = 0;
for (let i = 0; i < 500; i++) {
  const n = 1 + Math.floor(Math.random() * 400);
  let s = "";
  for (let j = 0; j < n; j++) s += String.fromCharCode(32 + Math.floor(Math.random() * 95));
  if (sha256Hex(s) !== againstNode(s)) mismatches++;
}
check(mismatches === 0, "500 random cross-checks vs node:crypto", mismatches ? `${mismatches} mismatches` : "");

// Non-ASCII must be treated as UTF-8, like the native digest.
for (const s of ["é", "café", "😀", "naïve", "Ω≈ç√∫", "日本語"]) {
  check(sha256Hex(s) === againstNode(s), `utf-8 ${JSON.stringify(s)}`);
}

// The async wrapper must agree with the sync path.
const asyncChecks = await Promise.all(VECTORS.map(([input]) => sha256HexAsync(input)));
check(asyncChecks.every((h, i) => h === VECTORS[i][1]), "async wrapper matches sync output");

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) FAILED.`}`);
process.exit(failures === 0 ? 0 : 1);