/**
 * SessionConfig - iron-session cookie configuration
 */
export interface SessionConfig {
  /** Secret password for cookie encryption (min 32 chars) */
  password: string;
  /** Cookie name */
  cookieName?: string;
  /** Session TTL in seconds (default: 7 days) */
  ttl?: number;
  /** Cookie options */
  cookieOptions?: {
    /** Secure flag (default: true in production) */
    secure?: boolean;
    /** SameSite attribute (default: 'lax') */
    sameSite?: 'strict' | 'lax' | 'none';
    /** Cookie path (default: '/') */
    path?: string;
  };
}

/**
 * AuthConfig - Authentication configuration
 */
export interface AuthConfig {
  /** Auth backend endpoint (e.g., GraphQL API URL) */
  endpoint: string;
  /** Application URL (for callbacks) */
  appUrl?: string;
  /** Session configuration for iron-session (required) */
  session: SessionConfig;
}
