/**
 * @file Error Handling End-to-End Tests
 * @description Tests 404 and error page display and navigation.
 */
import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  /**
   * Should show 404 page for non-existent routes.
   */
  test('should show 404 page for non-existent routes', async ({ page }) => {
    await page.goto('/not-a-real-route-404');
    await expect(page.getByRole('heading', { name: /not found|404/i })).toBeVisible();
  });
});
