import type { IdentityContext } from './identity';
import type { Tenant } from './tenant';
import type { User } from './user';

/**
 * SessionData - Data stored in iron-session cookie
 *
 * This is the encrypted session payload stored in the browser cookie.
 * iron-session handles encryption/decryption automatically.
 */
export interface SessionData {
  /** AAC access token */
  accessToken?: string;
  /** AAC refresh token */
  refreshToken?: string;
  /** Token expiration timestamp (ms) */
  expiresAt?: number;
  /** User information */
  user?: User;
  /** 4D Identity context */
  identity?: IdentityContext;
  /** Current tenant */
  tenant?: Tenant;
  /** Available tenants (for multi-tenant selection) */
  availableTenants?: Tenant[];
  /** Whether user needs to select a tenant */
  pendingTenantSelection?: boolean;
}

/**
 * Session - Session information (client-safe version)
 *
 * This is the session data exposed to client components.
 * Tokens are NOT included for security.
 */
export interface Session {
  /** Whether session is valid */
  isValid: boolean;
  /** Expiration time */
  expiresAt: Date;
  /** User information */
  user: User | null;
  /** 4D Identity context */
  identity: IdentityContext | null;
  /** Current tenant */
  tenant: Tenant | null;
}
