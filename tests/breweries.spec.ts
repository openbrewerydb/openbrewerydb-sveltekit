/**
 * @file Breweries Listing End-to-End Tests
 * @description Tests landing state and redirect behavior for /breweries.
 * API-dependent tests (search, pagination, navigation) deferred to a future story.
 */
import { test, expect } from '@playwright/test';

test.describe('Breweries Listing', () => {
  /**
   * Should display breweries list heading and country links.
   */
  test('should display heading', async ({ page }) => {
    await page.goto('/breweries');
    // CSR route: content appears only after the app shell boots
    await expect(
      page.getByRole('heading', { name: /Search Breweries/i, level: 1 })
    ).toBeVisible({ timeout: 15000 });
  });

  /**
   * Landing state (no query) shows CTA to browse.
   */
  test('landing shows CTA when no query', async ({ page }) => {
    await page.goto('/breweries');
    const cta = page.getByRole('link', { name: /Browse Breweries/i });
    await expect(cta).toBeVisible({ timeout: 15000 });
    await expect(cta).toHaveAttribute('href', '/breweries/browse');
  });

  /**
   * Empty or whitespace query canonicalizes to /breweries
   */
  test('empty or whitespace query redirects to /breweries', async ({
    page,
  }) => {
    await page.goto('/breweries?query=');
    await expect(page).toHaveURL('/breweries', { timeout: 15000 });

    await page.goto('/breweries?query=%20%20%20');
    await expect(page).toHaveURL('/breweries', { timeout: 15000 });
  });
});
