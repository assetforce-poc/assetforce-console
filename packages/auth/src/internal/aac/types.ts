/**
 * AuthClient Interface
 *
 * Abstract interface for authentication backends.
 * Implementations can be swapped without changing upper layers.
 */
export interface AuthClient {
  /** Authenticate with username and password */
  authenticate(username: string, password: string): Promise<PreAuthResult>;
  /** Select tenant after authentication (for multi-tenant scenarios) */
  selectTenant(subject: string, realmId: string): Promise<AuthResult>;
  /** Refresh access token */
  refreshToken(refreshToken: string): Promise<AuthResult>;
  /** Logout current session */
  logout(accessToken: string): Promise<boolean>;
}

/**
 * PreAuthResult - Result of initial authentication
 *
 * Single realm: returns tokens directly
 * Multiple realms: returns availableRealms list (user must call selectTenant)
 */
export interface PreAuthResult {
  success: boolean;
  subject?: string;
  availableRealms?: Realm[];
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  identityContext?: IdentityContext;
  error?: string;
}

/**
 * AuthResult - Result of selectTenant or refreshToken
 */
export interface AuthResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  identityContext?: IdentityContext;
  error?: string;
}

/**
 * Realm - Tenant/Realm information from auth backend
 */
export interface Realm {
  realmId: string;
  realmName: string;
  displayName?: string;
  zoneId: string;
  realmType: string;
  description?: string;
  isActive: boolean;
}

/**
 * IdentityContext - User identity context (4D Identity Model)
 */
export interface IdentityContext {
  zone?: string;
  realm: string;
  subject: Subject;
  groups: string[];
}

/**
 * Subject - User identity information
 */
export interface Subject {
  accountId: string;
  userId?: string;
  username: string;
  email?: string;
  displayName?: string;
}

/**
 * GraphQL response wrapper (for GraphQL-based backends)
 */
export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}
