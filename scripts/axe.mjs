/**
 * Runs axe-core against the Vite preview URL (production client build).
 * Same engine as @axe-core/react; uses Playwright for CI-friendly automation.
 */
import { chromium } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

const url = process.env.AXE_URL ?? "http://127.0.0.1:4173";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

try {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  if (results.violations.length > 0) {
    console.error("axe-core violations:", results.violations.length);
    for (const v of results.violations) {
      console.error(`- ${v.id}: ${v.help} (${v.nodes.length} node(s))`);
      for (const n of v.nodes.slice(0, 5)) {
        console.error(`    ${n.html}`);
      }
      if (v.nodes.length > 5) {
        console.error(`    … and ${v.nodes.length - 5} more`);
      }
    }
    process.exitCode = 1;
  } else {
    console.log("axe-core: no WCAG 2.x A/AA violations.");
  }
} finally {
  await context.close();
  await browser.close();
}
