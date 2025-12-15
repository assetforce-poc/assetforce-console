/**
 * E2E Test Fixtures for Admin Console
 */

import { test as base, expect, Page } from '@playwright/test';

// Page URLs
export const urls = {
  accounts: '/accounts',
  accountDetail: (id: string) => `/accounts/${id}`,
  dashboard: '/',
};

/**
 * Test account credentials for E2E tests
 * These accounts are created by seed-test-data.sh script
 */
export const testAccounts = {
  unverified: {
    username: 'e2etestunverified',
    email: 'unverified@e2etest.com',
    password: 'Test1234!',
  },
  verified: {
    username: 'e2etestverified',
    email: 'verified@e2etest.com',
    password: 'Test1234!',
  },
  attrs: {
    username: 'e2etestattrs',
    email: 'attrs@e2etest.com',
    password: 'Test1234!',
  },
};

/**
 * Helper function to login as a test user (creates session in AAC)
 * @param page Playwright page object
 * @param username Username or email
 * @param password Password
 */
export async function loginAsTestUser(page: Page, username: string, password: string): Promise<void> {
  // Call AAC GraphQL login mutation directly to create session (using new namespace API)
  const response = await page.request.post('/api/graphql/aac', {
    data: {
      query: `
        mutation Login($username: String!, $password: String!) {
          authenticate {
            login(username: $username, password: $password) {
              success
            }
          }
        }
      `,
      variables: {
        username,
        password,
      },
    },
  });

  const data = await response.json();

  if (!data?.data?.authenticate?.login?.success) {
    const error = data?.errors?.[0]?.message || 'Unknown error';
    throw new Error(`Login failed: ${error}`);
  }
}

/**
 * Helper function to get account ID by username
 * @param page Playwright page object
 * @param username Username to search for
 * @returns Account ID
 */
export async function getAccountIdByUsername(page: Page, username: string): Promise<string> {
  // Fetch all accounts and find by username (simple and reliable)
  const response = await page.request.post('/api/graphql/aac', {
    data: {
      query: `
        query GetAllAccounts {
          account {
            list(queries: { pagination: { page: 1, size: 100 } }) {
              items {
                id
                username
              }
            }
          }
        }
      `,
    },
  });

  const data = await response.json();
  const items = data?.data?.account?.list?.items || [];

  // Find exact match by username
  const exactMatch = items.find((item: any) => item.username === username);

  if (!exactMatch) {
    // Debug: print available usernames to help troubleshooting
    console.log(
      'Available usernames:',
      items.map((i: any) => i.username)
    );
    throw new Error(`Account not found for username: ${username}`);
  }

  return exactMatch.id;
}

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
