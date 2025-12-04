// Server exports
export { auth, createAuth } from './server';
export type { AuthInstance } from './server/createAuth';

// Types
export type { AuthConfig, AuthErrorCode, IdentityContext, Session, Tenant, User } from './types';
export { AuthError } from './types';

// AuthClient interface (for custom backend implementations)
export type { AuthClient } from './internal/aac';
