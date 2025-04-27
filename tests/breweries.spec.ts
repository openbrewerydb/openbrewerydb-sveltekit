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

test.describe('Brewery Type Filtering', () => {
  /**
   * Test brewery type filtering at state level
   */
  test('should filter breweries by type at state level', async ({ page }) => {
    // Navigate to a state page with enough screen size to see the table
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/breweries/United%20States/California');

    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');

    // Find a brewery type link and get its text
    const breweryTypeLink = page.getByTestId('brewery-type-link').first();
    await expect(breweryTypeLink).toBeVisible({ timeout: 10000 });
    const breweryType = await breweryTypeLink.textContent() || '';

    // Click the brewery type link
    await breweryTypeLink.click();

    // Wait for navigation to complete
    await page.waitForURL(/by_type/);

    // Verify URL contains the brewery type parameter at state level
    await expect(page).toHaveURL(new RegExp(`/breweries/United%20States/California\\?by_type=${breweryType.trim()}`, 'i'));

    // Verify all displayed breweries are of the selected type
    const breweryTypeLinks = page.locator('[data-testid="brewery-type-link"]');
    const linksCount = await breweryTypeLinks.count();
    expect(linksCount).toBeGreaterThan(0);

    const count = await breweryTypeLinks.count();
    for (let i = 0; i < count; i++) {
      const typeText = await breweryTypeLinks.nth(i).textContent() || '';
      expect(typeText.trim().toLowerCase()).toBe(breweryType.trim().toLowerCase());
    }

    // Test pagination with brewery type filter if available
    const nextButton = page.locator('a:has-text("Next")');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForURL(/page=2|\\d\/2/);

      // Verify URL maintains brewery type filter
      await expect(page).toHaveURL(new RegExp(`by_type=${breweryType.trim()}`, 'i'));

      // Verify filtered breweries are still displayed correctly
      const breweryTypeLinksPage2 = page.getByTestId('brewery-type-link');
      const linksCountPage2 = await breweryTypeLinksPage2.count();
      expect(linksCountPage2).toBeGreaterThan(0);

      const countPage2 = await breweryTypeLinksPage2.count();
      for (let i = 0; i < countPage2; i++) {
        const typeText = await breweryTypeLinksPage2.nth(i).textContent() || '';
        expect(typeText.trim().toLowerCase()).toBe(breweryType.trim().toLowerCase());
      }
    }
  });

  /**
   * Test brewery type filtering at city level
   */
  test('should filter breweries by type at city level', async ({ page }) => {
    // Navigate to a city page with enough screen size to see the table
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/breweries/United%20States/California/San%20Diego');

    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');

    // Find a brewery type link and get its text
    const breweryTypeLink = page.getByTestId('brewery-type-link').first();
    await expect(breweryTypeLink).toBeVisible({ timeout: 10000 });
    const breweryType = await breweryTypeLink.textContent() || '';

    // Click the brewery type link
    await breweryTypeLink.click();

    // Wait for navigation to complete
    await page.waitForURL(/by_type/);

    // Verify URL contains the brewery type parameter at city level
    await expect(page).toHaveURL(new RegExp(`/breweries/United%20States/California/San%20Diego\\?by_type=${breweryType.trim()}`, 'i'));

    // Verify all displayed breweries are of the selected type
    const breweryTypeLinks = page.getByTestId('brewery-type-link');
    const linksCount = await breweryTypeLinks.count();
    expect(linksCount).toBeGreaterThan(0);

    const count = await breweryTypeLinks.count();
    for (let i = 0; i < count; i++) {
      const typeText = await breweryTypeLinks.nth(i).textContent() || '';
      expect(typeText.trim().toLowerCase()).toBe(breweryType.trim().toLowerCase());
    }

    // Test pagination with brewery type filter if available
    const nextButton = page.locator('a:has-text("Next")');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForURL(/page=2|\\d\/2/);

      // Verify URL maintains brewery type filter
      await expect(page).toHaveURL(new RegExp(`by_type=${breweryType.trim()}`, 'i'));

      // Verify filtered breweries are still displayed correctly
      const breweryTypeLinksPage2 = page.getByTestId('brewery-type-link');
      const linksCountPage2 = await breweryTypeLinksPage2.count();
      expect(linksCountPage2).toBeGreaterThan(0);

      const countPage2 = await breweryTypeLinksPage2.count();
      for (let i = 0; i < countPage2; i++) {
        const typeText = await breweryTypeLinksPage2.nth(i).textContent() || '';
        expect(typeText.trim().toLowerCase()).toBe(breweryType.trim().toLowerCase());
      }
    }
  });
});
