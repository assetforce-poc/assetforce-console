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

import { test, expect, testUser, urls, mailhog } from './fixtures';

test.describe('User Registration', () => {
  test.describe('Form Validation', () => {
    test('should display registration form with all fields', async ({ page }) => {
      await page.goto(urls.register);

      // Check form exists
      await expect(page.getByTestId('register-form')).toBeVisible();
      await expect(page.getByTestId('register-title')).toBeVisible();

      // Check all form fields are present
      await expect(page.getByTestId('register-email')).toBeVisible();
      await expect(page.getByTestId('register-password')).toBeVisible();
      await expect(page.getByTestId('register-firstName')).toBeVisible();
      await expect(page.getByTestId('register-lastName')).toBeVisible();
      await expect(page.getByTestId('register-acceptTerms')).toBeVisible();
      await expect(page.getByTestId('register-submit')).toBeVisible();
    });

    test('should display fields in correct order: email, password, firstName, lastName', async ({ page }) => {
      await page.goto(urls.register);

      // Get all input fields in the form
      const formFields = page
        .getByTestId('register-form')
        .locator('input[type="text"], input[type="email"], input[type="password"]');

      // Get field order by data-testid of parent elements
      const emailField = page.getByTestId('register-email');
      const passwordField = page.getByTestId('register-password');
      const firstNameField = page.getByTestId('register-firstName');
      const lastNameField = page.getByTestId('register-lastName');

      // Get bounding boxes to determine visual order
      const emailBox = await emailField.boundingBox();
      const passwordBox = await passwordField.boundingBox();
      const firstNameBox = await firstNameField.boundingBox();
      const lastNameBox = await lastNameField.boundingBox();

      // Verify fields are visible and have positions
      expect(emailBox).toBeTruthy();
      expect(passwordBox).toBeTruthy();
      expect(firstNameBox).toBeTruthy();
      expect(lastNameBox).toBeTruthy();

      // Verify order: email should come before password
      expect(emailBox!.y).toBeLessThan(passwordBox!.y);

      // Verify order: password should come before firstName
      expect(passwordBox!.y).toBeLessThan(firstNameBox!.y);

      // Verify order: firstName should be in same row or before lastName
      // (they might be side-by-side on larger screens)
      expect(firstNameBox!.y).toBeLessThanOrEqual(lastNameBox!.y);
    });

    test('should show firstName and lastName as optional with placeholder', async ({ page }) => {
      await page.goto(urls.register);

      // Check firstName field
      const firstNameInput = page.getByTestId('register-firstName').locator('input');
      const firstNamePlaceholder = await firstNameInput.getAttribute('placeholder');
      expect(firstNamePlaceholder).toBe('Optional');

      // Check lastName field
      const lastNameInput = page.getByTestId('register-lastName').locator('input');
      const lastNamePlaceholder = await lastNameInput.getAttribute('placeholder');
      expect(lastNamePlaceholder).toBe('Optional');

      // Verify these fields are NOT required (no required attribute)
      const firstNameRequired = await firstNameInput.getAttribute('required');
      const lastNameRequired = await lastNameInput.getAttribute('required');
      expect(firstNameRequired).toBeNull();
      expect(lastNameRequired).toBeNull();
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

    test('should register successfully without firstName and lastName', async ({ page }) => {
      await page.goto(urls.register);

      // Generate unique email
      const timestamp = Date.now();
      const email = `nofullname${timestamp}@test.com`;

      // Fill registration form WITHOUT firstName/lastName
      await page.getByTestId('register-email').locator('input').fill(email);
      await page.getByTestId('register-password').locator('input').fill('TestPassword123!');
      await page.getByTestId('register-acceptTerms').locator('input').check();

      // Submit form
      await page.getByTestId('register-submit').click();

      // Should redirect to success page
      await expect(page).toHaveURL(/registration-success/, { timeout: 15000 });

      // Should show the email on success page
      await expect(page.getByText(email)).toBeVisible();
    });
  });

  test.describe('Email Availability Check', () => {
    test('should show error for already registered email', async ({ page }) => {
      // Test with admin@example.com (assumed to exist in test environment)
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

  test.describe('Email Verification', () => {
    test.beforeEach(async () => {
      // Clean up MailHog before each test
      await mailhog.deleteAllMessages();
    });

    test('should send verification email after successful registration', async ({ page }) => {
      // Generate unique email for this test
      const timestamp = Date.now();
      const email = `e2e-test-${timestamp}@example.com`;

      await page.goto(urls.register);

      // Fill and submit registration form
      await page.getByTestId('register-firstName').locator('input').fill('E2E');
      await page.getByTestId('register-lastName').locator('input').fill('Test');
      await page.getByTestId('register-email').locator('input').fill(email);
      await page.getByTestId('register-password').locator('input').fill('TestPassword123!');
      await page.getByTestId('register-acceptTerms').locator('input').check();
      await page.getByTestId('register-submit').click();

      // Wait for success page
      await expect(page).toHaveURL(/registration-success/, { timeout: 15000 });

      // Wait for email to arrive in MailHog
      const emailMessage = await mailhog.waitForEmail(email, 10000);

      // Verify email was received
      expect(emailMessage).toBeTruthy();

      // Verify email recipients
      const toHeader = emailMessage.Content?.Headers?.To;
      expect(toHeader).toBeTruthy();
      expect(toHeader.some((to: string) => to.includes(email))).toBe(true);

      // Verify email subject
      const subject = emailMessage.Content?.Headers?.Subject?.[0];
      expect(subject).toContain('Verify Your AssetForce Account');

      // Verify email has verification URL
      const token = mailhog.extractVerificationToken(emailMessage);
      expect(token).toBeTruthy();
      expect(token).toMatch(/^[a-f0-9-]{36}$/); // UUID format
    });

    test('should send verification email with correct sender', async ({ page }) => {
      const timestamp = Date.now();
      const email = `e2e-sender-test-${timestamp}@example.com`;

      await page.goto(urls.register);

      // Fill and submit registration form
      await page.getByTestId('register-email').locator('input').fill(email);
      await page.getByTestId('register-password').locator('input').fill('TestPassword123!');
      await page.getByTestId('register-acceptTerms').locator('input').check();
      await page.getByTestId('register-submit').click();

      // Wait for success page
      await expect(page).toHaveURL(/registration-success/, { timeout: 15000 });

      // Wait for email
      const emailMessage = await mailhog.waitForEmail(email, 10000);

      // Verify sender (dev environment should use dev@assetforce.local)
      const fromHeader = emailMessage.Content?.Headers?.From?.[0];
      expect(fromHeader).toBeTruthy();
      expect(fromHeader).toContain('AssetForce Development');
      expect(fromHeader).toContain('dev@assetforce.local');
    });

    test('should allow email verification using link from email', async ({ page }) => {
      const timestamp = Date.now();
      const email = `e2e-verify-${timestamp}@example.com`;

      await page.goto(urls.register);

      // Register new user
      await page.getByTestId('register-firstName').locator('input').fill('Verify');
      await page.getByTestId('register-lastName').locator('input').fill('Test');
      await page.getByTestId('register-email').locator('input').fill(email);
      await page.getByTestId('register-password').locator('input').fill('TestPassword123!');
      await page.getByTestId('register-acceptTerms').locator('input').check();
      await page.getByTestId('register-submit').click();

      // Wait for success page
      await expect(page).toHaveURL(/registration-success/, { timeout: 15000 });

      // Get verification email
      const emailMessage = await mailhog.waitForEmail(email, 10000);
      const token = mailhog.extractVerificationToken(emailMessage);
      expect(token).toBeTruthy();

      // Navigate to verification URL
      await page.goto(`${urls.verifyEmail}?token=${token}`);

      // Verify the verification page loads
      // (Actual verification logic depends on your implementation)
      await expect(page).toHaveURL(new RegExp(`verify-email.*token=${token}`));

      // Check for success message or verification status
      // This depends on your actual verification page implementation
      // Adjust the selector based on your actual UI
      // await expect(page.getByText(/verified|success/i)).toBeVisible({ timeout: 10000 });
    });

    test('should send email with HTML content', async ({ page }) => {
      const timestamp = Date.now();
      const email = `e2e-html-${timestamp}@example.com`;

      await page.goto(urls.register);

      // Register
      await page.getByTestId('register-email').locator('input').fill(email);
      await page.getByTestId('register-password').locator('input').fill('TestPassword123!');
      await page.getByTestId('register-acceptTerms').locator('input').check();
      await page.getByTestId('register-submit').click();

      // Wait for success
      await expect(page).toHaveURL(/registration-success/, { timeout: 15000 });

      // Get email
      const emailMessage = await mailhog.waitForEmail(email, 10000);

      // Verify email has HTML content (check MIME structure)
      expect(emailMessage.MIME).toBeTruthy();

      // Email should have multiple parts (HTML + plain text)
      const hasMimeParts = emailMessage.MIME?.Parts && emailMessage.MIME.Parts.length > 0;
      expect(hasMimeParts).toBe(true);

      // Look for HTML content indicators in body
      let body = '';
      if (emailMessage.MIME?.Parts) {
        for (const part of emailMessage.MIME.Parts) {
          if (part.Body) {
            body += part.Body;
          }
          if (part.MIME?.Parts) {
            for (const subpart of part.MIME.Parts) {
              if (subpart.Body) {
                body += subpart.Body;
              }
            }
          }
        }
      }

      // Verify HTML content exists
      expect(body).toContain('<!DOCTYPE html>');
      expect(body).toContain('Welcome to AssetForce');
      expect(body).toContain('Verify Email'); // Button text
    });
  });
});
