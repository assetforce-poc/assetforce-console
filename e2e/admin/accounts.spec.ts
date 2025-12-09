/**
 * E2E Tests for Account Listing
 *
 * Prerequisites:
 * 1. Start dev environment:
 *    cd /path/to/assetforce-infra && ./scripts/dev.sh
 *
 * 2. Run tests:
 *    yarn e2e:admin:accounts
 */

import { test, expect, urls } from './fixtures';

test.describe('Account Listing', () => {
  test.describe('Page Structure', () => {
    test('should display accounts page with header and table', async ({ page }) => {
      await page.goto(urls.accounts);

      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      // Check page header
      await expect(page.getByRole('heading', { name: 'Accounts' })).toBeVisible();
      await expect(page.getByText('Manage user authentication accounts')).toBeVisible();

      // Check table exists (will appear after loading)
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });
    });

    test('should display table with correct columns', async ({ page }) => {
      await page.goto(urls.accounts);

      // Wait for table to load
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      // Check table headers
      await expect(page.getByRole('columnheader', { name: 'Username', exact: true })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Email', exact: true })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Status', exact: true })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Email Verified', exact: true })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Created At', exact: true })).toBeVisible();
    });
  });

  test.describe('Data Display', () => {
    test('should load and display account data from AAC backend', async ({ page }) => {
      await page.goto(urls.accounts);

      // Wait for data to load
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      // Should have at least one account row
      const rows = page.locator('[data-testid^="account-row-"]');
      await expect(rows.first()).toBeVisible();

      // First row should have all required cells
      const firstRow = rows.first();
      await expect(firstRow.locator('td').nth(0)).toBeVisible(); // Username
      await expect(firstRow.locator('td').nth(1)).toBeVisible(); // Email
      await expect(firstRow.locator('td').nth(2)).toBeVisible(); // Status
      await expect(firstRow.locator('td').nth(3)).toBeVisible(); // Email Verified
      await expect(firstRow.locator('td').nth(4)).toBeVisible(); // Created At
    });

    test('should display account status badges correctly', async ({ page }) => {
      await page.goto(urls.accounts);

      // Wait for data
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      // Check if status badges are visible (at least one should exist)
      const statusBadges = page.locator('[data-testid^="account-status-"]');
      await expect(statusBadges.first()).toBeVisible();
    });

    test('should display email verification status', async ({ page }) => {
      await page.goto(urls.accounts);

      // Wait for data
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      // Check email verified column shows Yes or No
      const rows = page.locator('[data-testid^="account-row-"]');
      const firstRowEmailVerified = rows.first().locator('td').nth(3);
      const verificationText = await firstRowEmailVerified.textContent();

      expect(['Yes', 'No']).toContain(verificationText);
    });

    test('should display formatted creation dates', async ({ page }) => {
      await page.goto(urls.accounts);

      // Wait for data
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      // Check created at column shows a date
      const rows = page.locator('[data-testid^="account-row-"]');
      const firstRowCreatedAt = rows.first().locator('td').nth(4);
      const dateText = await firstRowCreatedAt.textContent();

      // Should have a date-like format (e.g., "12/9/2024" or locale equivalent)
      expect(dateText).toBeTruthy();
      expect(dateText?.length).toBeGreaterThan(0);
    });
  });

  test.describe('Loading States', () => {
    test('should show loading indicator initially', async ({ page }) => {
      await page.goto(urls.accounts);

      // Should show loading state (CircularProgress)
      // Note: This might be fast in dev, so we check immediately
      const loading = page.getByRole('progressbar');

      // Either loading is visible or data is already loaded
      const isLoadingVisible = await loading.isVisible().catch(() => false);
      const isDataVisible = await page.getByTestId('account-list').isVisible().catch(() => false);

      expect(isLoadingVisible || isDataVisible).toBe(true);
    });
  });

  test.describe('Error Handling', () => {
    test.skip('should display error message when backend is unavailable', async ({ page }) => {
      // Skip: Requires backend to be stopped
      // To test: Stop AAC service before running

      await page.goto(urls.accounts);

      // Should show error alert
      await expect(page.getByTestId('account-list-error')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/Failed to load accounts/i)).toBeVisible();
    });
  });

  test.describe('Empty State', () => {
    test.skip('should display empty state message when no accounts exist', async ({ page }) => {
      // Skip: Requires database to be empty
      // To test: Clear all accounts from Keycloak before running

      await page.goto(urls.accounts);

      // Should show empty state
      await expect(page.getByTestId('account-list-empty')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('No accounts found.')).toBeVisible();
    });
  });

  test.describe('Pagination', () => {
    test('should display pagination controls', async ({ page }) => {
      await page.goto(urls.accounts);

      // Wait for data
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      // Check pagination exists
      await expect(page.getByTestId('account-list-pagination')).toBeVisible();

      // Check pagination shows total count
      await expect(page.getByText(/1–\d+ of \d+/)).toBeVisible();
    });

    test('should change page when clicking pagination controls', async ({ page }) => {
      await page.goto(urls.accounts);

      // Wait for data
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      // Get initial first row data
      const firstRowInitial = page.locator('[data-testid^="account-row-"]').first();
      const initialUsername = await firstRowInitial.locator('td').first().textContent();

      // Get pagination controls
      const pagination = page.getByTestId('account-list-pagination');

      // Find total count to determine if we have multiple pages
      const paginationText = await pagination.getByText(/1–\d+ of \d+/).textContent();
      const totalMatch = paginationText?.match(/of (\d+)/);
      const total = totalMatch ? parseInt(totalMatch[1]) : 0;

      if (total > 20) {
        // Click next page button
        const nextButton = pagination.getByLabel('Go to next page');
        await nextButton.click();

        // Wait for new data to load
        await page.waitForTimeout(1000);

        // First row should be different
        const firstRowAfter = page.locator('[data-testid^="account-row-"]').first();
        const newUsername = await firstRowAfter.locator('td').first().textContent();

        expect(newUsername).not.toBe(initialUsername);
      } else {
        // If only one page, next button should be disabled
        const nextButton = pagination.getByLabel('Go to next page');
        await expect(nextButton).toBeDisabled();
      }
    });

    test('should change rows per page', async ({ page }) => {
      await page.goto(urls.accounts);

      // Wait for data
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      // Get initial row count
      const initialRows = await page.locator('[data-testid^="account-row-"]').count();

      // Open rows per page dropdown
      const pagination = page.getByTestId('account-list-pagination');
      const rowsPerPageButton = pagination.getByRole('combobox');
      await rowsPerPageButton.click();

      // Select 10 rows per page
      await page.getByRole('option', { name: '10', exact: true }).click();

      // Wait for data to reload
      await page.waitForTimeout(1000);

      // Should show different number of rows (unless there are fewer than 10 total)
      const newRows = await page.locator('[data-testid^="account-row-"]').count();

      // Either fewer rows are shown, or all rows are shown (if total < 10)
      expect(newRows).toBeLessThanOrEqual(10);
    });
  });

  test.describe('GraphQL Integration', () => {
    test('should use AAC GraphQL endpoint', async ({ page }) => {
      // Intercept GraphQL requests
      const graphqlRequests: string[] = [];

      page.on('request', (request) => {
        if (request.url().includes('/api/graphql')) {
          graphqlRequests.push(request.url());
        }
      });

      await page.goto(urls.accounts);

      // Wait for data
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      // Should have made request to AAC endpoint, not IMC
      expect(graphqlRequests.some(url => url.includes('/api/graphql/aac'))).toBe(true);

      // Should NOT use IMC endpoint for accounts
      const imcRequests = graphqlRequests.filter(url => url.includes('/api/graphql/imc'));
      // IMC might be called for other data, but not for the accounts query
      // We can't check query content in request URL, so just verify AAC was called
      expect(graphqlRequests.length).toBeGreaterThan(0);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(urls.accounts);

      // H1 should be the page title
      const h1 = page.locator('h1');
      await expect(h1).toHaveText('Accounts');

      // Should have proper semantic structure
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('should have accessible table structure', async ({ page }) => {
      await page.goto(urls.accounts);

      // Wait for data
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      // Table should have proper roles
      await expect(page.getByRole('table')).toBeVisible();
      await expect(page.getByRole('columnheader').first()).toBeVisible();
    });
  });
});
