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
  test('should show not found message for invalid brewery id', async ({
    page,
  }) => {
    const invalidId = 'invalid-id';
    await page.goto(`/b/${invalidId}`);
    await expect(
      page.getByText(`Brewery with ID ${invalidId} does not exist.`)
    ).toBeVisible();
  });
});
