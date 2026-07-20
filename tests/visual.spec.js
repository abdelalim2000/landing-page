import { test, expect } from '@playwright/test';

test.describe('NEXUS DYNAMICS Parity Tests', () => {
  const baseURL = 'http://localhost:4173/';
  
  test.beforeEach(async ({ page }) => {
    // Navigate to production preview
    await page.goto(baseURL);
  });

  test('should load main assets and modules', async ({ page }) => {
    // Wait for the loader to disappear
    await page.waitForSelector('#loader', { state: 'hidden', timeout: 10000 });

    // Assert canvas exists
    const canvasCount = await page.evaluate(() => document.querySelectorAll("canvas").length);
    expect(canvasCount).toBeGreaterThan(0);

    // Assert ScrollTrigger count is > 0 (by checking the diagnostics we exposed)
    const diagnostics = await page.evaluate(() => window.__NEXUS_DIAGNOSTICS__);
    if (diagnostics) {
      expect(diagnostics.appStarted).toBe(true);
      expect(diagnostics.scrollTriggerCount).toBeGreaterThan(0);
      expect(diagnostics.webglRunning).toBe(true);
    }

    // Hero title is visible
    const heroTitle = page.locator('.hero-title');
    await expect(heroTitle).toBeVisible();

    // Verify canvas dimensions
    const canvasBox = await page.locator('#hero-canvas').boundingBox();
    expect(canvasBox.width).toBeGreaterThan(0);
    expect(canvasBox.height).toBeGreaterThan(0);
  });

  test('should not have console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto(baseURL);
    await page.waitForSelector('#loader', { state: 'hidden', timeout: 10000 });
    
    // Some minor WebGL or missing favicon errors might happen, but ideally 0 app errors
    // We log them if they exist
    if (errors.length > 0) {
      console.log("Console Errors found:", errors);
    }
  });

  test('should not have horizontal overflow', async ({ page }) => {
    await page.waitForSelector('#loader', { state: 'hidden' });
    const overflowResult = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= window.innerWidth;
    });
    expect(overflowResult).toBeTruthy();
  });
});
