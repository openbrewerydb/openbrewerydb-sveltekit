import { test, expect } from '@playwright/test';

/**
 * E2E: /news (blog)
 * - Verifies the page loads and renders the posts list
 */

test.describe('News (Blog) Page', () => {
  test('should load and list posts', async ({ page }) => {
    await page.goto('/news');

    await expect(
      page.getByRole('heading', { name: /OpenBreweryDB News/i })
    ).toBeVisible();
    await expect(
      page.getByText(/Updates, changelogs, and community stories/i)
    ).toBeVisible();

    // Expect at least one post link rendered
    const list = page.locator('ul >> li');
    await expect(list.first()).toBeVisible();

    // If a first item has a link, ensure it is reachable
    const firstLink = list.first().locator('a');
    await expect(firstLink).toBeVisible();
    await expect(firstLink).toHaveAttribute('href', /\/news\//);
  });
});
