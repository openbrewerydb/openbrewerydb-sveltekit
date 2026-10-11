/**
 * @file Brewery Details End-to-End Tests
 * @description Tests graceful failure for /b/[id] brewery detail pages.
 * API-dependent tests (valid brewery rendering) deferred to a future story.
 */
import { test, expect } from '@playwright/test';

test.describe('Brewery Details', () => {
  /**
   * Should display a not found message when brewery ID does not exist.
   */
  test('should show not-found for invalid brewery id', async ({ page }) => {
    // /b/* is client-rendered: the SPA shell returns 200 and the load's
    // error(404) renders client-side.
    const response = await page.goto('/b/invalid-id');
    expect(response?.status()).toBe(200);
    await expect(page.getByText(/brewery not found/i)).toBeVisible({
      timeout: 15000,
    });
  });
});
