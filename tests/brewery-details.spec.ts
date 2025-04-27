/**
 * @file Brewery Details End-to-End Tests
 * @description Tests loading and content of /b/[id] brewery detail pages.
 */
import { test, expect } from '@playwright/test';

test.describe('Brewery Details', () => {
  /**
   * Should load brewery details page and display key info.
   */
  test('should load brewery details page and display info', async ({
    page,
  }) => {
    await page.goto('/b/701239cb-5319-4d2e-92c1-129ab0b3b440');

    // Verify brewery name is visible
    await expect(page.getByTestId('brewery-name')).toBeVisible();
    await expect(page.getByTestId('brewery-name')).toHaveText('Bière de la Plaine');

    // Verify brewery type is visible
    await expect(page.getByTestId('brewery-type')).toBeVisible();
    await expect(page.getByTestId('brewery-type')).toHaveText('micro');

    // Verify location heading is visible
    await expect(page.getByTestId('location-heading')).toBeVisible();
    await expect(page.getByTestId('location-heading')).toHaveText('Location');

    // Verify address is visible if available
    if (await page.getByTestId('brewery-address').isVisible()) {
      await expect(page.getByTestId('brewery-address')).toBeVisible();
    }

    // Verify city and state links are visible
    await expect(page.getByTestId('city-link')).toBeVisible();
    await expect(page.getByTestId('state-link')).toBeVisible();
    await expect(page.getByTestId('country-link')).toBeVisible();

    // Verify map links are present
    const mapLinks = await page
      .getByRole('link', { name: '', includeHidden: true })
      .all();
    expect(mapLinks.length).toBeGreaterThanOrEqual(1);

    // TODO: Add brewery type link tests
    // // Verify brewery type is a clickable link
    // const breweryTypeLink = page.getByRole('link', { name: /micro/i });
    // await expect(breweryTypeLink).toBeVisible();

    // // Verify the link points to the correct URL
    // const href = await breweryTypeLink.getAttribute('href');
    // expect(href).toContain('/breweries/');
    // expect(href).toContain('by_type=micro');
  });

  /**
   * Should allow navigation back to city listing from details page.
   */
  test('should allow navigation back to listing', async ({ page }) => {
    await page.goto('/b/701239cb-5319-4d2e-92c1-129ab0b3b440');
    const cityLink = page.getByRole('link', { name: /Marseille/i });
    await cityLink.first().click();
    await expect(
      page.getByRole('heading', { name: /marseille/i })
    ).toBeVisible();
  });

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
