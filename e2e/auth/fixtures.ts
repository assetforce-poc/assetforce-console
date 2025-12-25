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
  selectTenant: '/auth/select-tenant',
  tenantRequest: '/tenant/request',
  dashboard: '/dashboard',
  home: '/',
  // Password management
  forgotPassword: '/auth/password/forgot',
  resetPassword: '/auth/password/reset',
  changePassword: '/auth/password/change',
};

// MailHog API configuration
export const mailhog = {
  apiUrl: process.env.MAILHOG_API_URL || 'http://localhost:8225',

  /**
   * Get all emails from MailHog
   */
  async getMessages() {
    const response = await fetch(`${this.apiUrl}/api/v2/messages`);
    if (!response.ok) {
      throw new Error(`MailHog API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.items || [];
  },

  /**
   * Get emails sent to a specific recipient
   */
  async getMessagesTo(email: string) {
    const messages = await this.getMessages();
    return messages.filter((msg: any) => msg.Content?.Headers?.To?.some((to: string) => to.includes(email)));
  },

  /**
   * Get the most recent email sent to a recipient
   */
  async getLatestMessageTo(email: string) {
    const messages = await this.getMessagesTo(email);
    return messages.length > 0 ? messages[0] : null;
  },

  /**
   * Extract password reset token from email content
   * Supports both:
   * - Custom format: /password/reset?token=xxx
   * - Keycloak action token format: /action-token?key=xxx
   */
  extractPasswordResetToken(message: any): string | null {
    let body = this.getEmailBody(message);

    // Remove quoted-printable soft line breaks
    body = body.replace(/=\r?\n/g, '');

    // Look for password reset URL patterns
    const patterns = [
      // Custom format
      /password\/reset\?token=3D([a-zA-Z0-9._-]+)/i, // quoted-printable encoded
      /password\/reset\?token=([a-zA-Z0-9._-]+)/i, // normal
      // Keycloak action token format (JWT)
      /action-token\?key=3D([a-zA-Z0-9._-]+)/i, // quoted-printable encoded
      /action-token\?key=([a-zA-Z0-9._-]+)/i, // normal
    ];

    for (const pattern of patterns) {
      const match = body.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  },

  /**
   * Get email body from nested MIME parts
   */
  getEmailBody(message: any): string {
    let body = '';

    if (message.MIME?.Parts) {
      for (const part of message.MIME.Parts) {
        if (part.MIME?.Parts) {
          for (const subpart of part.MIME.Parts) {
            if (subpart.Body) {
              body += subpart.Body;
            }
            if (subpart.MIME?.Parts) {
              for (const innerPart of subpart.MIME.Parts) {
                if (innerPart.Body) {
                  body += innerPart.Body;
                }
              }
            }
          }
        }
        if (part.Body) {
          body += part.Body;
        }
      }
    }

    if (!body && message.Content?.Body) {
      body = message.Content.Body;
    }

    return body;
  },

  /**
   * Extract verification token from email content
   */
  extractVerificationToken(message: any): string | null {
    // Get email body from nested MIME parts (MailHog stores content in nested structure)
    let body = '';

    // Try to get from MIME parts (HTML or plain text)
    if (message.MIME?.Parts) {
      // Navigate through MIME parts to find text content
      for (const part of message.MIME.Parts) {
        if (part.MIME?.Parts) {
          for (const subpart of part.MIME.Parts) {
            if (subpart.Body) {
              body += subpart.Body;
            }
            if (subpart.MIME?.Parts) {
              for (const innerPart of subpart.MIME.Parts) {
                if (innerPart.Body) {
                  body += innerPart.Body;
                }
              }
            }
          }
        }
      }
    }

    // Fallback to Content.Body
    if (!body && message.Content?.Body) {
      body = message.Content.Body;
    }

    // Remove quoted-printable soft line breaks (=\r\n or =\n)
    // These are inserted for line length limits in emails and split our UUID
    body = body.replace(/=\r?\n/g, '');

    // Look for verification URL pattern
    // Handle both normal and quoted-printable encoded URLs
    // Quoted-printable: token=3De73ef69e... (=3D is encoded =)
    // Normal: token=e73ef69e...
    const patterns = [
      /verify-email\?token=3D([a-f0-9-]{36})/i, // quoted-printable encoded
      /verify-email\?token=([a-f0-9-]{36})/i, // normal
    ];

    for (const pattern of patterns) {
      const match = body.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  },

  /**
   * Delete all emails from MailHog
   */
  async deleteAllMessages() {
    const response = await fetch(`${this.apiUrl}/api/v1/messages`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`MailHog API error: ${response.statusText}`);
    }
  },

  /**
   * Wait for an email to arrive (with timeout)
   */
  async waitForEmail(email: string, timeoutMs = 10000): Promise<any> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      const message = await this.getLatestMessageTo(email);
      if (message) {
        return message;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    throw new Error(`Timeout waiting for email to ${email}`);
  },
};

// Test accounts for authenticated tests (seeded from cosmos-realm.json)
export const testAccounts = {
  // User with single tenant membership (for change password tests)
  singleTenant: {
    username: 'single', // For login form
    email: 'single@example.com', // For forgot password form
    password: 'single123',
  },
  // Admin user
  admin: {
    username: 'admin', // For login form
    email: 'admin@example.com', // For forgot password form
    password: 'admin123',
  },
  // Multi-tenant user
  multiTenant: {
    username: 'multi',
    email: 'multi@example.com',
    password: 'multi123',
  },
};

/**
 * Login helper function
 */
export async function login(page: ReturnType<typeof base.page>, email: string, password: string): Promise<void> {
  await page.goto(urls.login);

  // Wait for login form
  await page.waitForSelector('input[name="credential"]', { timeout: 10000 });

  // Fill credentials
  await page.locator('input[name="credential"]').fill(email);
  await page.locator('input[name="password"]').fill(password);

  // Submit
  await page.getByRole('button', { name: /continue|sign in/i }).click();

  // Wait for redirect (successful login redirects away from /auth/login)
  await page.waitForURL((url) => !url.pathname.includes('/auth/login'), {
    timeout: 15000,
  });
}

// Extend base test with auth fixtures
export const test = base.extend<{
  registerPage: ReturnType<typeof base.page>;
  authenticatedPage: ReturnType<typeof base.page>;
}>({
  registerPage: async ({ page }, use) => {
    await page.goto(urls.register);
    await use(page);
  },

  // Authenticated page fixture - logs in before test
  authenticatedPage: async ({ page }, use) => {
    await login(page, testAccounts.singleTenant.email, testAccounts.singleTenant.password);
    await use(page);
  },
});

export { expect };
