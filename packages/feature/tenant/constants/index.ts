/**
 * Tenant Invite Constants
 * Task 051: Tenant Invitation - Invite Acceptance Flow
 */

/** Session storage key for preserving invite token across login redirect */
export const PENDING_INVITE_TOKEN_KEY = 'pendingInviteToken';

/** Invite page path */
export const INVITE_PAGE_PATH = '/tenant/invite';

/** Login page path */
export const LOGIN_PAGE_PATH = '/auth/login';

/** Default redirect after successful invite acceptance */
export const DEFAULT_SUCCESS_REDIRECT = '/';

/** GraphQL operation names */
export const GQL_OPERATIONS = {
  VALIDATE_INVITE: 'ValidateInvite',
  ACCEPT_INVITE: 'AcceptInvite',
} as const;

/** Error messages for display */
export const ERROR_MESSAGES: Record<string, string> = {
  INVALID_TOKEN: 'This invite link is invalid. Please contact the administrator for a new invite.',
  EXPIRED: 'This invite has expired. Please contact the administrator for a new invite.',
  ALREADY_ACCEPTED: 'This invite has already been used.',
  ALREADY_CANCELLED: 'This invite has been cancelled. Please contact the administrator for a new invite.',
  EMAIL_MISMATCH: 'This invite was sent to a different email address.',
  ALREADY_MEMBER: 'You are already a member of this organization.',
  ACCOUNT_INACTIVE: 'Your account is inactive. Please contact support.',
  EMAIL_NOT_VERIFIED: 'Please verify your email address before accepting this invite.',
  TENANT_UNAVAILABLE: 'This organization is no longer available.',
  TENANT_NOT_FOUND: 'Organization not found.',
  UNAUTHORIZED: 'You need to log in to accept this invite.',
  FORBIDDEN: 'You do not have permission to accept this invite.',
  RATE_LIMITED: 'Too many requests. Please try again later.',
  DUPLICATE_PENDING: 'You already have a pending invite for this organization.',
  DEFAULT: 'An error occurred. Please try again.',
};

/** Get user-friendly error message */
export const getErrorMessage = (code: string): string => {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.DEFAULT;
};
