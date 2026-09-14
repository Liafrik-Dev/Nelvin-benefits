/**
 * Smoke test for the local (no Supabase) `db` adapter in base44Client.js.
 * Verifies the exported API shape that the whole app depends on.
 *
 * Usage:  node scripts/smoke-db.mjs
 */

import { createRequire } from "node:module";
import { build } from "esbuild";

const require = createRequire(import.meta.url);
const appDir = process.cwd();

// Minimal browser-ish shims so the module resolves with the fallback backend.
const shim = `
globalThis.localStorage = (() => {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
  };
})();
globalThis.window = globalThis;
`;

const result = await build({
  entryPoints: [require.resolve(`${appDir}/src/services/api/base44Client.js`)],
  bundle: true,
  format: "esm",
  platform: "browser",
  outfile: "/tmp/db-bundle.mjs",
  define: { "import.meta.env": JSON.stringify({}) },
  logLevel: "silent",
  banner: { js: shim },
});

const mod = await import("/tmp/db-bundle.mjs");
const { db, base44, isSupabaseBackend } = mod;

let failures = 0;
const check = (label, cond) => {
  console.log(`${cond ? "PASS" : "FAIL"} — ${label}`);
  if (!cond) failures += 1;
};

// --- entities shape ---
check("db exported", !!db);
check("base44 alias === db", base44 === db);
check("isSupabaseBackend() false without env", isSupabaseBackend() === false);
check("db.entities exists", !!db.entities);

const offers = await db.entities.Offer.list("-created_date", 100);
check("Offer.list returns array", Array.isArray(offers));
check("Offer.list has seeded rows", offers.length > 0);
check("rows have camelCase keys", offers.every((o) => "created_date" in o || "created_at" in o));

const live = await db.entities.Offer.filter({ status: "active", is_published: true }, "-created_date", 5);
check("Offer.filter works", live.length > 0 && live.length <= 5);

const one = await db.entities.Offer.get(offers[0].id);
check("Offer.get works", !!one && one.id === offers[0].id);

// --- create / update / delete ---
const created = await db.entities.Company.create({ name: "Acme Test" });
check("Company.create returns row with id", !!created.id);
check("Company.create sets created_date", !!created.created_date);

const updated = await db.entities.Company.update(created.id, { name: "Acme Test 2" });
check("Company.update works", updated.name === "Acme Test 2");

const fetched = await db.entities.Company.get(created.id);
check("Company.get reflects update", fetched.name === "Acme Test 2");

await db.entities.Company.delete(created.id);
const gone = await db.entities.Company.get(created.id);
check("Company.delete works", gone === null);

// --- bulk ops ---
const bulk = await db.entities.Company.bulkCreate([
  { name: "B1" }, { name: "B2" }, { name: "B3" },
]);
check("bulkCreate returns rows", bulk.length === 3);
await db.entities.Company.bulkUpdate(bulk.map((r) => ({ id: r.id, status: "approved" })));
const afterBulk = await db.entities.Company.list("-created_date", 3);
check("bulkUpdate applied", afterBulk.length === 3 && afterBulk.every((r) => r.status === "approved"));
for (const r of bulk) await db.entities.Company.delete(r.id);

// --- users.inviteUser ---
await db.users.inviteUser("invite@test.com", "subscriber");
const invited = await db.entities.User.filter({ email: "invite@test.com" });
check("inviteUser creates User row", invited.length === 1);

// --- membership plans / categories / countries seeds ---
const plans = await db.entities.MembershipPlan.list("-display_order", 10);
check("MembershipPlan seeded", plans.length >= 3 && ["Free", "Premium", "VIP"].every((n) => plans.some((p) => p.name === n)));
const cats = await db.entities.Category.list("display_order", 50);
check("Category seeded", cats.length >= 5);
const cntries = await db.entities.Country.list("display_order", 50);
check("Country seeded", cntries.length >= 5);

// --- integrations ---
const up = await db.integrations.Core.UploadFile({ file: null });
check("UploadFile no-file returns file_url", "file_url" in up);

// --- auth flow ---
check("auth.isAuthenticated initial false", (await db.auth.isAuthenticated()) === false);
await db.auth.loginViaEmailPassword("admin@nelvinbenefits.com", "demo");
check("auth.isAuthenticated after login", (await db.auth.isAuthenticated()) === true);
const me = await db.auth.me();
check("auth.me returns user", !!me && me.email === "admin@nelvinbenefits.com");

await db.auth.updateMe({ full_name: "New Demo User" });
const me2 = await db.auth.me();
check("auth.updateMe persists", me2.full_name === "New Demo User");

const bulk2 = await db.entities.Employee.bulkCreate([
  { user_email: "a@x.com", status: "invited" },
  { user_email: "b@x.com", status: "invited" },
]);
check("Employee.bulkCreate", bulk2.length === 2);
await db.auth.logout();
check("auth.isAuthenticated after logout", (await db.auth.isAuthenticated()) === false);

console.log(failures === 0 ? "\nALL CHECKS PASSED ✅" : `\n${failures} CHECK(S) FAILED ❌`);
process.exit(failures === 0 ? 0 : 1);