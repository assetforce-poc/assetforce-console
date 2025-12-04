/**
 * Tenant - Tenant information
 */
export interface Tenant {
  /** Tenant ID */
  id: string;
  /** Tenant name */
  name: string;
  /** Realm identifier */
  realm: string;
}

/**
 * TenantSelection - Tenant selection result
 */
export interface TenantSelection {
  /** Selected tenant */
  tenant: Tenant;
  /** Access token */
  accessToken: string;
  /** Refresh token */
  refreshToken: string;
  /** Expiration time in seconds */
  expiresIn: number;
}
