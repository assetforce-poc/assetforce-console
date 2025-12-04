// Server exports
export { auth, createAuth } from './server';
export type { AuthInstance } from './server/createAuth';

// Types
export type {
  Session,
  User,
  IdentityContext,
  Tenant,
  TenantSelection,
  AuthConfig,
  AuthErrorCode,
} from './types';

export { AuthError } from './types';
