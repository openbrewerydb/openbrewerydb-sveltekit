/**
 * @file Breweries by Country End-to-End Tests
 * @description Tests filtering and listing breweries by country.
 */
import { test, expect } from '@playwright/test';

test.describe('Breweries by Country', () => {
  /**
   * Should filter breweries by country and show correct heading and table.
   */
  test('should filter breweries by country', async ({ page }) => {
    await page.goto('/breweries/United%20States');
    await expect(page.getByRole('heading', { name: /united states/i })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
    const rows = await page.getByRole('row');
    expect((await rows.count()) > 1).toBeTruthy();
  });

  /**
   * Should navigate to brewery details from country listing.
   */
  test('should navigate to brewery details from country listing', async ({ page }) => {
    await page.goto('/breweries/United%20States');
    const firstBrewery = page.getByRole('row').nth(1); // skip header row
    const link = await firstBrewery.getByRole('link').first();
    const href = await link.getAttribute('href');
    expect(href).toBeTruthy();
    await link.click();
    await expect(page).toHaveURL(new RegExp(href ?? '', 'i'));
    await expect(page.getByRole('heading')).toBeVisible();
  });
});
