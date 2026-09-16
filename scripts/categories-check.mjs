// Verifies each category tab shows a distinct, correctly-loaded image.
// Guards against a category slipping back to a mismatched or missing picture.
import puppeteer from "puppeteer-core";

const b = await puppeteer.launch({ executablePath: "/usr/bin/chromium", headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 950 });
const errs = [];
p.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 100)); });
p.on("pageerror", (e) => errs.push("PAGEERROR " + e));
await p.goto("http://localhost:4173/", { waitUntil: "networkidle2", timeout: 40000 });
await new Promise((r) => setTimeout(r, 2000));

await p.evaluate(() => document.getElementById("categories")?.scrollIntoView());
await new Promise((r) => setTimeout(r, 1000));

const tabs = await p.evaluate(() => {
  const sec = document.getElementById("categories");
  return [...sec.querySelectorAll('[role="tab"]')].map((t) => t.textContent.trim());
});
console.log(`tabs=${tabs.length}`);

const seen = [];
for (let i = 0; i < tabs.length; i++) {
  await p.evaluate((idx) => {
    const sec = document.getElementById("categories");
    sec.querySelectorAll('[role="tab"]')[idx].click();
  }, i);
  await new Promise((r) => setTimeout(r, 550));
  const info = await p.evaluate(() => {
    const sec = document.getElementById("categories");
    const img = sec.querySelector('img[alt]');
    if (!img) return null;
    return { src: img.getAttribute("src"), alt: img.getAttribute("alt"),
             ok: img.complete && img.naturalWidth > 0, w: img.naturalWidth };
  });
  seen.push(info);
  console.log(`${String(i).padStart(2)} ${(info?.alt || "?").padEnd(26)} ` +
              `${info?.ok ? "loaded" : "BROKEN"} ${info?.w}px  ${info?.src}`);
}

const unique = new Set(seen.map((s) => s?.src)).size;
const broken = seen.filter((s) => !s?.ok).length;
console.log(`\ndistinct images=${unique}/${tabs.length} broken=${broken} consoleErrors=${errs.length}`);
errs.slice(0, 3).forEach((e) => console.log("  ERR", e));
await b.close();