/**
 * IdentityContext - Four-dimensional identity model (AssetForce extension)
 *
 * Identity context based on AAC, containing zone, realm, subject and groups information
 */
export interface IdentityContext {
  /** Zone (optional) */
  zone?: string;
  /** Realm/Tenant */
  realm: string;
  /** Subject information */
  subject: {
    /** Account ID */
    accountId: string;
    /** User ID (optional) */
    userId?: string;
    /** Username */
    username: string;
    /** Email (optional) */
    email?: string;
    /** Display name (optional) */
    displayName?: string;
  };
  /** Group memberships */
  groups: string[];
}
