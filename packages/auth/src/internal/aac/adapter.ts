import type { IdentityContext as AppIdentityContext, SessionData, Tenant as AppTenant, User } from '../../types';
import type { AuthResult, IdentityContext, LoginResult, Tenant } from './types';

/**
 * Convert internal IdentityContext to app IdentityContext
 * Note: Internal and GraphQL both use 'tenant', app layer uses 'realm'
 * Uses nullish coalescing to convert null (from GraphQL) to undefined (app expectation)
 */
export function toIdentityContext(ctx: IdentityContext): AppIdentityContext {
  return {
    zone: ctx.zone ?? undefined,
    realm: ctx.tenant, // Both use 'tenant', app layer calls it 'realm'
    subject: {
      accountId: ctx.subject.accountId,
      userId: ctx.subject.userId ?? undefined,
      username: ctx.subject.username,
      email: ctx.subject.email ?? undefined,
      displayName: ctx.subject.displayName ?? undefined,
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
    name: ctx.subject.displayName ?? ctx.subject.username,
    email: ctx.subject.email ?? undefined,
    image: undefined,
  };
}

/**
 * Convert GraphQL Tenant to app Tenant
 * Uses generated Tenant type from schema
 */
export function toTenant(tenant: Tenant): AppTenant {
  return {
    id: tenant.id,
    name: tenant.name,
    zoneId: tenant.zoneId,
    realmType: tenant.type,
    description: tenant.description ?? undefined,
  };
}

/**
 * Create a minimal Tenant from realm string
 */
function createTenantFromRealm(realm: string): AppTenant {
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
  /** Whether tenant onboarding is required (user has no tenants) */
  requiresTenantOnboarding?: boolean;
  /** Subject ID for tenant selection (only if requiresTenantSelection) */
  subject?: string;
  /** Available tenants (only if requiresTenantSelection) */
  availableTenants?: AppTenant[];
  /** Session data (only if single tenant or selected) */
  sessionData?: SessionData;
  /** Error message if failed */
  error?: string;
}

/**
 * Convert LoginResult to AuthenticateResult
 * Updated for Phase 1: uses LoginResult type from GraphQL codegen
 */
export function fromLoginResult(result: LoginResult): AuthenticateResult {
  if (!result.success) {
    return {
      success: false,
      requiresTenantSelection: false,
      error: result.error || 'Authentication failed',
    };
  }

  // No tenants: needs onboarding
  if (!result.tenants || result.tenants.length === 0) {
    return {
      success: true,
      requiresTenantSelection: false,
      requiresTenantOnboarding: true,
      subject: result.subject ?? undefined,
    };
  }

  // Multi-tenant: needs selection
  if (result.tenants.length > 1) {
    return {
      success: true,
      requiresTenantSelection: true,
      subject: result.subject ?? undefined,
      availableTenants: result.tenants.map(toTenant),
    };
  }

  // Single tenant: got tokens directly
  if (result.accessToken && result.identityContext) {
    const sessionData: SessionData = {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken ?? undefined,
      expiresAt: result.expiresIn ? Date.now() + result.expiresIn * 1000 : Date.now() + 3600 * 1000, // Default 1 hour
      user: toUser(result.identityContext as IdentityContext),
      identity: toIdentityContext(result.identityContext as IdentityContext),
      tenant: createTenantFromRealm(result.identityContext.tenant), // Updated: realm → tenant
    };

    return {
      success: true,
      requiresTenantSelection: false,
      sessionData,
    };
  }

  // Single tenant but no tokens (fallback for tenants with 1 item)
  if (result.tenants.length === 1) {
    return {
      success: true,
      requiresTenantSelection: true,
      subject: result.subject ?? undefined,
      availableTenants: result.tenants.map(toTenant),
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
    refreshToken: result.refreshToken ?? undefined, // Convert null to undefined
    expiresAt: result.expiresIn ? Date.now() + result.expiresIn * 1000 : Date.now() + 3600 * 1000,
    user: toUser(result.identityContext),
    identity: toIdentityContext(result.identityContext),
    tenant: createTenantFromRealm(result.identityContext.tenant),
  };
}
