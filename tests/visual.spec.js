import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viewports = [
  { width: 320, height: 568 },
  { width: 375, height: 812 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 }
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const filePath = 'file://' + path.join(__dirname, 'index.html').replace(/\\/g, '/');
  
  let hasErrors = false;
  let consoleErrors = 0;

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error(`Browser Error: ${msg.text()}`);
      consoleErrors++;
      hasErrors = true;
    }
  });

  page.on('pageerror', err => {
    console.error(`Page Error: ${err.message}`);
    consoleErrors++;
    hasErrors = true;
  });

  // Navigate and wait for loader timeout or completion
  await page.goto(filePath);

  for (const vp of viewports) {
    await page.setViewportSize(vp);
    // Wait for GSAP transitions and layout to settle
    await page.waitForTimeout(2000); 

    console.log(`\nTesting viewport: ${vp.width}x${vp.height}`);
    
    // 1. Check Horizontal Overflow
    const overflowResult = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        pass: document.documentElement.scrollWidth <= window.innerWidth
      };
    });

    if (!overflowResult.pass) {
      console.error(`[FAIL] Horizontal overflow detected! scrollWidth: ${overflowResult.scrollWidth}, innerWidth: ${overflowResult.innerWidth}`);
      hasErrors = true;
    } else {
      console.log(`[PASS] No horizontal overflow.`);
    }

    // 2. Section bounds check
    const sectionFails = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section'));
      return sections.map(s => ({
        id: s.id || s.className,
        width: s.clientWidth,
        height: s.clientHeight
      })).filter(s => s.width === 0 || s.height === 0);
    });

    if (sectionFails.length > 0) {
      console.error(`[FAIL] Zero-dimension sections found:`, sectionFails);
      hasErrors = true;
    } else {
      console.log(`[PASS] All sections have valid dimensions.`);
    }

    // Capture screenshot
    await page.screenshot({ path: `screenshot_chk1_${vp.width}x${vp.height}.png`, fullPage: true });
  }

  // Duplicate IDs
  const duplicateIds = await page.evaluate(() => {
    const ids = Array.from(document.querySelectorAll('[id]')).map(el => el.id).filter(id => id);
    const duplicates = ids.filter((item, index) => ids.indexOf(item) !== index);
    return [...new Set(duplicates)];
  });
  
  if (duplicateIds.length > 0) {
    console.error(`[FAIL] Duplicate IDs found: ${duplicateIds.join(', ')}`);
    hasErrors = true;
  } else {
    console.log(`[PASS] No duplicate IDs.`);
  }

  console.log(`\nConsole Error Count: ${consoleErrors}`);

  await browser.close();

  if (hasErrors) {
    console.error('\nTests completed with errors.');
    process.exit(1);
  } else {
    console.log('\nAll validation tests passed successfully.');
    process.exit(0);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
