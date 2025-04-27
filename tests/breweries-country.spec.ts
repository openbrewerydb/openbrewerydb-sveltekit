/**
 * @file Breweries by Country End-to-End Tests
 * @description Tests filtering and listing breweries by country.
 */
import { test, expect } from '@playwright/test';

test.describe('Breweries by Country', () => {
  /**
   * Should filter breweries by country and show correct heading and table.
   */
  test('should filter breweries by country - desktop view', async ({
    page,
  }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/breweries/United%20States');
    await expect(
      page.getByRole('heading', { name: /united states/i })
    ).toBeVisible();
    // In desktop view, table should be visible
    await expect(page.getByRole('table')).toBeVisible();
    const rows = await page.getByRole('row');
    expect((await rows.count()) > 1).toBeTruthy();
    // Card view should be hidden
    expect(await page.locator('.grid-cols-1.gap-4').isHidden()).toBeTruthy();
  });

  test('should filter breweries by country - mobile view', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/breweries/United%20States');
    await expect(
      page.getByRole('heading', { name: /united states/i })
    ).toBeVisible();
    // In mobile view, table should be hidden
    expect(await page.getByRole('table').isHidden()).toBeTruthy();
    // Card view should be visible
    await expect(page.locator('.grid-cols-1.gap-4')).toBeVisible();
    const cards = await page.locator('.grid-cols-1.gap-4 > div').count();
    expect(cards).toBeGreaterThan(0);
  });

  /**
   * Should navigate to brewery details from country listing.
   */
  test('should navigate to brewery details from country listing - desktop view', async ({
    page,
  }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/breweries/United%20States');
    const firstBrewery = page.getByRole('row').nth(1); // skip header row
    const link = await firstBrewery.getByRole('link').first();
    const href = await link.getAttribute('href');
    expect(href).toBeTruthy();
    await link.click();
    await expect(page).toHaveURL(new RegExp(href ?? '', 'i'));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should navigate to brewery details from country listing - mobile view', async ({
    page,
  }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/breweries/United%20States');
    // In mobile view, we need to find the first card
    const cardLink = await page.locator('.grid-cols-1.gap-4 a').first();
    const href = await cardLink.getAttribute('href');
    expect(href).toBeTruthy();
    await cardLink.click();
    await expect(page).toHaveURL(new RegExp(href ?? '', 'i'));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
