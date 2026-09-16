/**
 * Regression check for the invisible-text fixes.
 *
 * Per-element screenshots stall on these pages (the hero keeps several videos
 * live), so this resolves contrast from the DOM instead: it walks up from the
 * text to the first painted background, compositing any translucent layers on
 * the way, and reports the resulting ratio. For flat-coloured surfaces — which
 * is every case that was broken — that is exact, and it is fast enough to run
 * across all three portals.
 *
 * Usage: node scripts/contrast-fix-check.mjs   (preview server on :4173)
 */

import puppeteer from "puppeteer-core";

const BASE = process.env.PREVIEW_URL || "http://localhost:4173";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium",
  headless: "new",
  protocolTimeout: 240000,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});
const ctx = await browser.createBrowserContext();
const page = await ctx.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.evaluateOnNewDocument(() => {
  const css = document.createElement("style");
  css.textContent = "*,*::before,*::after{animation:none !important;transition:none !important}";
  document.addEventListener("DOMContentLoaded", () => document.head.appendChild(css));
});

const email = `fix.${Date.now()}@example.com`;

async function login(role) {
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  const have = await page.evaluate(() => !!localStorage.getItem("nv_auth_users"));
  if (!have) {
    await page.goto(BASE + "/register", { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForSelector("form", { timeout: 15000 });
    await sleep(600);
    const ins = await page.$$("form input");
    for (const [i, v] of [[0, "Fx"], [1, "Check"], [2, email], [3, "Secret123!"], [4, "Secret123!"]]) {
      if (ins[i]) { await ins[i].click({ clickCount: 3 }); await ins[i].type(v, { delay: 4 }); }
    }
    await page.click('form button[type="submit"]');
    await sleep(2500);
  }
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
  await page.goto(BASE + "/login", { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForSelector("form", { timeout: 15000 });
  await sleep(500);
  const ins = await page.$$("form input");
  for (const [i, v] of [[0, email], [1, "Secret123!"]]) {
    if (ins[i]) { await ins[i].click({ clickCount: 3 }); await ins[i].type(v, { delay: 4 }); }
  }
  await page.click('form button[type="submit"]');
  await sleep(2500);
}

const CASES = [
  { role: "subscriber", route: "/dashboard", text: "Open Wallet ($320.00)", label: "Dashboard · Open Wallet" },
  { role: "subscriber", route: "/wallet", text: "Total Balance", label: "Wallet · Total Balance" },
  { role: "subscriber", route: "/cashback", text: "Transfer to Wallet", label: "Cashback · Transfer to Wallet" },
  { role: "subscriber", route: "/rewards", text: "Send Kudos Points", label: "Rewards · Send Kudos Points" },
  { role: "subscriber", route: "/nearby", text: "GPS Radar Active", label: "Nearby · GPS Radar Active" },
  { role: "business", route: "/business", text: "Create New Offer", label: "Partner · Create New Offer" },
  { role: "business", route: "/business", text: "Pending Payout", label: "Partner · Pending Payout" },
  { role: "hr_admin", route: "/corporate-dashboard", text: "Seats Allocated", label: "HR · Seats Allocated" },
  { role: "hr_admin", route: "/corporate-dashboard", text: "Corporate Subscription", label: "HR · Corporate Subscription" },
  { role: "public", route: "/register", text: "First Name", label: "Auth · First Name label" },
  { role: "public", route: "/register", text: "Create Account", label: "Auth · Create Account submit" },
  { role: "public", route: "/corporate-signup", text: "Continue", label: "Auth · Corporate Continue" },
];

const results = [];
let current = null;

for (const c of CASES) {
  if (c.role !== current) {
    current = c.role;
    if (c.role === "public") {
      await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => ["nv_auth_session", "nv_auth_token"].forEach((k) => localStorage.removeItem(k)));
    } else {
      await login(c.role);
    }
  }
  await page.goto(BASE + c.route, { waitUntil: "domcontentloaded", timeout: 45000 });
  await sleep(1800);

  const measured = await page.evaluate((wanted) => {
    const lum = ([r, g, b]) => {
      const f = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratio = (a, b) => { const [hi, lo] = a > b ? [a, b] : [b, a]; return (hi + 0.05) / (lo + 0.05); };
    const parse = (s) => {
      const m = String(s).match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1].split(",").map((x) => parseFloat(x.trim()));
      return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
    };

    const all = [...document.querySelectorAll("button,a,span,p,h1,h2,h3,label,div,strong,li")]
      .filter((e) => e.textContent?.trim().includes(wanted));
    if (!all.length) return { status: "NOT FOUND" };
    const el = all[all.length - 1];
    const cs = getComputedStyle(el);
    const fg = parse(cs.color);
    if (!fg) return { status: "NO COLOR" };

    // Walk up collecting translucent layers until an opaque one is reached.
    const layers = [];
    let node = el;
    let guard = 0;
    while (node && guard++ < 30) {
      const st = getComputedStyle(node);
      if (st.backgroundImage && st.backgroundImage !== "none") {
        return { status: "IMAGE BACKDROP" };
      }
      const bg = parse(st.backgroundColor);
      if (bg && bg.a > 0) {
        layers.push(bg);
        if (bg.a === 1) break;
      }
      node = node.parentElement;
    }
    if (!layers.length) return { status: "NO BG" };
    if (layers[layers.length - 1].a < 1) return { status: "AMBIGUOUS BG" };

    // Composite from the topmost opaque layer downwards.
    let base = layers[layers.length - 1].rgb;
    for (let i = layers.length - 2; i >= 0; i--) {
      const l = layers[i];
      base = l.rgb.map((v, k) => v * l.a + base[k] * (1 - l.a));
    }
    const paint = fg.rgb.map((v, k) => v * fg.a + base[k] * (1 - fg.a));
    const fontSize = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = fontSize >= 24 || (fontSize >= 18.66 && weight >= 700);
    return {
      status: "OK",
      cr: +ratio(lum(paint), lum(base)).toFixed(2),
      min: large ? 3 : 4.5,
      color: cs.color,
      bg: base.map(Math.round),
    };
  }, c.text);

  if (measured.status !== "OK") {
    results.push({ label: c.label, status: measured.status, cr: null, min: null });
    continue;
  }
  results.push({ label: c.label, status: measured.cr >= measured.min ? "PASS" : "FAIL",
    cr: measured.cr, min: measured.min, color: measured.color, bg: measured.bg });
}

await browser.close();

console.log("\nInvisible-text fixes — contrast at each repaired control\n");
let fails = 0;
for (const r of results) {
  if (r.status === "FAIL") fails++;
  const mark = r.status.padEnd(5);
  const cr = r.cr === null ? "   n/a" : `${r.cr}:1`;
  console.log(`  ${mark} ${cr.padStart(8)}  ${r.label}`);
  if (r.status === "FAIL") console.log(`          ${r.color} on rgb(${r.bg}) · needs ${r.min}:1`);
  if (!["PASS", "FAIL"].includes(r.status)) console.log(`          not measurable in DOM (${r.status})`);
}
console.log(`\n${results.filter((r) => r.status === "PASS").length}/${results.length} pass · ${fails} fail`);