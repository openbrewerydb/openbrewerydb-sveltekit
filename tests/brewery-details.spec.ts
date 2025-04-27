/**
 * @file Brewery Details End-to-End Tests
 * @description Tests loading and content of /b/[id] brewery detail pages.
 */
import { test, expect } from '@playwright/test';

test.describe('Brewery Details', () => {
  /**
   * Should load brewery details page and display key info.
   */
  test('should load brewery details page and display info', async ({
    page,
  }) => {
    await page.goto('/b/701239cb-5319-4d2e-92c1-129ab0b3b440');
    await expect(
      page.getByRole('heading', { name: /Bière de la Plaine/i, level: 1 })
    ).toBeVisible();
    await expect(page.getByText(/Type:/i)).toBeVisible();
    await expect(page.getByText(/Address:/i)).toBeVisible();
    await expect(page.getByText(/City:/i)).toBeVisible();
    const mapLinks = await page
      .getByRole('link', { name: '', includeHidden: true })
      .all();
    expect(mapLinks.length).toBeGreaterThanOrEqual(1);
  });

  /**
   * Should allow navigation back to city listing from details page.
   */
  test('should allow navigation back to listing', async ({ page }) => {
    await page.goto('/b/701239cb-5319-4d2e-92c1-129ab0b3b440');
    const cityLink = page.getByRole('link', { name: /Marseille/i });
    await cityLink.first().click();
    await expect(
      page.getByRole('heading', { name: /marseille/i })
    ).toBeVisible();
  });

  /**
   * Should display a not found message when brewery ID does not exist.
   */
  test('should show not found message for invalid brewery id', async ({ page }) => {
    const invalidId = 'invalid-id';
    await page.goto(`/b/${invalidId}`);
    await expect(
      page.getByText(`Brewery with ID ${invalidId} does not exist.`)
    ).toBeVisible();
  });
});
