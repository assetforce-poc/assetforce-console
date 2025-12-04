import type { IdentityContext as AppIdentityContext, SessionData, Tenant, User } from '../../types';
import type { AuthResult, IdentityContext, PreAuthResult, Realm } from './types';

/**
 * Convert AuthClient IdentityContext to app IdentityContext
 */
export function toIdentityContext(ctx: IdentityContext): AppIdentityContext {
  return {
    zone: ctx.zone,
    realm: ctx.realm,
    subject: {
      accountId: ctx.subject.accountId,
      userId: ctx.subject.userId,
      username: ctx.subject.username,
      email: ctx.subject.email,
      displayName: ctx.subject.displayName,
    },
    groups: ctx.groups,
  };
}

/**
 * Convert AuthClient IdentityContext to User
 */
export function toUser(ctx: IdentityContext): User {
  return {
    id: ctx.subject.accountId,
    name: ctx.subject.displayName || ctx.subject.username,
    email: ctx.subject.email,
    image: undefined,
  };
}

/**
 * Convert Realm to Tenant
 */
export function toTenant(realm: Realm): Tenant {
  return {
    id: realm.realmId,
    name: realm.displayName || realm.realmName,
    zoneId: realm.zoneId,
    realmType: realm.realmType,
    description: realm.description,
  };
}

/**
 * Create a minimal Tenant from realm string
 */
function createTenantFromRealm(realm: string): Tenant {
  return {
    id: realm,
    name: realm,
  };
}

/**
 * AuthenticateResult - Result of authenticate operation
 */
export interface AuthenticateResult {
  /** Whether authentication was successful */
  success: boolean;
  /** Whether tenant selection is required */
  requiresTenantSelection: boolean;
  /** Subject ID for tenant selection (only if requiresTenantSelection) */
  subject?: string;
  /** Available tenants (only if requiresTenantSelection) */
  availableTenants?: Tenant[];
  /** Session data (only if single tenant or selected) */
  sessionData?: SessionData;
  /** Error message if failed */
  error?: string;
}

/**
 * Convert PreAuthResult to AuthenticateResult
 */
export function fromPreAuthResult(result: PreAuthResult): AuthenticateResult {
  if (!result.success) {
    return {
      success: false,
      requiresTenantSelection: false,
      error: result.error || 'Authentication failed',
    };
  }

  // Multi-tenant: needs selection
  if (result.availableRealms && result.availableRealms.length > 0) {
    return {
      success: true,
      requiresTenantSelection: true,
      subject: result.subject,
      availableTenants: result.availableRealms.map(toTenant),
    };
  }

  // Single tenant: got tokens directly
  if (result.accessToken && result.identityContext) {
    const sessionData: SessionData = {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresAt: result.expiresIn ? Date.now() + result.expiresIn * 1000 : Date.now() + 3600 * 1000, // Default 1 hour
      user: toUser(result.identityContext),
      identity: toIdentityContext(result.identityContext),
      tenant: createTenantFromRealm(result.identityContext.realm),
    };

    return {
      success: true,
      requiresTenantSelection: false,
      sessionData,
    };
  }

  return {
    success: false,
    requiresTenantSelection: false,
    error: 'Invalid response from authentication server',
  };
}

/**
 * Convert AuthResult to SessionData
 */
export function fromAuthResult(result: AuthResult): SessionData | null {
  if (!result.success || !result.accessToken || !result.identityContext) {
    return null;
  }

  return {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresAt: result.expiresIn ? Date.now() + result.expiresIn * 1000 : Date.now() + 3600 * 1000,
    user: toUser(result.identityContext),
    identity: toIdentityContext(result.identityContext),
    tenant: createTenantFromRealm(result.identityContext.realm),
  };
}
