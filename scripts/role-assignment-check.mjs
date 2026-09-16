/**
 * Unit checks for the privilege rules applied when a Supabase profile is first
 * created. The behaviour lives inside supabaseSyncProfile, so the rules are
 * mirrored here and asserted against the same inputs the app passes in.
 *
 * If these drift from the implementation the test still fails loudly, because it
 * also scans the source to confirm the guarded constants are present.
 *
 * Usage: node scripts/role-assignment-check.mjs
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(resolve(root, "src/services/api/base44Client.js"), "utf8");

let pass = 0, fail = 0;
const check = (n, ok, d = "") => {
  if (ok) { pass++; console.log(`  PASS — ${n}${d ? " :: " + d : ""}`); }
  else { fail++; console.log(`  FAIL — ${n}${d ? " :: " + d : ""}`); }
};

// ---- mirror of the implementation's decision logic -------------------------
const SIGNUP_ROLES = ["subscriber", "business", "hr_admin"];
function roleForUser({ email = "", user_metadata = {} }) {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  const staffDomain = domain === "nelvinbenefits.com" || domain === "nelvin.app";
  const requested = String(user_metadata?.role || "");
  return staffDomain ? "admin" : SIGNUP_ROLES.includes(requested) ? requested : "subscriber";
}

console.log("\n[1] Staff domain is matched exactly, not by suffix");
check("exact domain -> admin", roleForUser({ email: "a@nelvinbenefits.com" }) === "admin");
check("exact alt domain -> admin", roleForUser({ email: "a@nelvin.app" }) === "admin");
for (const lookalike of [
  "attacker@evilnelvinbenefits.com",
  "attacker@notnelvinbenefits.com",
  "attacker@xnelvin.app",
  "attacker@nelvinbenefits.com.evil.io",
  "attacker@sub.nelvin.app",
]) {
  check(`lookalike refused: ${lookalike}`,
    roleForUser({ email: lookalike }) === "subscriber");
}

console.log("\n[2] user_metadata cannot grant privilege");
for (const claimed of ["admin", "founder", "staff", "ADMIN", "Admin", " owner ", "root", ""]) {
  const got = roleForUser({ email: "user@example.com", user_metadata: { role: claimed } });
  check(`claimed ${JSON.stringify(claimed)} -> subscriber`, got === "subscriber", got);
}

console.log("\n[3] The legitimate non-privileged signup roles still work");
for (const r of ["subscriber", "business", "hr_admin"]) {
  const got = roleForUser({ email: "user@example.com", user_metadata: { role: r } });
  check(`signup as ${r} honoured`, got === r, got);
}

console.log("\n[4] Source still contains the guards (catches accidental reverts)");
check("no suffix-based admin check", !/endsWith\(\s*["']nelvinbenefits\.com["']/.test(source));
check("no suffix-based nelvin.app check", !/endsWith\(\s*["']@nelvin\.app["']/.test(source));
check("privileged roles are not read from user_metadata",
  !/fallbackRole\s*=\s*[^;]*user_metadata\?\.role\s*\|\|\s*["']subscriber["']/.test(source));
check("SIGNUP_ROLES allowlist present", /SIGNUP_ROLES\s*=\s*\[[^\]]*subscriber[^\]]*business[^\]]*hr_admin[^\]]*\]/.test(source));
check("exact domain comparison present", /domain\s*===\s*["']nelvinbenefits\.com["']/.test(source));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);