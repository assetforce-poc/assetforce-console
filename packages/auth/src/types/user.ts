/**
 * User - Basic user information
 */
export interface User {
  /** User ID */
  id: string;
  /** Email address */
  email?: string;
  /** Username */
  name?: string;
  /** Avatar URL */
  image?: string;
  /** Whether email is verified */
  emailVerified: boolean;
  /** Creation time */
  createdAt: Date;
  /** Last update time */
  updatedAt: Date;
}
