/**
 * @file Documentation End-to-End Tests
 * @description Tests documentation index and individual documentation pages.
 */
import { test, expect } from '@playwright/test';

test.describe('Documentation', () => {
  /**
   * Should load documentation index and display key sections.
   */
  test('should load documentation index', async ({ page }) => {
    await page.goto('/documentation');
    await expect(
      page.getByRole('heading', { name: /documentation/i, level: 1 })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /single brewery/i })
    ).toBeVisible();
    await expect(page.getByText(/Get a single brewery/i)).toBeVisible();
    await expect(page.getByText(/Returns a list of breweries/i)).toBeVisible();
  });

  /**
   * Should redirect invalid documentation slug to index.
   */
  test('should redirect invalid docs slug to index', async ({ page }) => {
    const invalidSlug = 'does-not-exist';
    await page.goto(`/documentation/${invalidSlug}`);
    await expect(page).toHaveURL(/\/documentation\/?$/);
    await expect(
      page.getByRole('heading', { name: /documentation/i, level: 1 })
    ).toBeVisible();
  });
});
