import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load and display key content', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Open Brewery DB/i);
    const logo = page.locator('img[alt="Open Brewery DB Logo"]');
    await expect(logo).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Free and open-source/i })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /brewery data/i })
    ).toBeVisible();
    await expect(page.getByText(/free dataset and API/i)).toBeVisible();
    const docBtn = page.getByRole('link', { name: /Read API Documentation/i });
    await expect(docBtn).toBeVisible();
  });

  test('should display Sponsorship section with Sentry', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: /Sponsorship/i })
    ).toBeVisible();
    const sentrySponsor = page.locator('[data-testid="sentry-sponsorship"]');
    await expect(sentrySponsor).toBeVisible();
    const sentrySvg = sentrySponsor.locator('svg');
    await expect(sentrySvg).toBeVisible();
  });

  test('should navigate to main routes from home', async ({ page }) => {
    await page.goto('/');
    const navLinks: ReadonlyArray<{ label: string; href: string }> = [
      { label: 'Breweries', href: '/breweries' },
      { label: 'Docs', href: '/documentation' },
      { label: 'FAQ', href: '/faq' },
      { label: 'About', href: '/about' },
    ];
    const headerNav = page.getByTestId('header-nav');
    const footerNav = page.getByTestId('footer-nav');
    for (const nav of navLinks) {
      const headerLink = headerNav.getByRole('link', { name: nav.label });
      await expect(headerLink).toBeVisible();
      await expect(headerLink).toHaveAttribute('href', nav.href);
      const footerLink = footerNav.getByRole('link', { name: nav.label });
      await expect(footerLink).toBeVisible();
      await expect(footerLink).toHaveAttribute('href', nav.href);
    }
    await headerNav.getByRole('link', { name: 'Breweries' }).click();
    await expect(page).toHaveURL(/\/breweries/);
  });
});
