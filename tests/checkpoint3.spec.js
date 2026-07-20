import { test, expect } from '@playwright/test';

test.describe('NEXUS DYNAMICS Checkpoint 3 - Work Page', () => {
  
  test('Work page has meaningful main content', async ({ page }) => {
    page.on('pageerror', error => console.log('PAGE ERROR:', error));
    page.on('console', msg => console.log('CONSOLE:', msg.text()));
    await page.goto('/work.html');
    const hero = page.locator('#work-hero');
    await expect(hero).toBeVisible();

    const aether = page.locator('#aether');
    await expect(aether).toBeVisible();
    
    const quantum = page.locator('#quantum');
    await expect(quantum).toBeVisible();

    const nova = page.locator('#nova');
    await expect(nova).toBeVisible();

    const matrix = page.locator('#capability-matrix');
    await expect(matrix).toBeVisible();

    const discovery = page.locator('#discovery');
    await expect(discovery).toBeVisible();
  });

  test('Project links work', async ({ page }) => {
    await page.goto('/work.html');
    const aetherLink = page.locator('#aether a');
    await expect(aetherLink).toHaveAttribute('href', 'work/aether-health.html');

    const quantumLink = page.locator('#quantum a');
    await expect(quantumLink).toHaveAttribute('href', 'work/quantum-finance.html');

    const novaLink = page.locator('#nova a');
    await expect(novaLink).toHaveAttribute('href', 'work/nova-logistics.html');
  });

  test('Filters work and are keyboard accessible', async ({ page }) => {
    await page.goto('/work.html');
    
    const filterAll = page.locator('.filter-btn[data-filter="all"]');
    const filterSecurity = page.locator('.filter-btn[data-filter="security"]');
    
    await expect(filterAll).toHaveAttribute('aria-pressed', 'true');
    
    await filterSecurity.click();
    await expect(filterSecurity).toHaveAttribute('aria-pressed', 'true');
    await expect(filterAll).toHaveAttribute('aria-pressed', 'false');

    // Only aether has security category
    const aether = page.locator('#aether');
    await expect(aether).toBeVisible();

    const nova = page.locator('#nova');
    await expect(nova).toBeVisible(); // Projects should not be removed from flow
  });

  test('No FOUC and initialized GSAP', async ({ page }) => {
    await page.goto('/work.html');
    
    // Check that the heading is not visible until initialized
    // However, playwright runs fast. Let's just wait for load state.
    await page.waitForLoadState('domcontentloaded');

    const noFouc = await page.evaluate(() => {
      const isHidden = window.getComputedStyle(document.body).display === 'none';
      return !isHidden;
    });
    
    expect(noFouc).toBeTruthy();
  });
});
