/**
 * AuthConfig - Authentication configuration
 */
export interface AuthConfig {
  /** AAC GraphQL endpoint */
  aacEndpoint: string;
  /** Application URL (for callbacks) */
  appUrl?: string;
  /** Session configuration */
  session?: {
    /** Strategy type: jwt (stateless) or database (stateful) */
    strategy?: 'jwt' | 'database';
    /** Session expiration time in seconds */
    expiresIn?: number;
    /** Session refresh window in seconds */
    updateAge?: number;
  };
}
