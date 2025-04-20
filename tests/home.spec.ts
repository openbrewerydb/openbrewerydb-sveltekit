/**
 * @file Home Page End-to-End Tests
 * @description Covers loading, main content, and navigation from the home page.
 */
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load and display key content', async ({ page }) => {
    /**
     * Checks for:
     * - Page title
     * - Logo
     * - Main tagline and description
     * - Documentation button
     */
    await page.goto('/');
    await expect(page).toHaveTitle(/Open Brewery DB/i);
    // Logo
    const logo = page.locator('img[alt="Open Brewery DB Logo"]');
    await expect(logo).toBeVisible();
    // Tagline
    await expect(page.getByRole('heading', { name: /Free and open-source/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /brewery data/i })).toBeVisible();
    // Description
    await expect(page.getByText(/free dataset and API/i)).toBeVisible();
    // Documentation button
    const docBtn = page.getByRole('link', { name: /Read API Documentation/i });
    await expect(docBtn).toBeVisible();
    await expect(docBtn).toHaveAttribute('href', '/documentation');
  });

  test('should navigate to main routes from home', async ({ page }) => {
    /**
     * Checks navigation bar links work for:
     * - Breweries
     * - Docs
     * - FAQ
     * - Projects
     * - About
     */
    await page.goto('/');
    const navLinks: ReadonlyArray<{ label: string; href: string }> = [
      { label: 'Breweries', href: '/breweries' },
      { label: 'Docs', href: '/documentation' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Projects', href: '/projects' },
      { label: 'About', href: '/about' }
    ];
    const headerNav = page.locator('[data-testid="header-nav"]');
    const footerNav = page.locator('[data-testid="footer-nav"]');
    for (const nav of navLinks) {
      // Header nav
      const headerLink = headerNav.getByRole('link', { name: nav.label });
      await expect(headerLink).toBeVisible();
      await expect(headerLink).toHaveAttribute('href', nav.href);
      // Footer nav
      const footerLink = footerNav.getByRole('link', { name: nav.label });
      await expect(footerLink).toBeVisible();
      await expect(footerLink).toHaveAttribute('href', nav.href);
    }
    // Navigation: only click the header nav link
    await headerNav.getByRole('link', { name: 'Breweries' }).click();
    await expect(page).toHaveURL(/\/breweries/);
  });
});
