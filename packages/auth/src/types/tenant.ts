/**
 * Tenant - Tenant information
 *
 * In AAC, Realm is the logical tenant managed by IMC.
 * The realmId serves as the tenant identifier.
 */
export interface Tenant {
  /** Tenant ID (realmId from AAC) */
  id: string;
  /** Display name */
  name: string;
  /** Zone ID */
  zoneId?: string;
  /** Realm type */
  realmType?: string;
  /** Description */
  description?: string;
}
