import type { GetAccountDetailQuery, VerifyEmailByAdminMutation } from '../generated/graphql';

/**
 * Type aliases extracted from generated GraphQL types
 *
 * These provide cleaner, more readable type names while maintaining type safety.
 * All types are derived from the GraphQL schema, ensuring consistency with the backend.
 */

/**
 * Account detail with extended information including attributes and sessions
 * Extracted from GetAccountDetailQuery
 */
export type AccountDetail = NonNullable<GetAccountDetailQuery['account']['one']>;

/**
 * Key-value attribute entry from Keycloak user attributes
 * Sensitive values are masked (e.g., emailVerificationToken → "abc12345***")
 */
export type AccountAttribute = AccountDetail['attributes'][number];

/**
 * User session information from Keycloak
 * Contains IP, user agent, and timestamp information
 */
export type AccountSession = AccountDetail['sessions'][number];

/**
 * Result of verifyEmailByAdmin mutation
 */
export type VerifyEmailResult = NonNullable<VerifyEmailByAdminMutation['verifyEmailByAdmin']>;
