/**
 * @file Navigation End-to-End Tests
 * @description Tests navigation bar/sidebar links and cross-page navigation.
 */
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  /**
   * Should navigate to all major routes from nav.
   */
  test('should navigate to all major routes from nav', async ({ page }) => {
    await page.goto('/');
    const navLinks = [
      { name: /breweries/i, url: '/breweries' },
      { name: /documentation|docs/i, url: '/documentation' },
      { name: /faq/i, url: '/faq' },
      { name: /projects/i, url: '/projects' },
      { name: /about/i, url: '/about' },
    ];
    const headerNav = page.locator('[data-testid="header-nav"]');
    for (const { name, url } of navLinks) {
      const link = headerNav.getByRole('link', { name });
      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(url);
      await page.goBack();
    }
  });
});
