/**
 * GraphQL Operations for Tenant Invite
 * Task 051: Tenant Invitation - Invite Acceptance Flow
 *
 * These operations are designed to work with the IMC (Identity Management Center) backend.
 * The IMC provides the GraphQL API at the `tenant` namespace.
 */

import { gql } from '@apollo/client';

/**
 * Validate an invite token.
 * Works for both authenticated and anonymous users.
 */
export const VALIDATE_INVITE = gql`
  query ValidateInvite($token: String!) {
    tenant {
      invite(token: $token) {
        valid
        invite {
          id
          tenantId
          tenantName
          invitedEmail
          inviterEmail
          role
          message
          status
          expiresAt
          createdAt
          updatedAt
        }
        error {
          code
          message
        }
        auth {
          required
        }
        email {
          match
          invited
          current
        }
      }
    }
  }
`;

/**
 * Accept an invite to join a tenant.
 * Requires authentication. Subject must match invitedEmail.
 */
export const ACCEPT_INVITE = gql`
  mutation AcceptInvite($token: String!) {
    tenant {
      invite {
        accept(token: $token) {
          success
          membership {
            subject
            tenant {
              id
              name
            }
            role
            createdAt
          }
          error {
            code
            message
          }
        }
      }
    }
  }
`;

// ===== Response Types =====

export interface ValidateInviteResponse {
  tenant: {
    invite: {
      valid: boolean;
      invite?: {
        id: string;
        tenantId: string;
        tenantName: string;
        invitedEmail: string;
        inviterEmail?: string;
        role?: string;
        message?: string;
        status: string;
        expiresAt: string;
        createdAt: string;
        updatedAt: string;
      };
      error?: {
        code: string;
        message: string;
      };
      auth: {
        required: boolean;
      };
      email?: {
        match: boolean;
        invited: string;
        current?: string;
      };
    };
  };
}

export interface AcceptInviteResponse {
  tenant: {
    invite: {
      accept: {
        success: boolean;
        membership?: {
          subject: string;
          tenant: {
            id: string;
            name: string;
          };
          role: string;
          createdAt: string;
        };
        error?: {
          code: string;
          message: string;
        };
      };
    };
  };
}

export interface ValidateInviteVariables {
  token: string;
}

export interface AcceptInviteVariables {
  token: string;
}
