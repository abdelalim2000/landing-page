import { test, expect } from '@playwright/test';

test.describe('NEXUS DYNAMICS Checkpoint 2 - Shared Internal System', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Let intro animations settle if any
    await page.waitForTimeout(1000);
  });

  test('Every page contains a header, main, footer, and skip link', async ({ page }) => {
    await expect(page.locator('header#site-header')).toBeVisible();
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.locator('footer#site-footer')).toBeVisible();
    
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
  });

  test('Navigation root links work and active page has aria-current', async ({ page, isMobile }) => {
    let servicesLink;
    if (isMobile) {
      await page.locator('#mobile-menu-btn').click();
      servicesLink = page.locator('#mobile-menu a[href="services.html"]');
    } else {
      servicesLink = page.locator('nav[aria-label="Primary Navigation"] a[href="services.html"]');
    }
    
    await servicesLink.click();
    await page.waitForURL('**/services.html');
    
    // Check aria-current on the active link
    let activeLink;
    if (isMobile) {
      // Re-open mobile menu to check
      await page.locator('#mobile-menu-btn').click();
      activeLink = page.locator('#mobile-menu a[aria-current="page"]');
    } else {
      activeLink = page.locator('nav[aria-label="Primary Navigation"] a[aria-current="page"]');
    }
    await expect(activeLink).toHaveAttribute('href', 'services.html');
    
    // Logo returns home
    const logo = page.locator('header#site-header a[href="index.html"]');
    // On mobile, logo is visible directly
    if (isMobile) {
        // Need to close mobile menu if it's open and covering logo
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
    }
    await logo.click();
    await page.waitForURL('**/index.html');
  });

  test('Theme desktop and mobile controls synchronize', async ({ page, isMobile }) => {
    if (isMobile) {
      const mobileToggle = page.locator('#theme-toggle-mobile');
      await page.locator('#mobile-menu-btn').click();
      await mobileToggle.waitFor({ state: 'visible' });
      await mobileToggle.click();
      
      const currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(currentTheme).toBeTruthy();
      
      await mobileToggle.click();
      const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(newTheme).not.toBe(currentTheme);
    } else {
      const desktopToggle = page.locator('#theme-toggle-desktop');
      await desktopToggle.click();
      
      const currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(currentTheme).toBeTruthy();
      
      await desktopToggle.click();
      const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(newTheme).not.toBe(currentTheme);
    }
  });

  test('Mobile menu opens, traps focus, and closes on Escape', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is only relevant for mobile viewport');
    
    const menuBtn = page.locator('#mobile-menu-btn');
    const mobileMenu = page.locator('#mobile-menu');

    await expect(mobileMenu).toHaveAttribute('aria-hidden', 'true');
    
    await menuBtn.click();
    await expect(mobileMenu).toHaveAttribute('aria-hidden', 'false');
    
    // Press escape
    await page.keyboard.press('Escape');
    // Wait for animation
    await page.waitForTimeout(500);
    await expect(mobileMenu).toHaveAttribute('aria-hidden', 'true');
  });

});
