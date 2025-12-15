/**
 * @assetforce/auth - Main entry point
 *
 * This export is safe for both client and server components.
 * For server-only code (auth instance, API handlers), use:
 *   import { auth } from '@assetforce/auth/server';
 *
 * For React hooks, use:
 *   import { useAuth } from '@assetforce/auth/react';
 */

// Types (safe for client and server)
export type { AuthConfig, AuthErrorCode, IdentityContext, Session, Tenant, User } from './types';
export { AuthError } from './types';

// AuthClient interface (type-only, safe for client)
export type { AuthClient } from './internal/aac';

// HOC guards (client components)
export type { WithAuthOptions, WithTenantOptions } from './hoc';
export { withAuth, withGuards, withTenant } from './hoc';

// Re-export server types (type-only imports are safe)
export type { AuthInstance } from './server/createAuth';
