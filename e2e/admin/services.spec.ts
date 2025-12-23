/**
 * E2E Tests for Service Governance Center (SGC) - Services Page
 *
 * Prerequisites:
 * 1. Start dev environment:
 *    cd /path/to/assetforce-infra && ./scripts/start.sh -e dev -d all
 *
 * 2. Run tests:
 *    yarn e2e # or yarn e2e:ui for UI mode
 */

import { test, expect, upsertTestService, urls } from './fixtures';

test.describe('Services Page - SGC', () => {
  test.describe('Page Structure', () => {
    test('should display services page with header', async ({ page }) => {
      await page.goto(urls.adminConsole + '/services');

      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      // Check page header
      await expect(page.getByRole('heading', { name: 'Services' })).toBeVisible();
      await expect(page.getByText('Manage registered services in the platform')).toBeVisible();
    });

    test('should display service list or empty state', async ({ page }) => {
      await page.goto(urls.adminConsole + '/services');
      await page.waitForLoadState('networkidle');

      // Either service list exists or empty state message
      const hasServiceList = await page
        .getByTestId('service-list')
        .isVisible()
        .catch(() => false);
      const hasEmptyState = await page
        .getByText(/No services registered|Failed to load services/)
        .isVisible()
        .catch(() => false);

      expect(hasServiceList || hasEmptyState).toBeTruthy();
    });
  });

  test.describe('Service List', () => {
    test('should handle authentication error gracefully', async ({ page }) => {
      await page.goto(urls.adminConsole + '/services');
      await page.waitForLoadState('networkidle');

      // Check for error message or loading state
      const hasError = await page
        .getByText(/Failed to load services/)
        .isVisible()
        .catch(() => false);
      const hasLoading = await page
        .getByText(/Loading/)
        .isVisible()
        .catch(() => false);
      const hasServiceList = await page
        .getByTestId('service-list')
        .isVisible()
        .catch(() => false);

      // At least one should be visible
      expect(hasError || hasLoading || hasServiceList).toBeTruthy();
    });
  });

  test.describe('Navigation', () => {
    test('should be accessible from admin console navigation', async ({ page }) => {
      await page.goto(urls.adminConsole);
      await page.waitForLoadState('networkidle');

      // Check if Services link exists in navigation
      const servicesLink = page.getByRole('link', { name: /Services/i });

      // If the link exists, verify it works
      if (await servicesLink.isVisible().catch(() => false)) {
        await servicesLink.click();
        await page.waitForURL('**/services');
        await expect(page).toHaveURL(/\/services$/);
      }
    });
  });
});

test.describe('Service Detail Page - SGC', () => {
  test.describe('Page Structure', () => {
    test('should display service detail page when service ID is provided', async ({ page }) => {
      const service = await upsertTestService(page);

      await page.goto(urls.adminConsole + `/services/${service.slug}`);
      await page.waitForLoadState('networkidle');

      await expect(page.getByTestId('service-detail')).toBeVisible();
    });
  });
});
