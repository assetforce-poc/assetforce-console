export {
  type AuthenticateResult,
  fromAuthResult,
  fromLoginResult,
  toIdentityContext,
  toTenant,
  toUser,
} from './adapter';
export { AACClient, type AACClientOptions, createAACClient, type PasswordResult } from './client';

// AuthClient interface and result types (for custom implementations)
// Note: IdentityContext, LoginResult, Subject, Tenant are re-exported from generated GraphQL types
export type { AuthClient, AuthResult, IdentityContext, LoginResult, Realm, Subject, Tenant } from './types';
