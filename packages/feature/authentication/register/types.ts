/**
 * Register Feature Types
 * All types derived from generated GraphQL schema (Task 033)
 */

import type {
  EmailStatus as GqlEmailStatus,
  EmailVerificationResult as GqlEmailVerificationResult,
  RegisterInput as GqlRegisterInput,
  RegisterResult as GqlRegisterResult,
  TenantStatus as GqlTenantStatus,
} from '../generated/graphql';

// ============ Type Aliases from GraphQL ============

/**
 * Registration input data
 * Directly from GraphQL schema
 */
export type RegisterInput = GqlRegisterInput;

/**
 * Registration result with client-side extension
 * Extends GraphQL type to include email for client convenience
 */
export type RegisterResult = GqlRegisterResult & {
  /** Email used for registration (client-side only, not from server) */
  email?: string;
};

/**
 * Email availability status (new namespace API)
 * Directly from GraphQL schema
 */
export type EmailStatus = GqlEmailStatus;

/**
 * @deprecated Use EmailStatus instead. Will be removed in v2.0.0
 */
export type EmailAvailability = EmailStatus;

/**
 * Tenant status information
 * Directly from GraphQL schema
 */
export type TenantStatus = GqlTenantStatus;

/**
 * Email verification result
 * Directly from GraphQL schema
 */
export type EmailVerificationResult = GqlEmailVerificationResult;

// ============ Error Codes (Not in GraphQL Schema) ============

export const RegisterErrorCodes = {
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  USERNAME_TAKEN: 'USERNAME_TAKEN',
  PASSWORD_POLICY_VIOLATION: 'PASSWORD_POLICY_VIOLATION',
  INVALID_EMAIL_FORMAT: 'INVALID_EMAIL_FORMAT',
  INVALID_NAME_FORMAT: 'INVALID_NAME_FORMAT',
  TERMS_NOT_ACCEPTED: 'TERMS_NOT_ACCEPTED',
} as const;

export const VerificationErrorCodes = {
  VERIFICATION_COMPLETE: 'VERIFICATION_COMPLETE',
  ALREADY_VERIFIED: 'ALREADY_VERIFIED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_NOT_FOUND: 'TOKEN_NOT_FOUND',
  INVALID_TOKEN_FORMAT: 'INVALID_TOKEN_FORMAT',
} as const;
