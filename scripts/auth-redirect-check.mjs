/**
 * Regression check for the auth redirect.
 *
 * Guards the bug where the post-login destination was taken from the selected
 * role tab instead of the account's own role: a subscriber who signed in with
 * the "Partner" tab selected landed on /business, saw "Business access
 * required", and — because the session was already live — was bounced from
 * /login to /dashboard on the way back. Login looked broken.
 *
 * Every account must land on the portal that matches its real role, no matter
 * which tab happens to be selected.
 *
 * Usage:  node scripts/auth-redirect-check.mjs   (expects a preview server on :4173)
 */

import puppeteer from "puppeteer-core";

const BASE = process.env.PREVIEW_URL || "http://localhost:4173";
const SESSION_KEYS = ["nv_auth_session", "nv_auth_token"];

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium",
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

let failures = 0;
function check(name, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`  ${ok ? "PASS" : "FAIL"} — ${name}: got ${actual}, expected ${expected}`);
}

/** Signs up on `tabLabel`, then logs back in with the Partner tab selected. */
async function scenario(tabLabel) {
  const page = await browser.newPage();
  const email = `check.${tabLabel.replace(/\W/g, "")}.${Date.now()}@example.com`;
  const password = "Secret123!";

  const signOut = () =>
    page.evaluate((keys) => keys.forEach((k) => localStorage.removeItem(k)), SESSION_KEYS);

  const selectTab = (label) =>
    page.evaluate((l) => {
      [...document.querySelectorAll('[role="tab"]')]
        .find((t) => new RegExp(l, "i").test(t.textContent))
        .click();
    }, label);

  const typeForm = async (values) => {
    const inputs = await page.$$("form input");
    for (let i = 0; i < values.length && i < inputs.length; i++) {
      await inputs[i].click({ clickCount: 3 });
      await inputs[i].type(values[i], { delay: 8 });
    }
  };

  const open = async (path) => {
    await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 40000 });
    await page.waitForSelector("form input", { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 400));
  };

  // Start from a clean session, otherwise /register redirects to /dashboard.
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await signOut();

  await open("/register");
  await selectTab(tabLabel);
  await typeForm(["Check", "Tester", email, password, password]);
  await page.click('form button[type="submit"]');
  await new Promise((r) => setTimeout(r, 4000));
  const registered = await page.evaluate(() => location.pathname);

  await signOut();
  await open("/login");
  await selectTab("Partner"); // deliberately the wrong tab
  await typeForm([email, password]);
  await page.click('form button[type="submit"]');
  await new Promise((r) => setTimeout(r, 4200));
  const loggedIn = await page.evaluate(() => location.pathname);

  await page.close();
  return { registered, loggedIn };
}

const SCENARIOS = [
  ["Particulier", "/dashboard"],
  ["HR Team", "/corporate-dashboard"],
  ["Partner", "/business"],
];

for (const [tab, expected] of SCENARIOS) {
  console.log(`\n${tab} account (logs back in via the Partner tab)`);
  const { registered, loggedIn } = await scenario(tab);
  check("sign-up lands on its portal", registered, expected);
  check("login honours the account's real role", loggedIn, expected);
}

await browser.close();
console.log(failures === 0 ? "\nALL CHECKS PASSED ✅" : `\n${failures} CHECK(S) FAILED ❌`);
process.exit(failures === 0 ? 0 : 1);