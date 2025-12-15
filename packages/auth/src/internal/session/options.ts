import type { SessionOptions } from 'iron-session';

import type { AuthConfig } from '../../types';

/**
 * Default session options
 */
export const DEFAULT_SESSION_OPTIONS = {
  cookieName: 'assetforce_session',
  ttl: 60 * 60 * 24 * 7, // 7 days
};

/**
 * Determine if cookies should use Secure flag
 *
 * Priority:
 * 1. Explicit config value (session.cookieOptions.secure)
 * 2. AUTH_COOKIE_SECURE environment variable (runtime)
 * 3. Default: true (secure by default)
 */
function getSecureFlag(config?: boolean): boolean {
  // Explicit config takes precedence
  if (config !== undefined) {
    return config;
  }

  // Check runtime environment variable (not replaced at build time)
  const envValue = process.env['AUTH_COOKIE_SECURE'];
  if (envValue !== undefined) {
    return envValue === 'true' || envValue === '1';
  }

  // Default to secure (safer for production)
  return true;
}

/**
 * Build iron-session options from AuthConfig
 */
export function buildSessionOptions(config: AuthConfig): SessionOptions {
  const { session } = config;

  if (!session.password) {
    throw new Error('Session password is required. Set AUTH_SECRET environment variable (min 32 characters).');
  }

  return {
    password: session.password,
    cookieName: session.cookieName || DEFAULT_SESSION_OPTIONS.cookieName,
    ttl: session.ttl || DEFAULT_SESSION_OPTIONS.ttl,
    cookieOptions: {
      httpOnly: true,
      secure: getSecureFlag(session.cookieOptions?.secure),
      sameSite: session.cookieOptions?.sameSite || 'lax',
      path: session.cookieOptions?.path || '/',
    },
  };
}
