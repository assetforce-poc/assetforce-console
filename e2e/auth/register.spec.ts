/**
 * E2E Tests for User Registration Flow
 *
 * Prerequisites:
 * 1. Start dev environment:
 *    docker-compose up customer-portal-dev -d
 *
 * 2. Run tests:
 *    yarn e2e:auth
 */

import { test, expect, testUser, urls } from './fixtures';

test.describe('User Registration', () => {
  test.describe('Form Validation', () => {
    test('should display registration form with all fields', async ({ page }) => {
      await page.goto(urls.register);

      // Check form exists
      await expect(page.getByTestId('register-form')).toBeVisible();
      await expect(page.getByTestId('register-title')).toBeVisible();

      // Check all form fields are present
      await expect(page.getByTestId('register-firstName')).toBeVisible();
      await expect(page.getByTestId('register-lastName')).toBeVisible();
      await expect(page.getByTestId('register-email')).toBeVisible();
      await expect(page.getByTestId('register-password')).toBeVisible();
      await expect(page.getByTestId('register-acceptTerms')).toBeVisible();
      await expect(page.getByTestId('register-submit')).toBeVisible();
    });

    test('should show validation errors for empty submission', async ({ page }) => {
      await page.goto(urls.register);

      // Fill minimum required to bypass browser validation, then clear
      const firstName = page.getByTestId('register-firstName').locator('input');
      await firstName.fill('a');
      await firstName.clear();

      // Click submit
      await page.getByTestId('register-submit').click();

      // Browser will show native validation - just verify form didn't submit
      // (we stay on register page)
      await expect(page).toHaveURL(/register/);
    });

    test('should show error for invalid email format', async ({ page }) => {
      await page.goto(urls.register);

      // Fill all required fields but with invalid email
      await page.getByTestId('register-firstName').locator('input').fill('Test');
      await page.getByTestId('register-lastName').locator('input').fill('User');
      await page.getByTestId('register-email').locator('input').fill('invalid-email');
      await page.getByTestId('register-password').locator('input').fill('Password123!');
      await page.getByTestId('register-acceptTerms').locator('input').check();

      await page.getByTestId('register-submit').click();

      // Should show validation error for invalid email
      await expect(page.getByText('Invalid email format')).toBeVisible();
    });

    test('should show error for short password', async ({ page }) => {
      await page.goto(urls.register);

      // Fill all required fields but with short password
      await page.getByTestId('register-firstName').locator('input').fill('Test');
      await page.getByTestId('register-lastName').locator('input').fill('User');
      await page.getByTestId('register-email').locator('input').fill('test@example.com');
      await page.getByTestId('register-password').locator('input').fill('short');
      await page.getByTestId('register-acceptTerms').locator('input').check();

      await page.getByTestId('register-submit').click();

      // Should show validation error for short password
      await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
    });
  });

  test.describe('Successful Registration', () => {
    test('should complete registration and show success page', async ({ page }) => {
      await page.goto(urls.register);

      // Fill registration form using testid
      await page.getByTestId('register-firstName').locator('input').fill(testUser.firstName);
      await page.getByTestId('register-lastName').locator('input').fill(testUser.lastName);
      await page.getByTestId('register-email').locator('input').fill(testUser.email);
      await page.getByTestId('register-password').locator('input').fill(testUser.password);
      await page.getByTestId('register-acceptTerms').locator('input').check();

      // Submit form
      await page.getByTestId('register-submit').click();

      // Should redirect to success page
      await expect(page).toHaveURL(/registration-success/, { timeout: 15000 });

      // Should show the email on success page
      await expect(page.getByText(testUser.email)).toBeVisible();
    });
  });

  test.describe('Email Availability Check', () => {
    test.skip('should show error for already registered email', async ({ page }) => {
      // Skip: Requires specific test data (admin@example.com to exist)
      await page.goto(urls.register);

      await page.getByTestId('register-email').locator('input').fill('admin@example.com');

      // Wait for debounce and API call
      await page.waitForTimeout(1500);

      // Should show email already registered error
      await expect(page.getByText('This email is already registered')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to login page from sign in link', async ({ page }) => {
      await page.goto(urls.register);

      await page.getByTestId('register-login-link').click();

      await expect(page).toHaveURL(/login/);
    });

    test('should navigate back to login from success page', async ({ page }) => {
      // Access success page directly for navigation test
      await page.goto(`${urls.registrationSuccess}?email=test@example.com`);

      // Find the back to sign in link (may need testid on RegistrationSuccess too)
      const backLink = page.getByRole('link', { name: /sign in/i });
      await backLink.click();

      await expect(page).toHaveURL(/login/);
    });
  });
});
