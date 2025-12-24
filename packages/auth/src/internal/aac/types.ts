// Import generated types from GraphQL codegen
import type {
  AuthResult,
  IdentityContext as GraphQLIdentityContext,
  LoginResult,
  Subject as GraphQLSubject,
  Tenant,
} from '@assetforce/authentication/generated/graphql';

/**
 * Re-export generated types for internal use
 * These types are generated from the GraphQL schema - don't duplicate them manually
 */
export type { AuthResult, LoginResult, Tenant };

/** Realm is an alias for Tenant (backward compatibility) */
export type Realm = Tenant;

/** IdentityContext from GraphQL schema */
export type IdentityContext = GraphQLIdentityContext;

/** Subject from GraphQL schema */
export type Subject = GraphQLSubject;

/**
 * AuthClient Interface
 *
 * Abstract interface for authentication backends.
 * Implementations can be swapped without changing upper layers.
 */
export interface AuthClient {
  /** Authenticate with username and password */
  authenticate(username: string, password: string): Promise<LoginResult>;
  /** Select tenant after authentication (for multi-tenant scenarios) */
  selectTenant(subject: string, realmId: string, accessToken: string): Promise<AuthResult>;
  /** Refresh access token */
  refreshToken(refreshToken: string): Promise<AuthResult>;
  /** Logout current session */
  logout(accessToken: string): Promise<boolean>;
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
