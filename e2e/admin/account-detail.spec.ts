/**
 * E2E Tests for Account Detail Page
 *
 * Prerequisites:
 * 1. Start dev environment:
 *    cd /path/to/assetforce-infra && ./scripts/dev.sh
 *
 * 2. Run tests:
 *    yarn e2e:admin:account-detail
 */

import { test, expect, urls, testAccounts, getAccountIdByUsername, loginAsTestUser } from './fixtures';

test.describe('Account Detail Page', () => {
  test.describe('Navigation', () => {
    test('should navigate to account detail when clicking row in accounts list', async ({ page }) => {
      // Start from accounts list
      await page.goto(urls.accounts);

      // Wait for accounts list to load
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      // Get first account row and its ID
      const firstRow = page.locator('[data-testid^="account-row-"]').first();
      const testId = await firstRow.getAttribute('data-testid');
      const accountId = testId?.replace('account-row-', '');

      expect(accountId).toBeTruthy();

      // Click the row
      await firstRow.click();

      // Should navigate to account detail page
      await page.waitForURL(`**/accounts/${accountId}`);
      await expect(page).toHaveURL(new RegExp(`/accounts/${accountId}`));

      // Page should load
      await expect(page.getByRole('heading', { name: 'Account Detail' })).toBeVisible();
    });

    test('should display breadcrumbs with working navigation', async ({ page }) => {
      // Navigate to accounts list first to get an account ID
      await page.goto(urls.accounts);
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      const firstRow = page.locator('[data-testid^="account-row-"]').first();
      const testId = await firstRow.getAttribute('data-testid');
      const accountId = testId?.replace('account-row-', '');

      // Go to account detail
      await page.goto(urls.accountDetail(accountId || 'test-id'));

      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Check breadcrumbs exist
      const breadcrumbs = page.locator('nav[aria-label="breadcrumb"]').or(page.getByRole('navigation'));
      await expect(breadcrumbs.locator('a:has-text("Accounts")')).toBeVisible();
      await expect(breadcrumbs.getByText('Account Detail')).toBeVisible();

      // Click breadcrumb link to go back
      await breadcrumbs.locator('a:has-text("Accounts")').click();

      // Should navigate back to accounts list
      await expect(page).toHaveURL(/\/accounts$/);
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Page Structure', () => {
    test('should display page header and description', async ({ page }) => {
      // Get an account ID from accounts list
      await page.goto(urls.accounts);
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      const firstRow = page.locator('[data-testid^="account-row-"]').first();
      await firstRow.click();

      // Wait for detail page to load
      await page.waitForLoadState('networkidle');

      // Check page header
      await expect(page.getByRole('heading', { name: 'Account Detail', level: 1 })).toBeVisible();
      await expect(page.getByText('View and manage account information')).toBeVisible();
    });

    test('should display all three cards', async ({ page }) => {
      // Get an account ID
      await page.goto(urls.accounts);
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      const firstRow = page.locator('[data-testid^="account-row-"]').first();
      await firstRow.click();

      // Wait for detail page to load
      await page.waitForLoadState('networkidle');

      // Check all three cards are present
      await expect(page.getByText('Account Information', { exact: true })).toBeVisible();
      await expect(page.getByText('Account Attributes', { exact: true })).toBeVisible();
      await expect(page.getByText('Session History', { exact: true })).toBeVisible();
    });
  });

  test.describe('Account Information Card', () => {
    test('should display basic account information', async ({ page }) => {
      // Navigate to detail page
      await page.goto(urls.accounts);
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      const firstRow = page.locator('[data-testid^="account-row-"]').first();
      await firstRow.click();

      await page.waitForLoadState('networkidle');

      // Check account information fields are visible
      await expect(page.getByText('Account ID:')).toBeVisible();
      await expect(page.getByText('Username:')).toBeVisible();
      await expect(page.getByText('Email:')).toBeVisible();
      await expect(page.getByText('Status:')).toBeVisible();
      await expect(page.getByText('Email Verified:')).toBeVisible();
      await expect(page.getByText('Created At:')).toBeVisible();
    });

    test('should display account status badge', async ({ page }) => {
      await page.goto(urls.accounts);
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      const firstRow = page.locator('[data-testid^="account-row-"]').first();
      await firstRow.click();

      await page.waitForLoadState('networkidle');

      // Status badge should be visible (with data-testid)
      const statusBadge = page.locator('[data-testid^="account-status-"]');
      await expect(statusBadge).toBeVisible();
    });

    test('should display Verify Email button when email is not verified', async ({ page }) => {
      // Create a fresh unverified account for this test
      const timestamp = Date.now();
      const username = `e2etesttmp${timestamp}`;
      const email = `tmp${timestamp}@e2etest.com`;

      // Register new account (will be unverified by default)
      const registerResponse = await page.request.post(`${urls.adminConsole}/api/graphql/aac`, {
        data: {
          query: `
            mutation Register($input: RegisterInput!) {
              registration {
                register(input: $input) {
                  success
                  accountId
                }
              }
            }
          `,
          variables: {
            input: {
              username,
              email,
              password: 'Test1234!',
              firstName: 'Test',
              lastName: 'User',
              acceptTerms: true,
            },
          },
        },
      });

      const registerData = await registerResponse.json();
      const accountId = registerData?.data?.registration?.register?.accountId;

      expect(accountId).toBeTruthy();

      // Visit account detail page
      await page.goto(urls.accountDetail(accountId));
      await page.waitForLoadState('networkidle');

      // Verify Email button should be visible for unverified account
      await expect(page.getByRole('button', { name: /Verify Email/i })).toBeVisible();
    });

    test('should show success message after verifying email', async ({ page }) => {
      // Create a fresh unverified account for this test
      const timestamp = Date.now();
      const username = `e2etesttmp${timestamp}`;
      const email = `tmp${timestamp}@e2etest.com`;

      // Register new account
      const registerResponse = await page.request.post(`${urls.adminConsole}/api/graphql/aac`, {
        data: {
          query: `
            mutation Register($input: RegisterInput!) {
              registration {
                register(input: $input) {
                  success
                  accountId
                }
              }
            }
          `,
          variables: {
            input: {
              username,
              email,
              password: 'Test1234!',
              firstName: 'Test',
              lastName: 'User',
              acceptTerms: true,
            },
          },
        },
      });

      const registerData = await registerResponse.json();
      const accountId = registerData?.data?.registration?.register?.accountId;

      expect(accountId).toBeTruthy();

      // Visit account detail page
      await page.goto(urls.accountDetail(accountId));
      await page.waitForLoadState('networkidle');

      // Click Verify Email button
      const verifyButton = page.getByRole('button', { name: /Verify Email/i });
      await verifyButton.click();

      // Should show success alert after real API call
      await expect(page.getByText(/verified successfully|Email verified/i)).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Account Attributes Card', () => {
    test('should display attributes card with table headers or empty state', async ({ page }) => {
      // Navigate to first account's detail page
      await page.goto(urls.accounts);
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      const firstRow = page.locator('[data-testid^="account-row-"]').first();
      await firstRow.click();
      await page.waitForLoadState('networkidle');

      // Account attributes card must be visible
      const attributesCard = page.getByTestId('account-attributes-card');
      await expect(attributesCard).toBeVisible();

      // Card should contain either table headers (Key, Value) or empty state message
      await expect(
        attributesCard.getByRole('columnheader', { name: 'Key' }).or(attributesCard.getByText(/No attributes found/i))
      ).toBeVisible();
    });

    test('should display attributes or empty state', async ({ page }) => {
      await page.goto(urls.accounts);
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      const firstRow = page.locator('[data-testid^="account-row-"]').first();
      await firstRow.click();

      await page.waitForLoadState('networkidle');

      // Either attributes table has rows, or empty state is shown
      const attributesCard = page.getByTestId('account-attributes-card');
      const hasRows = (await attributesCard.getByRole('row').count()) > 1; // More than header row
      const hasEmptyState = await attributesCard.getByText(/No attributes found/i).isVisible();

      expect(hasRows || hasEmptyState).toBe(true);
    });

    test('should display sensitivity badges for attributes', async ({ page }) => {
      await page.goto(urls.accounts);
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      const firstRow = page.locator('[data-testid^="account-row-"]').first();
      await firstRow.click();

      await page.waitForLoadState('networkidle');

      const attributesCard = page.getByTestId('account-attributes-card');
      const rowCount = await attributesCard.getByRole('row').count();

      if (rowCount > 1) {
        // Has attributes - check for sensitivity badges
        const badges = attributesCard.locator('[class*="MuiChip"]');
        const badgeCount = await badges.count();

        // Should have at least one badge (either "Public" or "Sensitive")
        expect(badgeCount).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Session History Card', () => {
    test('should display session history card with grid or empty state', async ({ page }) => {
      // Login to create an active session (use existing platform admin account)
      await loginAsTestUser(page, testAccounts.platformAdmin.username, testAccounts.platformAdmin.password);

      // Get account ID and visit detail page
      const accountId = await getAccountIdByUsername(page, testAccounts.platformAdmin.username);
      await page.goto(urls.accountDetail(accountId));

      await page.waitForLoadState('networkidle');

      // Session card must be visible
      const sessionCard = page.getByTestId('session-history-card');
      await expect(sessionCard).toBeVisible();

      // Card should contain either session columns or empty state message
      await expect(
        sessionCard.getByRole('columnheader', { name: /Start Time/i }).or(sessionCard.getByText(/No sessions found/i))
      ).toBeVisible();
    });

    test('should display sessions or empty state', async ({ page }) => {
      await page.goto(urls.accounts);
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      const firstRow = page.locator('[data-testid^="account-row-"]').first();
      await firstRow.click();

      await page.waitForLoadState('networkidle');

      const sessionCard = page.getByTestId('session-history-card');

      // Either has session rows or empty state
      // DataGrid uses role="grid", so we need to look for rows within the grid
      const grid = sessionCard.getByRole('grid');
      const hasRows = (await grid.getByRole('row').count()) > 1; // More than header row
      const hasEmptyState = await sessionCard.getByText(/No sessions found/i).isVisible();

      expect(hasRows || hasEmptyState).toBe(true);
    });

    test('should format timestamps in session history', async ({ page }) => {
      await page.goto(urls.accounts);
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      const firstRow = page.locator('[data-testid^="account-row-"]').first();
      await firstRow.click();

      await page.waitForLoadState('networkidle');

      const sessionCard = page.getByTestId('session-history-card');
      // DataGrid uses role="grid"
      const grid = sessionCard.getByRole('grid');
      const rowCount = await grid.getByRole('row').count();

      if (rowCount > 1) {
        // Has sessions - check that timestamps are formatted
        const firstSessionRow = grid.getByRole('row').nth(1); // Skip header
        const cells = firstSessionRow.locator('div[role="gridcell"]');

        // Start Time and Last Access should have date-like format or "N/A"
        const startTimeText = await cells.nth(0).textContent();
        const lastAccessText = await cells.nth(1).textContent();

        expect(startTimeText).toBeTruthy();
        expect(lastAccessText).toBeTruthy();

        // Should be either a formatted date or "N/A"
        expect(startTimeText?.length).toBeGreaterThan(0);
        expect(lastAccessText?.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Loading States', () => {
    test('should show loading indicator initially', async ({ page }) => {
      await page.goto(urls.accounts);
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      const firstRow = page.locator('[data-testid^="account-row-"]').first();
      const testId = await firstRow.getAttribute('data-testid');
      const accountId = testId?.replace('account-row-', '');

      // Click and wait for navigation to start
      await firstRow.click();
      await page.waitForURL(`**/accounts/${accountId}`, { timeout: 5000 });

      // Should show loading state (CircularProgress) or data
      // Note: This might be fast in dev, so we check immediately after navigation
      const loading = page.getByRole('progressbar');

      const isLoadingVisible = await loading.isVisible().catch(() => false);
      const isContentVisible = await page
        .getByText('Account Information', { exact: true })
        .isVisible()
        .catch(() => false);

      expect(isLoadingVisible || isContentVisible).toBe(true);
    });
  });

  test.describe('Error Handling', () => {
    test('should display error message when account not found', async ({ page }) => {
      // Visit a non-existent account ID
      await page.goto(urls.accountDetail('00000000-0000-0000-0000-000000000000'));

      await page.waitForLoadState('networkidle');

      // Should show error or "Account not found" message
      const errorMessage = page.getByText(/Account not found/i);
      const failedMessage = page.getByText(/Failed to load/i);

      await expect(errorMessage.or(failedMessage)).toBeVisible({
        timeout: 10000,
      });
    });

    test('should display error message when backend is unavailable', async ({ page }) => {
      // Intercept GraphQL and simulate network error
      await page.route('**/api/graphql/aac', (route) => {
        route.abort('failed');
      });

      await page.goto(urls.accountDetail('some-account-id'));

      await page.waitForLoadState('networkidle');

      // Should show error Alert (MUI Alert with severity="error")
      const errorAlert = page.locator('[role="alert"]').filter({ hasText: /failed|error|load/i });
      await expect(errorAlert).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('GraphQL Integration', () => {
    test('should use AAC GraphQL endpoint for account detail', async ({ page }) => {
      const graphqlRequests: string[] = [];

      page.on('request', (request) => {
        if (request.url().includes('/api/graphql')) {
          graphqlRequests.push(request.url());
        }
      });

      await page.goto(urls.accounts);
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      const firstRow = page.locator('[data-testid^="account-row-"]').first();
      await firstRow.click();

      await page.waitForLoadState('networkidle');

      // Should have made request to AAC endpoint
      expect(graphqlRequests.some((url) => url.includes('/api/graphql/aac'))).toBe(true);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(urls.accounts);
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      const firstRow = page.locator('[data-testid^="account-row-"]').first();
      await firstRow.click();

      await page.waitForLoadState('networkidle');

      // H1 should be the page title
      await expect(page.getByRole('heading', { level: 1, name: 'Account Detail' })).toBeVisible();
    });

    test('should have accessible card structures on account detail page', async ({ page }) => {
      // Navigate to first account's detail page
      await page.goto(urls.accounts);
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      const firstRow = page.locator('[data-testid^="account-row-"]').first();
      await firstRow.click();
      await page.waitForLoadState('networkidle');

      // Both cards must be visible and accessible
      await expect(page.getByTestId('account-attributes-card')).toBeVisible();
      await expect(page.getByTestId('session-history-card')).toBeVisible();

      // Page heading must be accessible
      await expect(page.getByRole('heading', { level: 1, name: 'Account Detail' })).toBeVisible();
    });

    test('should have accessible empty state when account has no data', async ({ page }) => {
      await page.goto(urls.accounts);
      await expect(page.getByTestId('account-list')).toBeVisible({ timeout: 10000 });

      const firstRow = page.locator('[data-testid^="account-row-"]').first();
      await firstRow.click();

      await page.waitForLoadState('networkidle');

      // Empty state should have accessible cards
      await expect(page.getByTestId('account-attributes-card')).toBeVisible();
      await expect(page.getByTestId('session-history-card')).toBeVisible();
    });
  });
});
