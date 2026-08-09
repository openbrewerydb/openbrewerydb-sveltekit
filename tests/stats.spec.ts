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

    const chart = page.locator('svg').first();
    await expect(chart).toBeVisible();

    const apiButton = page.getByRole('button', { name: 'API' });
    await expect(apiButton).toBeVisible();
    await apiButton.click();
    await expect(apiButton).toHaveClass(/opacity-40/);
  });
});
