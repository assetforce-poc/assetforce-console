/**
 * E2E Tests for Service Governance Center (SGC) - Service Contracts
 *
 * Prerequisites:
 * 1. Start dev environment:
 *    cd /path/to/assetforce-infra && ./scripts/start.sh -e dev -d all
 *
 * 2. Run tests:
 *    yarn e2e # or yarn e2e:ui for UI mode
 */

import { test, expect, urls, testAccounts } from './fixtures';

// Use existing SGC service for testing (always exists in test environment)
const TEST_SERVICE_SLUG = 'sgc';

/**
 * Login to Admin Console
 */
async function loginToAdminConsole(page: any) {
  await page.goto(urls.adminConsole + '/login');
  await page.waitForLoadState('networkidle');

  // Fill login form
  await page.getByLabel(/username/i).fill(testAccounts.platformAdmin.username);
  await page.getByLabel(/password/i).fill(testAccounts.platformAdmin.password);

  // Submit
  await page.getByRole('button', { name: /sign in/i }).click();

  // Wait for redirect to dashboard (successful login)
  await page.waitForURL((url: URL) => !url.pathname.includes('/login'), { timeout: 10000 });
}

test.describe('Service Contracts - Contract Lifecycle', () => {
  // Login before each test
  test.beforeEach(async ({ page }) => {
    await loginToAdminConsole(page);
  });

  test.describe('Contracts Page Structure', () => {
    test('should display contracts page with header', async ({ page }) => {
      // Use pre-seeded test service (created by seed script)
      // TEST_SERVICE_SLUG already defined

      // Navigate to contracts page
      await page.goto(urls.adminConsole + `/services/${TEST_SERVICE_SLUG}/contracts`);
      await page.waitForLoadState('networkidle');

      // Check page header
      await expect(page.getByRole('heading', { name: 'Service Contracts' })).toBeVisible();
      await expect(page.getByText('Manage contracts (PROVIDES/CONSUMES) for this service')).toBeVisible();

      // Check breadcrumbs
      await expect(page.getByRole('link', { name: 'Services' })).toBeVisible();
      await expect(page.getByRole('link', { name: TEST_SERVICE_SLUG })).toBeVisible();
    });

    test('should display "Add Contract" button', async ({ page }) => {
      // TEST_SERVICE_SLUG already defined

      await page.goto(urls.adminConsole + `/services/${TEST_SERVICE_SLUG}/contracts`);
      await page.waitForLoadState('networkidle');

      // Check "Add Contract" button is visible
      await expect(page.getByRole('button', { name: /Add Contract/i })).toBeVisible();
    });
  });

  test.describe('Contract Creation', () => {
    test('should create a GraphQL contract successfully', async ({ page }) => {
      // Use pre-seeded test service

      await page.goto(urls.adminConsole + `/services/${TEST_SERVICE_SLUG}/contracts`);
      await page.waitForLoadState('networkidle');

      // Click "Add Contract" button
      await page.getByRole('button', { name: /Add Contract/i }).click();

      // Dialog should be visible
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByText('Add GraphQL Contract')).toBeVisible();

      // Fill in contract form (only required fields)
      const operationInput = page.getByLabel(/GraphQL Operation/i);
      await operationInput.fill('Query.users');

      // Submit form
      await page.getByRole('button', { name: /^Create$/i }).click();

      // Wait for dialog to close
      await expect(page.getByRole('dialog')).not.toBeVisible();

      // Verify contract appears in the table
      await expect(page.getByText('Query.users')).toBeVisible();
      await expect(page.getByText('PROVIDES')).toBeVisible();
      await expect(page.getByText('GRAPHQL')).toBeVisible();
      await expect(page.getByText('ACTIVE')).toBeVisible();
    });

    test('should create contract with all optional fields', async ({ page }) => {
      // Use pre-seeded test service

      await page.goto(urls.adminConsole + `/services/${TEST_SERVICE_SLUG}/contracts`);
      await page.waitForLoadState('networkidle');

      // Open dialog
      await page.getByRole('button', { name: /Add Contract/i }).click();

      // Fill all fields
      await page.getByLabel(/GraphQL Operation/i).fill('Mutation.createUser');
      await page.getByLabel(/Schema URL/i).fill('https://github.com/org/repo/schema.graphql');
      await page.getByLabel(/Schema Version/i).fill('1.0.0');
      await page.getByLabel(/API Version/i).fill('v1');

      // Submit
      await page.getByRole('button', { name: /^Create$/i }).click();

      // Verify contract appears with all details
      await expect(page.getByText('Mutation.createUser')).toBeVisible();
    });

    test('should show validation error when operation is empty', async ({ page }) => {
      // Use pre-seeded test service

      await page.goto(urls.adminConsole + `/services/${TEST_SERVICE_SLUG}/contracts`);
      await page.waitForLoadState('networkidle');

      // Open dialog
      await page.getByRole('button', { name: /Add Contract/i }).click();

      // Try to submit without filling operation
      const createButton = page.getByRole('button', { name: /^Create$/i });

      // Button should be disabled when operation is empty
      await expect(createButton).toBeDisabled();
    });
  });

  test.describe('Contract Deprecation', () => {
    test('should deprecate a contract successfully', async ({ page }) => {
      // Use pre-seeded test service

      await page.goto(urls.adminConsole + `/services/${TEST_SERVICE_SLUG}/contracts`);
      await page.waitForLoadState('networkidle');

      // Create a contract first
      await page.getByRole('button', { name: /Add Contract/i }).click();
      await page.getByLabel(/GraphQL Operation/i).fill('Query.oldUsers');
      await page.getByRole('button', { name: /^Create$/i }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();

      // Verify contract is ACTIVE
      await expect(page.getByText('ACTIVE')).toBeVisible();

      // Click deprecate button (warning icon)
      const deprecateButton = page.getByRole('button', { name: /Deprecate/i }).first();
      await deprecateButton.click();

      // Deprecate dialog should be visible
      await expect(page.getByText('Deprecate Contract')).toBeVisible();

      // Fill deprecation form (only required field: reason)
      await page.getByLabel(/Deprecation Reason/i).fill('Replaced by Query.users');

      // Submit
      await page.getByRole('button', { name: /^Deprecate$/i }).click();

      // Wait for dialog to close
      await expect(page.getByRole('dialog')).not.toBeVisible();

      // Verify contract is now DEPRECATED
      await expect(page.getByText('DEPRECATED')).toBeVisible();

      // Deprecate button should not be visible anymore (already deprecated)
      await expect(page.getByRole('button', { name: /Deprecate/i })).not.toBeVisible();
    });

    test('should deprecate contract with all optional fields', async ({ page }) => {
      // Use pre-seeded test service

      await page.goto(urls.adminConsole + `/services/${TEST_SERVICE_SLUG}/contracts`);
      await page.waitForLoadState('networkidle');

      // Create contract
      await page.getByRole('button', { name: /Add Contract/i }).click();
      await page.getByLabel(/GraphQL Operation/i).fill('Query.products');
      await page.getByRole('button', { name: /^Create$/i }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();

      // Open deprecate dialog
      await page
        .getByRole('button', { name: /Deprecate/i })
        .first()
        .click();

      // Fill all deprecation fields
      await page.getByLabel(/Deprecation Reason/i).fill('API redesign');
      await page.getByLabel(/Deprecated Since/i).fill('v2.0.0');
      await page.getByLabel(/Alternative/i).fill('Query.productsV2');
      await page.getByLabel(/Planned Removal/i).fill('v3.0.0');

      // Submit
      await page.getByRole('button', { name: /^Deprecate$/i }).click();

      // Verify deprecation
      await expect(page.getByText('DEPRECATED')).toBeVisible();
    });
  });

  test.describe('Contract Deletion', () => {
    test('should delete a contract successfully', async ({ page }) => {
      // Use pre-seeded test service

      await page.goto(urls.adminConsole + `/services/${TEST_SERVICE_SLUG}/contracts`);
      await page.waitForLoadState('networkidle');

      // Create contract
      await page.getByRole('button', { name: /Add Contract/i }).click();
      await page.getByLabel(/GraphQL Operation/i).fill('Query.tempData');
      await page.getByRole('button', { name: /^Create$/i }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();

      // Verify contract exists
      await expect(page.getByText('Query.tempData')).toBeVisible();

      // Click delete button and accept confirmation
      page.on('dialog', (dialog) => {
        expect(dialog.message()).toContain('Are you sure');
        dialog.accept();
      });

      await page
        .getByRole('button', { name: /Delete/i })
        .first()
        .click();

      // Wait for deletion to complete
      await page.waitForTimeout(1000);

      // Verify contract is removed
      await expect(page.getByText('Query.tempData')).not.toBeVisible();
    });

    test('should cancel contract deletion when dialog is dismissed', async ({ page }) => {
      // Use pre-seeded test service

      await page.goto(urls.adminConsole + `/services/${TEST_SERVICE_SLUG}/contracts`);
      await page.waitForLoadState('networkidle');

      // Create contract
      await page.getByRole('button', { name: /Add Contract/i }).click();
      await page.getByLabel(/GraphQL Operation/i).fill('Query.keepMe');
      await page.getByRole('button', { name: /^Create$/i }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();

      // Verify contract exists
      await expect(page.getByText('Query.keepMe')).toBeVisible();

      // Click delete button but cancel confirmation
      page.on('dialog', (dialog) => {
        dialog.dismiss();
      });

      await page
        .getByRole('button', { name: /Delete/i })
        .first()
        .click();

      // Wait a moment
      await page.waitForTimeout(500);

      // Verify contract still exists
      await expect(page.getByText('Query.keepMe')).toBeVisible();
    });
  });

  test.describe('Full Contract Lifecycle', () => {
    test('should complete full lifecycle: create → deprecate → delete', async ({ page }) => {
      // Use pre-seeded test service

      await page.goto(urls.adminConsole + `/services/${TEST_SERVICE_SLUG}/contracts`);
      await page.waitForLoadState('networkidle');

      // Step 1: Create contract
      await page.getByRole('button', { name: /Add Contract/i }).click();
      await page.getByLabel(/GraphQL Operation/i).fill('Query.lifecycle');
      await page.getByRole('button', { name: /^Create$/i }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();

      // Verify creation
      await expect(page.getByText('Query.lifecycle')).toBeVisible();
      await expect(page.getByText('ACTIVE')).toBeVisible();

      // Step 2: Deprecate contract
      await page
        .getByRole('button', { name: /Deprecate/i })
        .first()
        .click();
      await page.getByLabel(/Deprecation Reason/i).fill('Testing full lifecycle');
      await page.getByRole('button', { name: /^Deprecate$/i }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();

      // Verify deprecation
      await expect(page.getByText('DEPRECATED')).toBeVisible();

      // Step 3: Delete contract
      page.on('dialog', (dialog) => dialog.accept());
      await page
        .getByRole('button', { name: /Delete/i })
        .first()
        .click();
      await page.waitForTimeout(1000);

      // Verify deletion
      await expect(page.getByText('Query.lifecycle')).not.toBeVisible();

      // Should show empty state or "No contracts registered"
      const hasEmptyState = await page
        .getByText(/No contracts registered/i)
        .isVisible()
        .catch(() => false);

      expect(hasEmptyState).toBeTruthy();
    });
  });
});
