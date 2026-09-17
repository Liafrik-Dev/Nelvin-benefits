/**
 * Regression guard: a signed-in member must not be able to raise their own
 * role through updateMe. The Supabase path strips `role`; the localStorage
 * fallback used to accept it, which made every admin route reachable.
 *
 * Run against the Vite dev server so the real module can be imported:
 *   node scripts/role-escalation-check.mjs [baseUrl]
 */
import puppeteer from "puppeteer-core";

const B = process.argv[2] || "http://localhost:5173";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const b = await puppeteer.launch({ executablePath: "/usr/bin/chromium", headless: "new", protocolTimeout: 120000, args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] });
const p = await b.newPage();
await p.goto(B + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
await sleep(1500);

const email = `esc.${Date.now()}@example.com`;
const result = await p.evaluate(async (email) => {
  const { db } = await import("/src/services/api/base44Client.js");
  await db.auth.register({ email, password: "Member123!", role: "subscriber", firstName: "Eve", lastName: "Tester" });
  const created = JSON.parse(localStorage.getItem("nv_auth_users") || "[]").at(-1);
  const before = created?.role;
  const after = await db.auth.updateMe({ role: "admin", full_name: "Eve Tester" });
  const stored = JSON.parse(localStorage.getItem("nv_auth_users") || "[]").at(-1);
  return { before, returned: after?.role, stored: stored?.role, fullName: stored?.full_name };
}, email);

const pass = result.before === "subscriber" && result.stored === "subscriber" && result.returned === "subscriber";
console.log(`role before=${result.before} after updateMe={role:"admin"}: stored=${result.stored} returned=${result.returned}`);
console.log(`name preserved through the same patch: ${result.fullName}`);
console.log(pass ? "PASS: a member cannot self-promote to admin" : "FAIL: privilege escalation is still possible");
await b.close();
process.exit(pass ? 0 : 1);