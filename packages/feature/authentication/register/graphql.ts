import { gql } from '@assetforce/graphql';

/**
 * Check if email is available for registration
 */
export const CHECK_EMAIL_AVAILABILITY = gql`
  query CheckEmailAvailability($email: String!) {
    checkEmailAvailability(email: $email) {
      available
      reason
    }
  }
`;

/**
 * Register a new user account
 */
export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      success
      accountId
      message
      requiresVerification
      appliedTenant
    }
  }
`;

/**
 * Verify email using verification token
 */
export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmailForRegistration($token: String!) {
    verifyEmailForRegistration(token: $token) {
      success
      message
      accountId
      tenantStatus {
        hasTenants
        requiresTenantSelection
        pendingApproval
        activeTenants
      }
    }
  }
`;
