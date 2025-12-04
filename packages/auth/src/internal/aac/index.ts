export {
  type AuthenticateResult,
  fromAuthResult,
  fromPreAuthResult,
  toIdentityContext,
  toTenant,
  toUser,
} from './adapter';
export { AACClient, type AACClientOptions, createAACClient } from './client';

// AuthClient interface and result types (for custom implementations)
export type { AuthClient, AuthResult, IdentityContext, PreAuthResult, Realm, Subject } from './types';
