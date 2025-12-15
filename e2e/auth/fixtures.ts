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
};

// MailHog API configuration
export const mailhog = {
  apiUrl: process.env.MAILHOG_API_URL || 'http://localhost:8125',

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
