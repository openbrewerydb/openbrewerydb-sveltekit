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

    const chart = page.locator('.h-72 svg').first();
    await expect(chart).toBeVisible();

    const apiButton = page
      .getByLabel('Series', { exact: true })
      .getByRole('button', { name: 'API' });
    await expect(apiButton).toBeVisible();
    await apiButton.click();
    await expect(apiButton).toHaveClass(/opacity-40/);
  });

  test('renders the publication apparatus: figures, table, sources, citation', async ({
    page,
  }) => {
    await page.goto('/stats');

    // Figure numbering on chart captions
    await expect(page.getByText('Figure 1.')).toBeVisible();
    await expect(page.getByText('Figure 4.')).toBeVisible();

    // Table 1 caption for the summary metric cards
    await expect(page.getByText('Table 1. Summary metrics')).toBeVisible();

    // Data sources section
    await expect(
      page.getByRole('heading', { name: 'Data sources' })
    ).toBeVisible();
    // The live source-data JSON link (points at the worker endpoint).
    // Appears in both the Data sources list and the suggested citation — scope to the list.
    const sourceLink = page.getByRole('list').getByRole('link', {
      name: /openbrewerydb-metrics\.wandering-leaf-studios\.workers\.dev/,
    });
    await expect(sourceLink).toBeVisible();
    await expect(sourceLink).toHaveAttribute('target', '_blank');

    // Supporting references (scoped to the Data sources list, exact match to
    // avoid colliding with the live JSON URL which starts with the same prefix)
    await expect(
      page
        .getByRole('list')
        .getByRole('link', { name: 'openbrewerydb-metrics', exact: true })
    ).toBeVisible();
    await expect(
      page
        .getByRole('list')
        .getByRole('link', { name: 'openbrewerydb/openbrewerydb', exact: true })
    ).toBeVisible();

    // Suggested citation block
    await expect(page.getByText('Suggested citation')).toBeVisible();
    await expect(page.getByText('Open Brewery DB. Usage')).toBeVisible();
  });
});
