/**
 * Tenant Invite Types
 * Task 051: Tenant Invitation - Invite Acceptance Flow
 *
 * Types are generated from IMC GraphQL schema via codegen.
 * Frontend-specific types (UI state, hook return types) are defined here.
 */

// ===== Re-export Generated Types =====
export type {
  AuthRequirement,
  EmailMatchInfo,
  Invite,
  InviteAcceptResult,
  InviteCancelResult,
  InviteConnection,
  InviteError,
  InviteResendResult,
  InviteSendInput,
  InviteSendResult,
  InvitesInput,
  InviteStatus,
  InviteValidationResult,
  Membership,
  TenantInfo,
} from '../generated/graphql';
export { InviteErrorCode } from '../generated/graphql';

// ===== Hook Return Types (Frontend-specific) =====

export interface UseValidateInviteOptions {
  token: string | null;
  skip?: boolean;
}

export interface UseValidateInviteResult {
  loading: boolean;
  error: Error | null;
  data: import('../generated/graphql').InviteValidationResult | null;
  refetch: () => Promise<void>;
}

export interface UseAcceptInviteResult {
  accept: (token: string) => Promise<import('../generated/graphql').InviteAcceptResult>;
  loading: boolean;
  error: Error | null;
}

export interface UseSendInviteResult {
  send: (
    input: import('../generated/graphql').InviteSendInput
  ) => Promise<import('../generated/graphql').InviteSendResult>;
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
  invite?: import('../generated/graphql').Invite;
  error?: import('../generated/graphql').InviteError;
  auth: import('../generated/graphql').AuthRequirement;
  email?: import('../generated/graphql').EmailMatchInfo;
}
