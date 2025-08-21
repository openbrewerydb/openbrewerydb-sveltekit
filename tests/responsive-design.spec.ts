/**
 * @file Responsive Design End-to-End Tests
 * @description Tests responsive behavior of components across different viewport sizes.
 */
import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  /**
   * Tests the responsive behavior of the breweries listing page
   */
  test('breweries page should adapt to different viewport sizes', async ({
    page,
  }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/breweries/England');

    // Check grid layout on mobile (1 column)
    const gridMobile = page.locator('.grid');
    await expect(gridMobile).toBeVisible();

    // Verify grid has appropriate classes for mobile
    const gridClasses = await gridMobile.getAttribute('class');
    expect(gridClasses).toContain('grid-cols-1');

    // NOTE: No specific tablet view at the moment

    // Test on desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });

    // Verify table adapts in desktop size
    await expect(page.getByRole('table')).toBeVisible();
  });

  /**
   * Tests the responsive behavior of the brewery card/table components
   */
  test('brewery listings should switch between cards and table based on viewport', async ({
    page,
  }) => {
    await page.goto('/breweries/United%20States/1');

    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Cards should be visible, table should be hidden
    await expect(page.locator('.grid-cols-1.gap-4')).toBeVisible();
    expect(await page.getByRole('table').isHidden()).toBeTruthy();

    // Test on desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });

    // Table should be visible, cards should be hidden
    await expect(page.getByRole('table')).toBeVisible();
    expect(await page.locator('.grid-cols-1.gap-4').isHidden()).toBeTruthy();
  });

  /**
   * Tests the pagination component's responsive behavior
   */
  test('pagination should be responsive', async ({ page }) => {
    await page.goto('/breweries/United%20States/1');

    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const pagination = page.locator('div:has(> a:text("Next"))').first();
    await expect(pagination).toBeVisible();

    // Check for centered pagination on mobile
    const paginationClasses = await pagination.getAttribute('class');
    expect(paginationClasses).toContain('justify-center');

    // Test on desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });

    // Check for right-aligned pagination on desktop
    const paginationClassesDesktop = await pagination.getAttribute('class');
    expect(paginationClassesDesktop).toContain('sm:justify-end');
  });
});
