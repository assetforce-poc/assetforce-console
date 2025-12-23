/**
 * Tenant Invite Types
 * Task 051: Tenant Invitation - Invite Acceptance Flow
 *
 * Types are generated from IMC GraphQL schema via codegen.
 * Frontend-specific types (UI state, hook return types) are defined here.
 */

// ===== Re-export Generated Types =====
export type {
  Invite,
  InviteStatus,
  InviteError,
  InviteErrorCode,
  InviteSendInput,
  InvitesInput,
  InviteValidationResult,
  InviteAcceptResult,
  InviteSendResult,
  InviteCancelResult,
  InviteResendResult,
  InviteConnection,
  Membership,
  TenantInfo,
  AuthRequirement,
  EmailMatchInfo,
} from '../generated/graphql.js';

// ===== Hook Return Types (Frontend-specific) =====

export interface UseValidateInviteOptions {
  token: string | null;
  skip?: boolean;
}

export interface UseValidateInviteResult {
  loading: boolean;
  error: Error | null;
  data: import('../generated/graphql.js').InviteValidationResult | null;
  refetch: () => Promise<void>;
}

export interface UseAcceptInviteResult {
  accept: (token: string) => Promise<import('../generated/graphql.js').InviteAcceptResult>;
  loading: boolean;
  error: Error | null;
}

export interface UseSendInviteResult {
  send: (input: import('../generated/graphql.js').InviteSendInput) => Promise<import('../generated/graphql.js').InviteSendResult>;
  loading: boolean;
  error: Error | null;
}

// ===== UI State Types (Frontend-specific) =====

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
  invite?: import('../generated/graphql.js').Invite;
  error?: import('../generated/graphql.js').InviteError;
  auth: import('../generated/graphql.js').AuthRequirement;
  email?: import('../generated/graphql.js').EmailMatchInfo;
}
