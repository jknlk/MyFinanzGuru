import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "http://localhost:3000";
const OUT_DIR = path.join(process.cwd(), "screenshots");

const PAGES = [
  { slug: "01-home", url: "/" },
  { slug: "02-services", url: "/services" },
  { slug: "03-services-detail", url: "/services/private-credits" },
  { slug: "04-tools-hub", url: "/tools" },
  { slug: "05-tool-finance-check", url: "/tools/finance-check" },
  { slug: "06-tool-real-estate", url: "/tools/real-estate" },
  { slug: "07-tool-health-insurance", url: "/tools/health-insurance" },
  { slug: "08-tool-investment", url: "/tools/investment" },
  { slug: "09-tool-brutto-netto", url: "/tools/brutto-netto" },
  { slug: "10-about", url: "/about" },
  { slug: "11-guide", url: "/guide" },
  { slug: "12-guide-article", url: "/guide/inflation-in-germany" },
  { slug: "13-webinar", url: "/webinar" },
  { slug: "14-book", url: "/book" },
  { slug: "15-impressum", url: "/impressum" },
  { slug: "16-datenschutz", url: "/datenschutz" },
  { slug: "17-admin-login", url: "/admin" },
];

async function getSectionHandles(page) {
  // main > (RevealScope div OR direct content) — find the meaningful section list
  const mainChild = page.locator("main > *").first();
  if ((await mainChild.count()) === 0) return [];

  let container = mainChild;
  let children = container.locator(":scope > *");
  let count = await children.count();

  // If the wrapper only has one child (a single page container div),
  // drill one level deeper to reach the actual sections.
  if (count === 1) {
    container = children.first();
    children = container.locator(":scope > *");
    count = await children.count();
  }

  const handles = [];
  for (let i = 0; i < count; i++) {
    handles.push(children.nth(i));
  }
  return handles;
}

async function shootPage(browser, { slug, url }) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  // Pre-accept the cookie banner so it doesn't cover fixed-bottom content in screenshots.
  await context.addInitScript(() => {
    window.localStorage.setItem("mfg-cookie-consent", "accepted");
  });
  const page = await context.newPage();

  const dir = path.join(OUT_DIR, slug);
  fs.mkdirSync(dir, { recursive: true });

  try {
    await page.goto(BASE_URL + url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(300);

    // Full page screenshot first, for reference.
    await page.screenshot({ path: path.join(dir, "00-full-page.png"), fullPage: true });

    const sections = await getSectionHandles(page);
    let i = 1;
    for (const section of sections) {
      try {
        const box = await section.boundingBox();
        if (!box || box.height < 4) continue; // skip empty/invisible elements
        await section.scrollIntoViewIfNeeded();
        await page.waitForTimeout(150);
        const filename = `${String(i).padStart(2, "0")}-section.png`;
        await section.screenshot({ path: path.join(dir, filename) });
        i++;
      } catch (err) {
        console.warn(`  [warn] section ${i} on ${slug} failed: ${err.message}`);
      }
    }
    console.log(`✓ ${slug} (${url}) — ${i - 1} sections + full page`);
  } catch (err) {
    console.error(`✗ ${slug} (${url}) failed: ${err.message}`);
  } finally {
    await context.close();
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome" });

  for (const p of PAGES) {
    await shootPage(browser, p);
  }

  await browser.close();
  console.log(`\nDone. Screenshots in ${OUT_DIR}`);
}

main();
