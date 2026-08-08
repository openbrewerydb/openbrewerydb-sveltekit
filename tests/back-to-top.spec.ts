/**
 * @file BackToTop Component Tests
 * @description Tests that the BackToTop button appears after scrolling and scrolls to top when clicked.
 */
import { test, expect } from '@playwright/test';

test.describe('BackToTop', () => {
  test('should appear after scrolling and scroll to top when clicked', async ({
    page,
  }) => {
    await page.goto('/documentation');

    // Button should not be visible at the top
    const button = page.getByRole('button', { name: 'Back to top' });
    await expect(button).not.toBeVisible();

    // Scroll past the default threshold (320px)
    await page.evaluate(() => window.scrollTo(0, 500));
    await expect(button).toBeVisible();

    // Click the button and verify we scroll back to top
    await button.click();
    await page.waitForFunction(() => window.scrollY === 0);
    await expect(button).not.toBeVisible();
  });
});
