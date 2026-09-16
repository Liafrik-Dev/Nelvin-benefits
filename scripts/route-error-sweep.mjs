/**
 * Sweeps every route for runtime faults and layout breaks.
 *
 * Reports page errors, failed asset requests and horizontal overflow per
 * route, for each portal. This is the broad pass that catches anything the
 * targeted checks miss.
 *
 * Usage: node scripts/route-error-sweep.mjs   (preview server on :4173)
 */
import puppeteer from "puppeteer-core";

const B = process.env.PREVIEW_URL || "http://localhost:4173";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ROUTES = {
  public: [
    "/", "/offers", "/categories", "/corporate", "/partner", "/choose-plan",
    "/login", "/register", "/corporate-signup", "/about", "/contact",
    "/terms", "/privacy", "/how-it-works", "/for-business",
  ],
  subscriber: [
    "/dashboard", "/explore", "/marketplace", "/search", "/favorites", "/nearby",
    "/rewards", "/wallet", "/cashback", "/vouchers", "/flexible-benefits",
    "/wellness", "/financial-wellness", "/lifestyle", "/notifications",
    "/settings", "/support", "/benefits", "/my-offers", "/profile",
  ],
  business: [
    "/business", "/business/profile", "/business/locations", "/business/offers",
    "/business/offers/new", "/business/performance", "/business/payouts", "/business/support",
  ],
  hr_admin: ["/corporate-dashboard"],
};

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium",
  headless: "new",
  protocolTimeout: 240000,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const email = `sweep.${Date.now()}@example.com`;

async function registerOnce() {
  await page.goto(B + "/register", { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForSelector("form", { timeout: 15000 });
  await sleep(600);
  const ins = await page.$$("form input");
  for (const [i, v] of [[0, "Sw"], [1, "Eep"], [2, email], [3, "Secret123!"], [4, "Secret123!"]]) {
    if (ins[i]) { await ins[i].click({ clickCount: 3 }); await ins[i].type(v, { delay: 4 }); }
  }
  await page.click('form button[type="submit"]');
  await sleep(2500);
}

async function loginAs(role) {
  await page.goto(B + "/", { waitUntil: "domcontentloaded" });
  await page.evaluate((r) => {
    const users = JSON.parse(localStorage.getItem("nv_auth_users") || "[]");
    const t = users[users.length - 1];
    if (t) {
      t.role = r;
      t.account_type = r === "business" ? "business" : r === "hr_admin" ? "corporate" : "individual";
      localStorage.setItem("nv_auth_users", JSON.stringify(users));
    }
    ["nv_auth_session", "nv_auth_token"].forEach((k) => localStorage.removeItem(k));
  }, role);
  await page.goto(B + "/login", { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForSelector("form", { timeout: 15000 });
  await sleep(500);
  const ins = await page.$$("form input");
  for (const [i, v] of [[0, email], [1, "Secret123!"]]) {
    if (ins[i]) { await ins[i].click({ clickCount: 3 }); await ins[i].type(v, { delay: 4 }); }
  }
  await page.click('form button[type="submit"]');
  await sleep(2200);
}

await registerOnce();

const rows = [];
let current = null;
for (const [role, routes] of Object.entries(ROUTES)) {
  if (role !== current) {
    current = role;
    if (role === "public") {
      await page.goto(B + "/", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => ["nv_auth_session", "nv_auth_token"].forEach((k) => localStorage.removeItem(k)));
    } else {
      await loginAs(role);
    }
  }

  for (const route of routes) {
    const errs = [];
    const netFails = [];
    const onErr = (e) => errs.push(String(e.message || e).slice(0, 100));
    const onFail = (r) => { if (!/favicon/.test(r.url())) netFails.push(r.url().slice(-60)); };
    page.on("pageerror", onErr);
    page.on("requestfailed", onFail);

    try {
      await page.goto(B + route, { waitUntil: "domcontentloaded", timeout: 45000 });
      await sleep(2000);
      const state = await page.evaluate(() => ({
        path: location.pathname,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        // Undefined component references surface as blank mounts with no heading.
        hasRoot: document.getElementById("root")?.children.length > 0,
        textLen: document.body.innerText.trim().length,
      }));
      rows.push({ role, route, ...state, errs: [...errs], netFails: [...netFails] });
    } catch (e) {
      rows.push({ role, route, fatal: String(e.message).slice(0, 80), errs: [...errs], netFails: [...netFails] });
    } finally {
      page.off("pageerror", onErr);
      page.off("requestfailed", onFail);
    }
  }
}

await browser.close();

console.log("\nRoute sweep\n");
let bad = 0;
for (const r of rows) {
  const problems = [];
  if (r.fatal) problems.push(`FATAL ${r.fatal}`);
  if (r.errs?.length) problems.push(`${r.errs.length} page error(s): ${r.errs[0]}`);
  if (r.netFails?.length) problems.push(`${r.netFails.length} failed request(s): ${r.netFails[0]}`);
  if (r.overflow > 2) problems.push(`horizontal overflow ${r.overflow}px`);
  if (r.hasRoot === false) problems.push("empty root");
  if (typeof r.textLen === "number" && r.textLen < 20) problems.push(`almost empty page (${r.textLen} chars)`);

  if (problems.length) {
    bad++;
    console.log(`  FAIL ${r.role.padEnd(11)} ${r.route}`);
    for (const p of problems) console.log(`         ${p}`);
  }
}
console.log(`\n${rows.length - bad}/${rows.length} routes clean · ${bad} with problems`);