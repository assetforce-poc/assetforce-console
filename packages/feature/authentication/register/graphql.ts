import { gql } from '@assetforce/graphql';

/**
 * Check if email is available for registration (new namespace API)
 */
export const CHECK_EMAIL_AVAILABILITY = gql`
  query CheckEmailAvailability($email: String!) {
    registration {
      email(address: $email) {
        available
        reason
      }
    }
  }
`;

/**
 * Register a new user account (new namespace API)
 */
export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    registration {
      register(input: $input) {
        success
        accountId
        message
        requiresVerification
        appliedTenant
      }
    }
  }
`;

/**
 * Verify email using verification token (new namespace API)
 */
export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmailForRegistration($token: String!) {
    registration {
      verifyEmail(token: $token) {
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
  }
`;
