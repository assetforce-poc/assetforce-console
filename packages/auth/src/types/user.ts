/**
 * User - Basic user information
 *
 * Minimal user info from AAC IdentityContext.
 * Additional fields may be populated from other sources.
 */
export interface User {
  /** User ID (accountId from AAC) */
  id: string;
  /** Display name or username */
  name?: string;
  /** Email address */
  email?: string;
  /** Avatar URL */
  image?: string;
}
