/**
 * @file Breweries Listing End-to-End Tests
 * @description Tests listing, pagination, and navigation for /breweries.
 */
import { test, expect } from '@playwright/test';

test.describe('Breweries Listing', () => {
  /**
   * Should display breweries list heading and country links.
   */
  test('should display heading', async ({ page }) => {
    await page.goto('/breweries');
    await expect(
      page.getByRole('heading', { name: /Search Breweries/i, level: 1 })
    ).toBeVisible();
  });

  /**
   * Landing state (no query) shows CTA to browse.
   */
  test('landing shows CTA when no query', async ({ page }) => {
    await page.goto('/breweries');
    const cta = page.getByRole('link', { name: /Browse Breweries/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/breweries/browse');
  });

  /**
   * Desktop: search renders table, not cards.
   */
  test('search shows table on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/breweries');
    await page.getByPlaceholder('Search for a brewery...').fill('brew');
    await page.getByRole('button', { name: /Search/i }).click();
    await expect(page).toHaveURL(/\/breweries\?query=brew/i);
    const table = page.getByTestId('brewery-table');
    await expect(table).toBeVisible();
    await expect(page.getByTestId('brewery-card').first()).toBeHidden();
    // Ensure at least one data row exists (header + >=1 row)
    const rowCount = await table.getByRole('row').count();
    expect(rowCount).toBeGreaterThan(1);
  });

  /**
   * Mobile: search renders cards, not table.
   */
  test('search shows cards on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/breweries?query=brew');
    await expect(page.getByTestId('brewery-card').first()).toBeVisible();
    await expect(page.getByTestId('brewery-table')).toBeHidden();
  });

  /**
   * No results message for unlikely query.
   */
  test('no results message for unlikely query', async ({ page }) => {
    await page.goto('/breweries');
    const unlikely = 'zzzxxyyzz-unlikely-query-12345';
    await page.getByPlaceholder('Search for a brewery...').fill(unlikely);
    await page.getByRole('button', { name: /Search/i }).click();
    await expect(page.getByText(/No breweries found matching/i)).toBeVisible();
  });

  /**
   * Clearing input resets to landing.
   */
  test('clearing input resets to landing', async ({ page }) => {
    await page.goto('/breweries?query=brew');
    const input = page.getByPlaceholder('Search for a brewery...');
    await input.fill('');
    await input.press('Enter');
    await expect(page).toHaveURL('/breweries');
    await expect(
      page.getByRole('link', { name: /Browse Breweries/i })
    ).toBeVisible();
  });

  /**
   * Pagination next/prev and numeric buttons.
   */
  test('pagination works on desktop for multi-page results', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/breweries?query=california');

    const prev = page.getByRole('button', { name: 'Previous' }).first();
    const next = page.getByRole('button', { name: 'Next' }).first();

    // Expect pagination controls to be present with many results
    await expect(prev).toBeVisible();
    await expect(next).toBeVisible();

    // On first page, Previous should be disabled, Next enabled
    await expect(prev).toBeDisabled();
    await expect(next).toBeEnabled();

    // Go to page 2
    await next.click();
    await expect(page).toHaveURL(/page=2/);
    await expect(prev).toBeEnabled();

    // Navigate back to page 1 via numeric button
    await page.getByRole('button', { name: '1' }).first().click();
    await expect(page).toHaveURL(/page=1(\D|$)/);
  });

  /**
   * Navigate from table row to brewery details.
   */
  test('navigates to brewery details from table', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/breweries?query=brew');
    const firstRow = page.getByRole('row').nth(1); // skip header row
    const link = firstRow.getByRole('link').first();
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^\/b\//);
    await link.click();
    await expect(page).toHaveURL(new RegExp(href ?? ''));
  });

  /**
   * Empty or whitespace query canonicalizes to /breweries
   */
  test('empty or whitespace query redirects to /breweries', async ({
    page,
  }) => {
    await page.goto('/breweries?query=');
    await expect(page).toHaveURL('/breweries');

    await page.goto('/breweries?query=%20%20%20');
    await expect(page).toHaveURL('/breweries');
  });
});
