/**
 * Register Feature Types
 * Matches AAC GraphQL schema (Task 033)
 */

// ============ Input Types ============

export interface RegisterInput {
  /** User's email address */
  email: string;
  /** Password */
  password: string;
  /** First name */
  firstName: string;
  /** Last name */
  lastName: string;
  /** Must accept terms of service */
  acceptTerms: boolean;
  /** Optional: Username (if not provided, email will be used) */
  username?: string;
  /** Optional: Realm/Tenant to apply for */
  realm?: string;
  /** Optional: Preferred locale */
  locale?: string;
}

// ============ Response Types ============

export interface EmailAvailability {
  /** Whether the email is available for registration */
  available: boolean;
  /** Reason if not available: EMAIL_ALREADY_EXISTS, INVALID_FORMAT, etc. */
  reason?: string;
}

export interface RegisterResult {
  /** Whether registration was successful */
  success: boolean;
  /** Keycloak User ID (account ID) */
  accountId?: string;
  /** Success message or error details */
  message?: string;
  /** Always true for email-based registration */
  requiresVerification: boolean;
  /** If realm provided: the tenant applied to */
  appliedTenant?: string;
  /** Email used for registration (client-side, not from server) */
  email?: string;
}

export interface TenantStatus {
  /** Has any tenant roles */
  hasTenants: boolean;
  /** No tenants → need to apply */
  requiresTenantSelection: boolean;
  /** Has tenants but all pending approval */
  pendingApproval: boolean;
  /** List of active tenant IDs */
  activeTenants: string[];
}

export interface EmailVerificationResult {
  /** Whether verification was successful */
  success: boolean;
  /** Message or error details */
  message?: string;
  /** Account ID if successful */
  accountId?: string;
  /** User's tenant membership status */
  tenantStatus?: TenantStatus;
}

// ============ Error Codes ============

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
