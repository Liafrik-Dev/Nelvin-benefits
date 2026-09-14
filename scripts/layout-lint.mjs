/**
 * Renders key routes with headless Chromium (puppeteer-core) at mobile/desktop
 * widths and reports horizontal overflow + JS errors.
 * Usage: node scripts/layout-lint.mjs [paths...]
 */
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const ROOT = "http://localhost:4173";
const EXEC =
  process.env.CHROME_PATH ||
  ["/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome"]
    .find((p) => existsSync(p));

const paths = process.argv.slice(2).length ? process.argv.slice(2) : ["/"];

// Simulate a signed-in fallback session so protected routes render as authenticated.
const AUTH_ROLES = {
  subscriber: ["/dashboard", "/explore", "/checkout", "/my-offers", "/notifications", "/wallet", "/profile", "/favorites", "/categories", "/marketplace", "/search", "/nearby", "/rewards", "/cashback", "/vouchers", "/flexible-benefits", "/wellness", "/financial-wellness", "/lifestyle", "/settings", "/support", "/benefits"],
  admin: ["/admin"],
  hr_admin: ["/corporate-dashboard"],
  business: ["/business"],
};
function sessionFor(path) {
  if (AUTH_ROLES.admin.includes(path)) return { token: "demo_session_token", role: "admin", email: "admin@nelvinbenefits.com" };
  if (AUTH_ROLES.hr_admin.includes(path)) return { token: "demo_session_token", role: "hr_admin", email: "hr@nelvinbenefits.com" };
  if (AUTH_ROLES.business.includes(path)) return { token: "demo_session_token", role: "business", email: "vendor@nelvinbenefits.com" };
  if (AUTH_ROLES.subscriber.includes(path)) return { token: "demo_session_token", role: "subscriber", email: "user@nelvinbenefits.com" };
  return null;
}

const widths = [375, 768, 1440];

if (!EXEC) { console.error("chromium not found"); process.exit(1); }
const browser = await puppeteer.launch({ executablePath: EXEC, headless: "new", args: ["--no-sandbox"] });

let fails = 0;
for (const path of paths) {
  for (const width of widths) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    const ses = sessionFor(path);
    if (ses) {
      await page.evaluateOnNewDocument((s) => {
        try {
          localStorage.setItem("nv_auth_token", s.token);
          localStorage.setItem("nelvin_demo_role", s.role);
        } catch {}
      }, ses);
    }
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    try {
      await page.goto(ROOT + path, { waitUntil: "networkidle0", timeout: 20000 });
    } catch (e) { errors.push("goto: " + e.message); }
    await new Promise((r) => setTimeout(r, 1500));
    const m = await page.evaluate(() => {
      const de = document.documentElement;
      return { sw: de.scrollWidth, cw: de.clientWidth, bw: document.body.scrollWidth };
    });
    const overflow = m.sw > m.cw + 1;
    if (overflow) fails++;
    console.log(
      `${(path + (width === 375 ? " (m)" : width === 768 ? " (t)" : " (d)")).padEnd(24)} sw=${m.sw} cw=${m.cw} ${overflow ? "OVERFLOW ❌" : "no-overflow ✅"}${errors.length ? "  JS-ERR: " + errors.slice(0, 2).join(" | ") : ""}`
    );
    await page.close();
  }
}
await browser.close();
process.exit(fails ? 1 : 0);