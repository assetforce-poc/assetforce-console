/**
 * E2E Test Fixtures for Admin Console
 */

import { test as base, expect } from '@playwright/test';

// Page URLs
export const urls = {
  accounts: '/accounts',
  dashboard: '/',
};

// Extend base test with admin fixtures
export const test = base.extend<{
  accountsPage: ReturnType<typeof base.page>;
}>({
  accountsPage: async ({ page }, use) => {
    await page.goto(urls.accounts);
    await use(page);
  },
});

export { expect };
