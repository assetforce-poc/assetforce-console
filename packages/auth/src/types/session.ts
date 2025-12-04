/**
 * Session - Session information
 */
export interface Session {
  /** Session ID */
  id: string;
  /** User ID */
  userId: string;
  /** Expiration time */
  expiresAt: Date;
  /** Creation time */
  createdAt: Date;
  /** Last update time */
  updatedAt: Date;
}
