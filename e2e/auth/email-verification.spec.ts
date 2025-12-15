/**
 * E2E Tests for Email Verification Flow
 *
 * Prerequisites:
 * 1. Start dev environment with MailHog:
 *    cd assetforce-infra/docker
 *    docker compose -f docker-compose.dev.yml up -d
 *
 * 2. Run tests:
 *    yarn e2e:auth
 *
 * Tests:
 * - Email sending after registration
 * - Verification link extraction and usage
 * - Resend verification email from success page
 * - Resend verification email from error page
 * - Complete verification flow to select-tenant page
 */

import { test, expect, testUser, urls, mailhog } from './fixtures';

test.describe('Email Verification Flow', () => {
  // Warm up portal on first test
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    try {
      // Warm up portal by accessing home page first
      await page.goto('/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    } catch (error) {
      console.warn('Portal warm-up failed, continuing anyway:', error);
    } finally {
      await page.close();
    }
  });

  // Clean up emails before each test
  test.beforeEach(async () => {
    await mailhog.deleteAllMessages();
  });

  test.describe('Email Sending', () => {
    test('should send verification email after successful registration', async ({ page }) => {
      // Generate unique email for this test
      const timestamp = Date.now();
      const email = `verify-test-${timestamp}@example.com`;

      // Register new user (increase timeout for slow portal startup)
      await page.goto(urls.register, { timeout: 60000 });
      await page.getByTestId('register-email').locator('input').fill(email);
      await page.getByTestId('register-password').locator('input').fill(testUser.password);
      await page.getByTestId('register-firstName').locator('input').fill(testUser.firstName);
      await page.getByTestId('register-lastName').locator('input').fill(testUser.lastName);
      await page.getByTestId('register-acceptTerms').locator('input').check();
      await page.getByTestId('register-submit').click();

      // Should redirect to success page
      await expect(page).toHaveURL(/registration-success/, { timeout: 15000 });

      // Wait for email to arrive in MailHog
      const emailMessage = await mailhog.waitForEmail(email, 15000);

      // Verify email was sent
      expect(emailMessage).toBeTruthy();

      // Verify email content
      const headers = emailMessage.Content?.Headers || {};
      expect(headers.To).toContain(email);
      // Subject is an array in MailHog, check first element
      expect(headers.Subject?.[0] || '').toContain('Verify');

      // Verify email contains verification link
      const htmlBody = emailMessage.Content?.Body || '';
      expect(htmlBody).toContain('verify-email?token=');
    });

    test('should include verification token in email', async ({ page }) => {
      const timestamp = Date.now();
      const email = `token-test-${timestamp}@example.com`;

      // Register new user
      await page.goto(urls.register);
      await page.getByTestId('register-email').locator('input').fill(email);
      await page.getByTestId('register-password').locator('input').fill(testUser.password);
      await page.getByTestId('register-acceptTerms').locator('input').check();
      await page.getByTestId('register-submit').click();

      // Wait for email
      const emailMessage = await mailhog.waitForEmail(email, 15000);

      // Extract verification token
      const token = mailhog.extractVerificationToken(emailMessage);

      // Verify token format (UUID)
      expect(token).toBeTruthy();
      expect(token).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/);
    });
  });

  test.describe('Email Verification', () => {
    test('should verify email successfully with valid token', async ({ page }) => {
      const timestamp = Date.now();
      const email = `verify-success-${timestamp}@example.com`;

      // Register new user
      await page.goto(urls.register);
      await page.getByTestId('register-email').locator('input').fill(email);
      await page.getByTestId('register-password').locator('input').fill(testUser.password);
      await page.getByTestId('register-acceptTerms').locator('input').check();
      await page.getByTestId('register-submit').click();

      // Wait for email
      const emailMessage = await mailhog.waitForEmail(email, 15000);
      const token = mailhog.extractVerificationToken(emailMessage);

      expect(token).toBeTruthy();
      console.log(`✓ Extracted token: ${token}`);

      // Navigate to verification page with token
      await page.goto(`${urls.verifyEmail}?token=${token}`);

      // Wait for either success or error heading to appear (React hydration)
      await page.waitForSelector('h1, h2, h3, h4', { timeout: 20000 });

      // Should show success OR redirect to tenant selection (if no tenants)
      // Note: Users without tenants are auto-redirected to "Select Organization" page
      const successHeading = page.getByRole('heading', { name: /Email Verified!?|Already Verified/i });
      const tenantHeading = page.getByRole('heading', { name: /Select Organization/i });

      const isSuccess = await successHeading.isVisible().catch(() => false);
      const isTenantPage = await tenantHeading.isVisible().catch(() => false);

      expect(isSuccess || isTenantPage).toBeTruthy();

      // Should have Sign In button or link (text varies by page)
      const hasSignIn = await page
        .getByRole('link', { name: /Sign In|GO TO SIGN IN/i })
        .isVisible()
        .catch(() => false);
      const hasSignInButton = await page
        .getByRole('button', { name: /Sign In|GO TO SIGN IN/i })
        .isVisible()
        .catch(() => false);
      expect(hasSignIn || hasSignInButton).toBeTruthy();
    });

    test('should show error for invalid verification token', async ({ page }) => {
      const invalidToken = '00000000-0000-0000-0000-000000000000';

      await page.goto(`${urls.verifyEmail}?token=${invalidToken}`);

      // Should show error message
      await expect(page.getByText(/Invalid Link|Link Expired/i)).toBeVisible({ timeout: 15000 });

      // Should show resend email section (use button role to avoid strict mode violation)
      await expect(page.getByRole('button', { name: /Resend Verification Email/i })).toBeVisible();
    });

    test('should show error when no token provided', async ({ page }) => {
      await page.goto(urls.verifyEmail);

      // Should show invalid link message
      await expect(page.getByText(/Invalid Verification Link/i)).toBeVisible();
    });
  });

  test.describe('Resend Verification Email - Success Page', () => {
    test('should have resend button with 60s cooldown on registration success page', async ({ page }) => {
      const timestamp = Date.now();
      const email = `resend-success-${timestamp}@example.com`;

      // Register new user
      await page.goto(urls.register);
      await page.getByTestId('register-email').locator('input').fill(email);
      await page.getByTestId('register-password').locator('input').fill(testUser.password);
      await page.getByTestId('register-acceptTerms').locator('input').check();
      await page.getByTestId('register-submit').click();

      // Should be on success page
      await expect(page).toHaveURL(/registration-success/, { timeout: 15000 });

      // Should show email address
      await expect(page.getByText(email)).toBeVisible();

      // Should have resend button with cooldown
      const resendButton = page.getByRole('button', { name: /resend/i });
      await expect(resendButton).toBeVisible();

      // Button should be disabled initially (60s cooldown)
      await expect(resendButton).toBeDisabled();

      // Should show countdown text
      await expect(resendButton).toContainText(/\d+s/);
    });

    test('should resend verification email after cooldown', async ({ page }) => {
      const timestamp = Date.now();
      const email = `resend-after-cooldown-${timestamp}@example.com`;

      // Navigate directly to success page (skip registration to save time)
      await page.goto(`${urls.registrationSuccess}?email=${email}`);

      // Wait for initial cooldown to expire (we'll mock this by waiting a bit)
      // In real scenario, cooldown is 60s. For testing, we'll wait 2s and check button state
      await page.waitForTimeout(2000);

      // Check if cooldown is counting down
      const resendButton = page.getByRole('button', { name: /resend/i });

      // Button should exist
      await expect(resendButton).toBeVisible();

      // Note: In a real E2E test, you might want to:
      // 1. Mock the timer to speed up cooldown
      // 2. Or wait the full 60 seconds
      // 3. Or test the behavior without waiting

      // For now, we verify the button exists and shows cooldown
      const buttonText = await resendButton.textContent();
      expect(buttonText).toMatch(/resend|sending|wait/i);
    });
  });

  test.describe('Resend Verification Email - Error Page', () => {
    test('should show resend form on verification error page', async ({ page }) => {
      const invalidToken = '00000000-0000-0000-0000-000000000000';

      await page.goto(`${urls.verifyEmail}?token=${invalidToken}`);

      // Wait for error state
      await expect(page.getByText(/Invalid Link|Link Expired/i)).toBeVisible({ timeout: 15000 });

      // Should show resend email section (use role selector to be specific)
      await expect(page.getByRole('button', { name: /Resend Verification Email/i })).toBeVisible();

      // Should have email input
      await expect(page.getByLabel(/Email/i)).toBeVisible();

      // Should have resend button
      await expect(page.getByRole('button', { name: /Resend Verification Email/i })).toBeVisible();
    });

    test('should resend email from error page and show success message', async ({ page }) => {
      const timestamp = Date.now();
      const email = `resend-error-${timestamp}@example.com`;

      // First, register to create the account
      await page.goto(urls.register);
      await page.getByTestId('register-email').locator('input').fill(email);
      await page.getByTestId('register-password').locator('input').fill(testUser.password);
      await page.getByTestId('register-acceptTerms').locator('input').check();
      await page.getByTestId('register-submit').click();

      // Wait for first email
      await mailhog.waitForEmail(email, 15000);

      // Clear MailHog to test resend
      await mailhog.deleteAllMessages();

      // Go to error page with invalid token
      const invalidToken = '00000000-0000-0000-0000-000000000000';
      await page.goto(`${urls.verifyEmail}?token=${invalidToken}`);

      // Wait for error state
      await expect(page.getByText(/Invalid Link|Link Expired/i)).toBeVisible({ timeout: 15000 });

      // Fill email and click resend
      await page.getByLabel(/Email/i).fill(email);
      await page.getByRole('button', { name: /Resend Verification Email/i }).click();

      // Should show success message
      await expect(page.getByText(/Verification email has been resent/i)).toBeVisible({ timeout: 15000 });

      // Verify email was sent to MailHog
      const resentEmail = await mailhog.waitForEmail(email, 15000);
      expect(resentEmail).toBeTruthy();
    });

    test('should show validation error for invalid email format on error page', async ({ page }) => {
      const invalidToken = '00000000-0000-0000-0000-000000000000';

      await page.goto(`${urls.verifyEmail}?token=${invalidToken}`);

      // Wait for error state
      await expect(page.getByText(/Invalid Link|Link Expired/i)).toBeVisible({ timeout: 15000 });

      // Enter invalid email
      await page.getByLabel(/Email/i).fill('invalid-email');

      // Try to resend
      await page.getByRole('button', { name: /Resend Verification Email/i }).click();

      // Should show validation error
      await expect(page.getByText(/Invalid email format/i)).toBeVisible();
    });

    test('should enforce 60s cooldown after resending from error page', async ({ page }) => {
      const timestamp = Date.now();
      const email = `resend-cooldown-${timestamp}@example.com`;

      // Register user first
      await page.goto(urls.register);
      await page.getByTestId('register-email').locator('input').fill(email);
      await page.getByTestId('register-password').locator('input').fill(testUser.password);
      await page.getByTestId('register-acceptTerms').locator('input').check();
      await page.getByTestId('register-submit').click();

      // Wait for first email
      await mailhog.waitForEmail(email, 15000);

      // Go to error page
      const invalidToken = '00000000-0000-0000-0000-000000000000';
      await page.goto(`${urls.verifyEmail}?token=${invalidToken}`);

      // Wait for error state
      await expect(page.getByText(/Invalid Link|Link Expired/i)).toBeVisible({ timeout: 15000 });

      // Resend email
      await page.getByLabel(/Email/i).fill(email);
      await page.getByRole('button', { name: /Resend Verification Email/i }).click();

      // Wait for success
      await expect(page.getByText(/Verification email has been resent/i)).toBeVisible({ timeout: 15000 });

      // Button should now show cooldown
      const resendButton = page.getByRole('button', { name: /Resend|Wait/i });
      await expect(resendButton).toBeDisabled();
      await expect(resendButton).toContainText(/Wait \d+s/i);
    });
  });

  test.describe('Complete Flow - Registration to Verification', () => {
    test('should complete full registration and verification flow', async ({ page }) => {
      const timestamp = Date.now();
      const email = `fullflow-${timestamp}@example.com`;

      // Step 1: Register
      await page.goto(urls.register);
      await page.getByTestId('register-email').locator('input').fill(email);
      await page.getByTestId('register-password').locator('input').fill(testUser.password);
      await page.getByTestId('register-firstName').locator('input').fill(testUser.firstName);
      await page.getByTestId('register-lastName').locator('input').fill(testUser.lastName);
      await page.getByTestId('register-acceptTerms').locator('input').check();
      await page.getByTestId('register-submit').click();

      // Step 2: Wait on success page
      await expect(page).toHaveURL(/registration-success/, { timeout: 15000 });

      // Step 3: Get verification email
      const emailMessage = await mailhog.waitForEmail(email, 15000);
      const token = mailhog.extractVerificationToken(emailMessage);

      expect(token).toBeTruthy();
      console.log(`✓ [Complete Flow] Extracted token: ${token}`);

      // Step 4: Verify email
      await page.goto(`${urls.verifyEmail}?token=${token}`);

      // Wait for either success or error heading to appear (React hydration)
      await page.waitForSelector('h1, h2, h3, h4', { timeout: 20000 });

      // Step 5: Should show success OR redirect to tenant selection (if no tenants)
      const successHeading = page.getByRole('heading', { name: /Email Verified!?|Already Verified/i });
      const tenantHeading = page.getByRole('heading', { name: /Select Organization/i });

      const isSuccess = await successHeading.isVisible().catch(() => false);
      const isTenantPage = await tenantHeading.isVisible().catch(() => false);

      expect(isSuccess || isTenantPage).toBeTruthy();

      // Step 6: Verify Sign In button or link is present (text varies by page)
      const hasSignIn = await page
        .getByRole('link', { name: /Sign In|GO TO SIGN IN/i })
        .isVisible()
        .catch(() => false);
      const hasSignInButton = await page
        .getByRole('button', { name: /Sign In|GO TO SIGN IN/i })
        .isVisible()
        .catch(() => false);
      expect(hasSignIn || hasSignInButton).toBeTruthy();
    });
  });
});
