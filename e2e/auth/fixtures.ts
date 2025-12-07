/**
 * E2E Test Fixtures for Authentication
 */

import { test as base, expect } from '@playwright/test';

// Test user data
export const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User',
};

// Page URLs
export const urls = {
  register: '/auth/register',
  login: '/auth/login',
  registrationSuccess: '/auth/registration-success',
  verifyEmail: '/auth/verify-email',
};

// Extend base test with auth fixtures
export const test = base.extend<{
  registerPage: ReturnType<typeof base.page>;
}>({
  registerPage: async ({ page }, use) => {
    await page.goto(urls.register);
    await use(page);
  },
});

export { expect };
