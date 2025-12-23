/**
 * Tenant Invite Types
 * Task 051: Tenant Invitation - Invite Acceptance Flow
 */

// ===== Enums =====

export enum InviteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum InviteErrorCode {
  // Token errors
  INVALID_TOKEN = 'INVALID_TOKEN',
  EXPIRED = 'EXPIRED',
  ALREADY_ACCEPTED = 'ALREADY_ACCEPTED',
  ALREADY_CANCELLED = 'ALREADY_CANCELLED',

  // User state errors
  EMAIL_MISMATCH = 'EMAIL_MISMATCH',
  ALREADY_MEMBER = 'ALREADY_MEMBER',
  ACCOUNT_INACTIVE = 'ACCOUNT_INACTIVE',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',

  // Tenant errors
  TENANT_UNAVAILABLE = 'TENANT_UNAVAILABLE',
  TENANT_NOT_FOUND = 'TENANT_NOT_FOUND',

  // Auth errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',

  // Rate limiting
  RATE_LIMITED = 'RATE_LIMITED',
  DUPLICATE_PENDING = 'DUPLICATE_PENDING',
}

// ===== Types =====

export interface TenantInfo {
  id: string;
  name: string;
}

export interface Invite {
  id: string;
  tenantId: string;
  tenantName: string;
  invitedEmail: string;
  inviterEmail?: string;
  role?: string;
  message?: string;
  status: InviteStatus;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthRequirement {
  /** True if user must authenticate before accepting */
  required: boolean;
}

export interface EmailMatchInfo {
  /** Whether current user's email matches invited email */
  match: boolean;
  /** The email address the invite was sent to */
  invited: string;
  /** Current logged-in user's email (null if not logged in) */
  current?: string;
}

export interface InviteError {
  code: InviteErrorCode;
  message: string;
}

export interface InviteValidationResult {
  valid: boolean;
  invite?: Invite;
  error?: InviteError;
  auth: AuthRequirement;
  email?: EmailMatchInfo;
}

export interface Membership {
  tenant: TenantInfo;
  role: string;
  createdAt: string;
}

export interface InviteAcceptResult {
  success: boolean;
  membership?: Membership;
  error?: InviteError;
}

// ===== Input Types =====

export interface InviteSendInput {
  tenantId: string;  // Target tenant to invite user to (required)
  email: string;
  role?: string;
  message?: string;
  expiryDays?: number;
}

// ===== Hook Return Types =====

export interface UseValidateInviteOptions {
  token: string | null;
  skip?: boolean;
}

export interface UseValidateInviteResult {
  loading: boolean;
  error: Error | null;
  data: InviteValidationResult | null;
  refetch: () => Promise<void>;
}

export interface UseAcceptInviteResult {
  accept: (token: string) => Promise<InviteAcceptResult>;
  loading: boolean;
  error: Error | null;
}

// ===== UI State Types =====

export type InvitePageState =
  | 'loading'
  | 'invalid'
  | 'expired'
  | 'login-required'
  | 'email-mismatch'
  | 'accept-ready'
  | 'accepting'
  | 'success'
  | 'error';

export interface InvitePageContext {
  state: InvitePageState;
  token: string | null;
  invite?: Invite;
  error?: InviteError;
  auth: AuthRequirement;
  email?: EmailMatchInfo;
}
