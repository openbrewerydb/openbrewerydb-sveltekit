import { test, expect } from '@playwright/test';

test.describe('Stats page', () => {
  test('loads and shows the headline, charts, and legend toggle', async ({
    page,
  }) => {
    await page.goto('/stats');

    await expect(page.locator('h1')).toHaveText('Statistics');
    await expect(page.getByText('Requests per day, average')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Hourly requests' })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: '24h' })).toBeVisible();
    await expect(page.getByRole('button', { name: '7d' })).toBeVisible();

    // Scope to the trends section so the first svg is the chart, not an
    // aria-hidden lucide nav icon (which Playwright treats as hidden).
    const chart = page
      .locator('section', {
        has: page.getByRole('heading', { name: 'Traffic trends' }),
      })
      .locator('svg')
      .first();
    await expect(chart).toBeVisible();

    // There are two API legend toggles (hourly and daily charts); use the first.
    const apiButton = page.getByRole('button', { name: 'API' }).first();
    await expect(apiButton).toBeVisible();
    await apiButton.click();
    await expect(apiButton).toHaveClass(/opacity-40/);
  });
});
