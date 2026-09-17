/**
 * End-to-end regression suite for the auth + onboarding flow, driving the real
 * forms in a real browser rather than mocking the client.
 *
 * Covers: signup name persistence, the greeting it feeds, session survival,
 * returnTo deep-link handling, per-role landing, cross-portal denial, error
 * messaging, the password-reset round trip, and profile renaming.
 *
 *   npm run build && npx vite preview --port 4173
 *   node scripts/auth-flow-check.mjs [baseUrl]
 */
import puppeteer from "puppeteer-core";

const B = process.argv[2] || "http://localhost:4173";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: "/usr/bin/chromium", headless: "new", protocolTimeout: 240000, args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 950 });
const errs = [];
p.on("pageerror", (e) => errs.push(String(e.message).slice(0, 110)));
p.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text().slice(0, 110)); });

const findings = [];
const note = (ok, label, detail = "") => {
  findings.push({ ok, label, detail });
  console.log(`  ${ok ? "OK  " : "BUG "} ${label}${detail ? ` — ${detail}` : ""}`);
};

const stamp = Date.now();
const email = `probe.${stamp}@example.com`;
const PASSWORD = "Secret123!";

// ---------------------------------------------------------------- 1. signup
console.log("\n1. Signup with a first and last name");
await p.goto(B + "/register", { waitUntil: "domcontentloaded", timeout: 45000 });
await p.waitForSelector("form");
await sleep(800);
let ins = await p.$$("form input");
for (const [i, v] of [[0, "Amara"], [1, "Okonkwo"], [2, email], [3, PASSWORD], [4, PASSWORD]]) {
  if (ins[i]) { await ins[i].click({ clickCount: 3 }); await ins[i].type(v, { delay: 5 }); }
}
await p.click('form button[type="submit"]');
await sleep(3000);
const afterSignup = await p.evaluate(() => location.pathname);
note(afterSignup === "/dashboard", "signup lands on the member portal", `got ${afterSignup}`);

// The name typed at signup must reach the profile the app renders.
const profile = await p.evaluate(() => {
  const users = JSON.parse(localStorage.getItem("nv_auth_users") || "[]");
  const u = users[users.length - 1] || {};
  return { full_name: u.full_name ?? null, first_name: u.first_name ?? null, last_name: u.last_name ?? null, role: u.role };
});
const nameStored = profile.full_name || [profile.first_name, profile.last_name].filter(Boolean).join(" ");
note(!!nameStored, "name typed at signup is persisted", `stored=${JSON.stringify(profile)}`);

// The dashboard greets by name; "Valued Member" means the name was lost.
const greeting = await p.evaluate(() => {
  const t = document.body.innerText;
  const m = t.match(/Hello,\s*([^\n!]{0,40})/i);
  return m ? m[1].trim() : null;
});
note(greeting && !/Valued Member/i.test(greeting), "dashboard greets the member by name", `greeting=${JSON.stringify(greeting)}`);

// ------------------------------------------------- 2. session + reload
console.log("\n2. Session survives a reload");
await p.reload({ waitUntil: "domcontentloaded" });
await sleep(2500);
const afterReload = await p.evaluate(() => location.pathname);
note(afterReload === "/dashboard", "reload keeps the session", `got ${afterReload}`);

// ------------------------------------------------- 3. returnTo honoured
console.log("\n3. returnTo is honoured after login");
await p.evaluate(() => ["nv_auth_session", "nv_auth_token"].forEach((k) => localStorage.removeItem(k)));
await p.goto(B + "/wallet", { waitUntil: "domcontentloaded", timeout: 45000 });
await sleep(1800);
const guardRedirect = await p.evaluate(() => location.pathname + location.search);
note(/\/login/.test(guardRedirect), "protected route redirects to login", `got ${guardRedirect}`);
// The guard must remember where the visitor was headed.
note(/returnTo=/.test(guardRedirect), "guard preserves the intended destination", `got ${guardRedirect}`);

await p.goto(B + "/login?returnTo=%2Fwallet", { waitUntil: "domcontentloaded", timeout: 45000 });
await p.waitForSelector("form");
await sleep(700);
ins = await p.$$("form input");
for (const [i, v] of [[0, email], [1, PASSWORD]]) {
  if (ins[i]) { await ins[i].click({ clickCount: 3 }); await ins[i].type(v, { delay: 5 }); }
}
await p.click('form button[type="submit"]');
await sleep(3000);
const afterLogin = await p.evaluate(() => location.pathname);
note(afterLogin === "/wallet", "login returns to the requested page", `got ${afterLogin}`);

// ------------------------------------------------- 4. role routing
console.log("\n4. Each role reaches its own portal");
for (const [role, expected] of [["business", "/business"], ["hr_admin", "/corporate-dashboard"], ["subscriber", "/dashboard"]]) {
  await p.goto(B + "/", { waitUntil: "domcontentloaded" });
  await p.evaluate((r) => {
    const users = JSON.parse(localStorage.getItem("nv_auth_users") || "[]");
    const u = users[users.length - 1];
    if (u) { u.role = r; u.account_type = r === "business" ? "business" : r === "hr_admin" ? "corporate" : "individual"; localStorage.setItem("nv_auth_users", JSON.stringify(users)); }
    ["nv_auth_session", "nv_auth_token"].forEach((k) => localStorage.removeItem(k));
  }, role);
  await p.goto(B + "/login", { waitUntil: "domcontentloaded", timeout: 45000 });
  await p.waitForSelector("form");
  await sleep(600);
  ins = await p.$$("form input");
  for (const [i, v] of [[0, email], [1, PASSWORD]]) {
    if (ins[i]) { await ins[i].click({ clickCount: 3 }); await ins[i].type(v, { delay: 5 }); }
  }
  await p.click('form button[type="submit"]');
  await sleep(2800);
  const got = await p.evaluate(() => location.pathname);
  note(got === expected, `${role} lands on ${expected}`, `got ${got}`);
}

// ------------------------------------------- 5. cross-portal access
console.log("\n5. A member must not reach another portal's pages");
await p.goto(B + "/", { waitUntil: "domcontentloaded" });
await p.evaluate(() => {
  const users = JSON.parse(localStorage.getItem("nv_auth_users") || "[]");
  const u = users[users.length - 1];
  if (u) { u.role = "subscriber"; u.account_type = "individual"; localStorage.setItem("nv_auth_users", JSON.stringify(users)); }
  ["nv_auth_session", "nv_auth_token"].forEach((k) => localStorage.removeItem(k));
});
await p.goto(B + "/login", { waitUntil: "domcontentloaded", timeout: 45000 });
await p.waitForSelector("form");
await sleep(600);
ins = await p.$$("form input");
for (const [i, v] of [[0, email], [1, PASSWORD]]) {
  if (ins[i]) { await ins[i].click({ clickCount: 3 }); await ins[i].type(v, { delay: 5 }); }
}
await p.click('form button[type="submit"]');
await sleep(2800);

for (const [route, label] of [["/business", "partner dashboard"], ["/admin", "admin console"], ["/admin/users", "admin users"]]) {
  await p.goto(B + route, { waitUntil: "domcontentloaded", timeout: 45000 });
  await sleep(2000);
  const state = await p.evaluate(() => ({
    path: location.pathname,
    denied: /access required|not authorised|not authorized|permission|forbidden/i.test(document.body.innerText),
  }));
  note(state.denied || state.path !== route, `member blocked from the ${label}`, `path=${state.path} denied=${state.denied}`);
}

// ------------------------------------------- 6. duplicate + bad password
console.log("\n6. Error handling");
await p.goto(B + "/", { waitUntil: "domcontentloaded" });
await p.evaluate(() => ["nv_auth_session", "nv_auth_token"].forEach((k) => localStorage.removeItem(k)));
await p.goto(B + "/register", { waitUntil: "domcontentloaded", timeout: 45000 });
await p.waitForSelector("form");
await sleep(700);
ins = await p.$$("form input");
for (const [i, v] of [[0, "Amara"], [1, "Okonkwo"], [2, email], [3, PASSWORD], [4, PASSWORD]]) {
  if (ins[i]) { await ins[i].click({ clickCount: 3 }); await ins[i].type(v, { delay: 5 }); }
}
await p.click('form button[type="submit"]');
await sleep(2500);
const dupMsg = await p.evaluate(() => document.body.innerText.match(/already exists[^\n]*/i)?.[0] || null);
note(!!dupMsg, "duplicate email is refused with a message", `msg=${JSON.stringify(dupMsg)}`);

await p.goto(B + "/login", { waitUntil: "domcontentloaded", timeout: 45000 });
await p.waitForSelector("form");
await sleep(700);
ins = await p.$$("form input");
for (const [i, v] of [[0, email], [1, "WrongPassword9!"]]) {
  if (ins[i]) { await ins[i].click({ clickCount: 3 }); await ins[i].type(v, { delay: 5 }); }
}
await p.click('form button[type="submit"]');
await sleep(2500);
const badMsg = await p.evaluate(() => document.body.innerText.match(/incorrect email or password[^\n]*/i)?.[0] || null);
note(!!badMsg, "wrong password shows a clear error", `msg=${JSON.stringify(badMsg)}`);

// ------------------------------------------- 7. password reset round trip
console.log("\n7. Password reset round trip");
await p.goto(B + "/forgot-password", { waitUntil: "domcontentloaded", timeout: 45000 });
await p.waitForSelector("form");
await sleep(700);
ins = await p.$$("form input");
if (ins[0]) { await ins[0].click({ clickCount: 3 }); await ins[0].type(email, { delay: 5 }); }
await p.click('form button[type="submit"]');
await sleep(2500);

// The token is surfaced in the UI because there is no mail transport in demo
// mode. Reset the password and prove the old one is actually retired.
const resetLink = await p.evaluate(() => {
  const a = [...document.querySelectorAll("a")].find((x) => x.getAttribute("href")?.startsWith("/reset-password"));
  return a ? a.getAttribute("href") : null;
});
note(!!resetLink, "reset link is offered to the visitor", `href=${resetLink}`);

const NEW_PASSWORD = "BrandNew456!";
if (resetLink) {
  await p.goto(B + resetLink, { waitUntil: "domcontentloaded", timeout: 45000 });
  await p.waitForSelector("form");
  await sleep(700);
  ins = await p.$$("form input");
  for (const [i, v] of [[0, NEW_PASSWORD], [1, NEW_PASSWORD]]) {
    if (ins[i]) { await ins[i].click({ clickCount: 3 }); await ins[i].type(v, { delay: 5 }); }
  }
  await p.click('form button[type="submit"]');
  await sleep(2800);
  const landed = await p.evaluate(() => location.pathname);
  note(landed === "/login", "reset lands back on login", `got ${landed}`);

  await p.waitForSelector("form");
  await sleep(800);
  ins = await p.$$("form input");
  for (const [i, v] of [[0, email], [1, PASSWORD]]) {
    if (ins[i]) { await ins[i].click({ clickCount: 3 }); await ins[i].type(v, { delay: 5 }); }
  }
  await p.click('form button[type="submit"]');
  await sleep(2500);
  const oldRejected = await p.evaluate(() => /incorrect email or password/i.test(document.body.innerText));
  note(oldRejected, "the old password no longer works", "");

  await p.goto(B + "/login", { waitUntil: "domcontentloaded", timeout: 45000 });
  await p.waitForSelector("form");
  await sleep(800);
  ins = await p.$$("form input");
  for (const [i, v] of [[0, email], [1, NEW_PASSWORD]]) {
    if (ins[i]) { await ins[i].click({ clickCount: 3 }); await ins[i].type(v, { delay: 5 }); }
  }
  await p.click('form button[type="submit"]');
  await sleep(2800);
  const newWorks = await p.evaluate(() => location.pathname);
  note(newWorks === "/dashboard", "the new password signs in", `got ${newWorks}`);
}

// ------------------------------------------- 8. profile rename stays in step
console.log("\n8. Renaming on the profile keeps the name parts in step");
await p.goto(B + "/profile", { waitUntil: "domcontentloaded", timeout: 45000 });
await sleep(2200);
const found = await p.evaluate(() => {
  const inp = [...document.querySelectorAll("input")].find((i) => i.value && /Amara/.test(i.value));
  if (!inp) return false;
  // React tracks the input's value, so write through the native setter and fire
  // the event React listens for rather than assigning .value directly.
  const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  set.call(inp, "Amara Ngozi Okonkwo");
  inp.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
});
if (found) {
  await p.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((x) => /save/i.test(x.textContent));
    if (btn) btn.click();
  });
  await sleep(2000);
  const renamed = await p.evaluate(() => {
    const u = JSON.parse(localStorage.getItem("nv_auth_users") || "[]").at(-1) || {};
    return { full_name: u.full_name, first_name: u.first_name, last_name: u.last_name };
  });
  note(
    renamed.full_name === "Amara Ngozi Okonkwo" && renamed.first_name === "Amara" && renamed.last_name === "Ngozi Okonkwo",
    "the profile rename updates full_name and its parts",
    JSON.stringify(renamed)
  );
} else {
  note(false, "the profile name field was reachable", "");
}

console.log("\npage errors seen:", errs.length);
[...new Set(errs)].slice(0, 6).forEach((e) => console.log("   " + e));

const bugs = findings.filter((f) => !f.ok);
console.log(`\n${findings.length - bugs.length}/${findings.length} checks pass · ${bugs.length} BUG(S)`);
bugs.forEach((f) => console.log(`  BUG: ${f.label} — ${f.detail}`));
await b.close();