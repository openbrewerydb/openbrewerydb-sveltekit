/**
 * @file Breweries Listing End-to-End Tests
 * @description Tests listing, pagination, and navigation for /breweries.
 */
import { test, expect } from '@playwright/test';

test.describe('Breweries Listing', () => {
  /**
   * Should display breweries list heading and country links.
   */
  test('should display breweries list', async ({ page }) => {
    await page.goto('/breweries');
    await expect(
      page.getByRole('heading', { name: /list breweries/i, level: 1 })
    ).toBeVisible();
    const countryLinks = page.locator('.grid a');
    expect(await countryLinks.count()).toBeGreaterThan(5);
  });

  /**
   * Should navigate to a country listing from the breweries list.
   */
  test('should navigate to brewery details', async ({ page }) => {
    await page.goto('/breweries');
    const countryLink = page.locator('.grid a', { hasText: 'South Korea' });
    await countryLink.first().click();
    await expect(page).toHaveURL(/\/breweries\/South%20Korea/i);
    await expect(
      page.getByRole('heading', { name: /south korea/i })
    ).toBeVisible();
  });
});
