import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ARTIFACT_DIR = path.resolve('C:/Users/moham/.gemini/antigravity/brain/ea67026c-25f1-4ad7-bc58-5c5a53681dfa/');

const indexUrl = 'file://' + path.join(__dirname, 'index.html').replace(/\\/g, '/');
const aetherUrl = 'file://' + path.join(__dirname, 'work', 'aether-health.html').replace(/\\/g, '/');
const quantumUrl = 'file://' + path.join(__dirname, 'work', 'quantum-finance.html').replace(/\\/g, '/');
const novaUrl = 'file://' + path.join(__dirname, 'work', 'nova-logistics.html').replace(/\\/g, '/');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set desktop viewport
  await page.setViewportSize({ width: 1440, height: 900 });

  // Load index
  await page.goto(indexUrl);
  await page.waitForTimeout(1000);

  // Helper to scroll to element and wait
  const scrollToAndWait = async (selector, offset = 0) => {
    await page.evaluate(({sel, off}) => {
      const el = document.querySelector(sel);
      if(el) {
        const y = el.getBoundingClientRect().top + window.scrollY + off;
        window.scrollTo({top: y, behavior: 'instant'});
      }
    }, {sel: selector, off: offset});
    await page.waitForTimeout(1000);
  };

  console.log("1. Core Capabilities at capability 01");
  await scrollToAndWait('.expertise-trigger[data-index="0"]', -300);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '01_capabilities_01.png') });

  console.log("2. Core Capabilities at capability 04");
  await scrollToAndWait('.expertise-trigger[data-index="3"]', -300);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '02_capabilities_04.png') });

  console.log("3. Core Capabilities at capability 06");
  await scrollToAndWait('.expertise-trigger[data-index="5"]', -300);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_capabilities_06.png') });

  console.log("4. System Construction — Discover");
  // The scroll container is 400vh tall. Let's scroll by percentage of container height
  await page.evaluate(() => {
    const el = document.getElementById('approach-scroll-container');
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({top: y + (el.offsetHeight * 0.1), behavior: 'instant'});
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '04_system_discover.png') });

  console.log("5. System Construction — Architect");
  await page.evaluate(() => {
    const el = document.getElementById('approach-scroll-container');
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({top: y + (el.offsetHeight * 0.35), behavior: 'instant'});
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '05_system_architect.png') });

  console.log("6. System Construction — Engineer");
  await page.evaluate(() => {
    const el = document.getElementById('approach-scroll-container');
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({top: y + (el.offsetHeight * 0.60), behavior: 'instant'});
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '06_system_engineer.png') });

  console.log("7. System Construction — Optimize");
  await page.evaluate(() => {
    const el = document.getElementById('approach-scroll-container');
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({top: y + (el.offsetHeight * 0.90), behavior: 'instant'});
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '07_system_optimize.png') });

  console.log("8. Contact form in dark mode");
  await scrollToAndWait('#contact', 0);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '08_contact_dark.png') });

  console.log("9. Contact form in light mode");
  await page.evaluate(() => document.getElementById('theme-toggle-desktop').click());
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '09_contact_light.png') });

  console.log("10. Home page light-mode hero");
  await scrollToAndWait('#hero', 0);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '10_hero_light.png') });

  console.log("11. Aether Health case-study page");
  await page.goto(aetherUrl);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '11_aether_health.png'), fullPage: true });

  console.log("12. Quantum Finance case-study page");
  await page.goto(quantumUrl);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '12_quantum_finance.png'), fullPage: true });

  console.log("13. Nova Logistics case-study page");
  await page.goto(novaUrl);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '13_nova_logistics.png'), fullPage: true });

  console.log("14. Mobile light mode");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(indexUrl);
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    if(document.documentElement.getAttribute('data-theme') !== 'light') {
       document.getElementById('theme-toggle-mobile').click();
    }
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '14_mobile_light.png'), fullPage: true });

  console.log("15. Mobile dark mode");
  await page.evaluate(() => document.getElementById('theme-toggle-mobile').click());
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '15_mobile_dark.png'), fullPage: true });

  console.log("Screenshots completed.");
  await browser.close();
}

run().catch(console.error);
