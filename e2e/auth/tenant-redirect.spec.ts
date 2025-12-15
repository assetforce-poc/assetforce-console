/**
 * E2E Tests for Tenant Redirect Flow
 *
 * Tests the login behavior for users with different tenant statuses:
 * 1. No tenant - should redirect to /tenant/request
 * 2. Single tenant - should redirect to /dashboard
 * 3. Multiple tenants - should show tenant selection
 *
 * Prerequisites:
 * 1. Start dev environment:
 *    docker-compose -f docker-compose.dev.yml up -d
 *
 * 2. Run tests:
 *    yarn e2e:auth tenant-redirect.spec.ts
 */

import { test, expect, urls } from './fixtures';

test.describe('Tenant Redirect Flow', () => {
  test.describe('No Tenant User', () => {
    test('should redirect to /tenant/request after login', async ({ page }) => {
      // Navigate to login page
      await page.goto(urls.login);

      // Wait for page to load (heading is "AssetForce Customer Portal")
      await expect(page.getByRole('heading', { name: /assetforce|customer portal/i })).toBeVisible();

      // Fill in credentials for a user with no tenant
      // Note: This user must exist in test database with no tenant membership
      await page.locator('input[name="credential"]').fill('no-tenant-user@test.com');
      await page.locator('input[name="password"]').fill('Test1234!');

      // Submit login form
      await page.getByRole('button', { name: /continue|sign in/i }).click();

      // Wait for authentication and redirect
      // Should redirect to home (/) then immediately to /tenant/request
      await page.waitForURL(/\/tenant\/request/, { timeout: 10000 });

      // Verify we're on the tenant request page
      await expect(page).toHaveURL(/\/tenant\/request/);
      await expect(page.getByRole('heading', { name: /join an organization/i })).toBeVisible();

      // Verify the "Coming soon" buttons are present
      await expect(page.getByRole('button', { name: /create new organization/i })).toBeDisabled();
      await expect(page.getByRole('button', { name: /request to join/i })).toBeDisabled();
    });

    test('should redirect to /tenant/request when directly accessing /dashboard', async ({ page }) => {
      // First login with no-tenant user
      await page.goto(urls.login);
      await page.locator('input[name="credential"]').fill('no-tenant-user@test.com');
      await page.locator('input[name="password"]').fill('Test1234!');
      await page.getByRole('button', { name: /continue|sign in/i }).click();

      // Wait for initial redirect to /tenant/request
      await page.waitForURL(/\/tenant\/request/, { timeout: 10000 });

      // Now try to directly access /dashboard
      await page.goto('/dashboard');

      // Should be redirected back to /tenant/request by withTenant guard
      await page.waitForURL(/\/tenant\/request/, { timeout: 5000 });
      await expect(page).toHaveURL(/\/tenant\/request/);
    });

    test('should show tenant request page with correct content', async ({ page }) => {
      // Login and get to tenant request page
      await page.goto(urls.login);
      await page.locator('input[name="credential"]').fill('no-tenant-user@test.com');
      await page.locator('input[name="password"]').fill('Test1234!');
      await page.getByRole('button', { name: /continue|sign in/i }).click();
      await page.waitForURL(/\/tenant\/request/, { timeout: 10000 });

      // Verify page content
      await expect(page.getByRole('heading', { name: /join an organization/i })).toBeVisible();
      await expect(page.getByText(/haven't joined any organization yet/i)).toBeVisible();
      await expect(page.getByText(/coming soon/i).first()).toBeVisible();
      await expect(page.getByText(/need help\? contact/i)).toBeVisible();
    });
  });

  test.describe('Single Tenant User', () => {
    test('should redirect to / (home) after login, then to /dashboard', async ({ page }) => {
      // Navigate to login page
      await page.goto(urls.login);

      // Fill in credentials for a user with single tenant
      // Note: This user must exist in test database with exactly one tenant
      await page.locator('input[name="credential"]').fill('single-tenant-user@test.com');
      await page.locator('input[name="password"]').fill('Test1234!');

      // Submit login form
      await page.getByRole('button', { name: /continue|sign in/i }).click();

      // Should redirect to home (/) then to /dashboard
      await page.waitForURL(/\/dashboard/, { timeout: 10000 });
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should be able to access /dashboard directly', async ({ page }) => {
      // First login
      await page.goto(urls.login);
      await page.locator('input[name="credential"]').fill('single-tenant-user@test.com');
      await page.locator('input[name="password"]').fill('Test1234!');
      await page.getByRole('button', { name: /continue|sign in/i }).click();
      await page.waitForURL(/\/dashboard/, { timeout: 10000 });

      // Refresh the page to verify session persists
      await page.reload();
      await expect(page).toHaveURL(/\/dashboard/);

      // Directly navigate to dashboard
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Multi Tenant User', () => {
    test('should show tenant selection page after login', async ({ page }) => {
      // Navigate to login page
      await page.goto(urls.login);

      // Fill in credentials for a user with multiple tenants
      // Note: This user must exist in test database with 2+ tenants
      await page.locator('input[name="credential"]').fill('multi-tenant-user@test.com');
      await page.locator('input[name="password"]').fill('Test1234!');

      // Submit login form
      await page.getByRole('button', { name: /continue|sign in/i }).click();

      // Should show tenant selection UI (not redirect yet)
      await expect(page).toHaveURL(/\/login/); // Still on login page showing tenant selector

      // Verify tenant selection UI is visible
      // The exact selectors depend on TenantSelector component implementation
      await expect(page.getByText(/select.*tenant|choose.*organization/i)).toBeVisible({ timeout: 5000 });
    });

    test('should redirect to /dashboard after selecting a tenant', async ({ page }) => {
      // Navigate to login page
      await page.goto(urls.login);
      await page.locator('input[name="credential"]').fill('multi-tenant-user@test.com');
      await page.locator('input[name="password"]').fill('Test1234!');
      await page.getByRole('button', { name: /continue|sign in/i }).click();

      // Wait for tenant selection to appear
      await expect(page.getByText(/select.*tenant|choose.*organization/i)).toBeVisible({ timeout: 5000 });

      // Select the first tenant by clicking on its name
      // The tenant selector shows buttons with tenant name (e.g., "Tenant A Sandbox Zone: test-zone")
      await page.getByRole('button', { name: /Tenant A/i }).click();

      // Should redirect to home then dashboard
      await page.waitForURL(/\/dashboard/, { timeout: 10000 });
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Unauthenticated Access', () => {
    test('should redirect to /auth/login when accessing /dashboard without auth', async ({ page }) => {
      // Try to access dashboard without logging in
      await page.goto('/dashboard');

      // Should be redirected to login page by withAuth guard
      await page.waitForURL(/\/auth\/login/, { timeout: 5000 });
      await expect(page).toHaveURL(/\/auth\/login/);
    });

    test('should redirect to /auth/login when accessing /tenant/request without auth', async ({ page }) => {
      // Try to access tenant request page without logging in
      await page.goto('/tenant/request');

      // Should be redirected to login page by withAuth guard
      await page.waitForURL(/\/auth\/login/, { timeout: 5000 });
      await expect(page).toHaveURL(/\/auth\/login/);
    });
  });
});
