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
      secure: process.env.NODE_ENV === 'production',
      sameSite: session.cookieOptions?.sameSite || 'lax',
      path: session.cookieOptions?.path || '/',
    },
  };
}
