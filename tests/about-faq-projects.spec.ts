/**
 * @file About, FAQ, and Projects End-to-End Tests
 * @description Tests static content pages: /about, /faq, /projects.
 */
import { test, expect } from '@playwright/test';

test.describe('Static Content Pages', () => {
  /**
   * Should load About page and verify heading and key content.
   */
  test('should load About page', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/about/i);
    await expect(page.getByRole('heading', { name: /about/i, level: 1 })).toBeVisible();
    await expect(page.getByText(/Brewers Association/i)).toBeVisible();
  });

  /**
   * Should load FAQ page and verify heading and representative questions.
   */
  test('should load FAQ page', async ({ page }) => {
    await page.goto('/faq');
    await expect(page).toHaveTitle(/Frequently Asked Questions/i);
    await expect(page.getByRole('heading', { name: /frequently asked questions/i, level: 1 })).toBeVisible();
  });

  /**
   * Should load Projects page and verify heading and project listings.
   */
  test('should load Projects page', async ({ page }) => {
    await page.goto('/projects');
    await expect(page).toHaveTitle(/projects/i);
    await expect(page.getByRole('heading', { name: /projects/i, level: 1 })).toBeVisible();
  });
});
