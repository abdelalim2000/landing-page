import { test, expect } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4173/';

async function collectRuntimeErrors(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

test.describe('NEXUS DYNAMICS Vite parity', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference', colorScheme: 'dark' });
  });

  test('boots the home motion system without runtime errors', async ({ page }) => {
    const errors = await collectRuntimeErrors(page);
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await expect(page.locator('#loader')).toBeHidden({ timeout: 6000 });

    await expect.poll(async () => page.evaluate(() => window.__NEXUS_DIAGNOSTICS__ ?? null)).not.toBeNull();
    const diagnostics = await page.evaluate(() => window.__NEXUS_DIAGNOSTICS__);

    expect(diagnostics.appStarted).toBe(true);
    expect(diagnostics.page).toBe('home');
    expect(diagnostics.scrollTriggerCount).toBeGreaterThan(0);
    expect(diagnostics.canvasCount).toBe(1);
    expect(diagnostics.webglRunning).toBe(true);
    expect(errors).toEqual([]);
  });

  test('restores the component CSS required by the storytelling layout', async ({ page }) => {
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await expect(page.locator('#loader')).toBeHidden({ timeout: 6000 });

    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.btn-magnetic').first()).toHaveCSS('display', 'inline-flex');

    const componentStyles = await page.evaluate(() => {
      const approach = document.querySelector('.approach-stage');
      const expertise = document.querySelector('.expertise-state');
      const accordion = document.querySelector('.accordion-content');
      return {
        approachPosition: approach ? getComputedStyle(approach).position : null,
        expertisePosition: expertise ? getComputedStyle(expertise).position : null,
        accordionOverflow: accordion ? getComputedStyle(accordion).overflow : null,
      };
    });

    expect(componentStyles.approachPosition).toBe('absolute');
    expect(componentStyles.expertisePosition).toBe('absolute');
    expect(componentStyles.accordionOverflow).toBe('hidden');
  });

  test('keeps a single correctly-sized WebGL canvas', async ({ page }) => {
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await expect(page.locator('#loader')).toBeHidden({ timeout: 6000 });

    await expect(page.locator('canvas')).toHaveCount(1);
    const box = await page.locator('#hero-canvas').boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeGreaterThan(300);
    expect(box.height).toBeGreaterThan(300);
  });

  test('does not overflow horizontally', async ({ page }) => {
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await expect(page.locator('#loader')).toBeHidden({ timeout: 6000 });
    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    );
    expect(noOverflow).toBe(true);
  });
});
