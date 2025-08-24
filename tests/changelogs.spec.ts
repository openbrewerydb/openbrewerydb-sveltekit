import { test, expect } from '@playwright/test';

/**
 * E2E: /changelogs
 * - Verifies the page loads
 * - Confirms repo sections render from generated data
 * - Checks that either Releases or Recent Closed Pull Requests are shown
 */

test.describe('Changelogs Page', () => {
  test('should load and display changelogs content', async ({ page }) => {
    await page.goto('/changelogs');

    await expect(page).toHaveTitle(/Changelogs/i);
    await expect(page.getByRole('heading', { name: /Changelogs/i })).toBeVisible();

    // Repos should be present as links or text
    await expect(
      page.getByRole('link', { name: 'openbrewerydb/openbrewerydb', exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole('link', {
        name: 'openbrewerydb/openbrewerydb-laravel-api',
        exact: true,
      })
    ).toBeVisible();

    // One repo currently uses PR fallback (dataset), the other has releases (API)
    await expect(
      page.getByRole('heading', { name: /Recent Closed Pull Requests/i })
    ).toBeVisible();

    await expect(page.getByRole('heading', { name: /Releases/i })).toBeVisible();
  });
});
