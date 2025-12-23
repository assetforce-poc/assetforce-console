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

// ===== Tenant List/Detail Operations =====

/**
 * List all tenants.
 */
export const LIST_TENANTS = gql`
  query ListTenants {
    tenant {
      list {
        id
        name
        displayName
        type
        description
        isActive
      }
    }
  }
`;

/**
 * Get a single tenant by ID.
 */
export const GET_TENANT = gql`
  query GetTenant($id: String!) {
    tenant {
      one(id: $id) {
        id
        name
        displayName
        type
        description
        isActive
      }
    }
  }
`;

// ===== Admin Operations (Task 051) =====

/**
 * List tenant invites (admin only).
 */
export const LIST_INVITES = gql`
  query ListInvites($input: InvitesInput!) {
    tenant {
      invites(input: $input) {
        items {
          id
          tenantId
          tenantName
          invitedEmail
          inviterEmail
          role
          status
          message
          expiresAt
          createdAt
          updatedAt
        }
        total
        hasMore
      }
    }
  }
`;

/**
 * Send a new invitation (admin only).
 */
export const SEND_INVITE = gql`
  mutation SendInvite($input: InviteSendInput!) {
    tenant {
      invite {
        send(input: $input) {
          success
          invite {
            id
            tenantId
            tenantName
            invitedEmail
            role
            expiresAt
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

/**
 * Cancel a pending invite (admin only).
 */
export const CANCEL_INVITE = gql`
  mutation CancelInvite($id: String!) {
    tenant {
      invite {
        cancel(id: $id) {
          success
          error {
            code
            message
          }
        }
      }
    }
  }
`;

/**
 * Resend an invite (admin only) - cancels old, creates new.
 */
export const RESEND_INVITE = gql`
  mutation ResendInvite($id: String!) {
    tenant {
      invite {
        resend(id: $id) {
          success
          cancelled {
            id
            status
          }
          created {
            id
            tenantId
            tenantName
            invitedEmail
            role
            expiresAt
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

// ===== Admin Response Types =====

export interface InviteItem {
  id: string;
  tenantId: string;
  tenantName: string;
  invitedEmail: string;
  inviterEmail?: string;
  role?: string;
  status: string;
  message?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListInvitesResponse {
  tenant: {
    invites: {
      items: InviteItem[];
      total: number;
      hasMore: boolean;
    };
  };
}

export interface ListInvitesVariables {
  input: {
    tenantId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  };
}

export interface SendInviteResponse {
  tenant: {
    invite: {
      send: {
        success: boolean;
        invite?: {
          id: string;
          tenantId: string;
          tenantName: string;
          invitedEmail: string;
          role?: string;
          expiresAt: string;
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

export interface SendInviteVariables {
  input: {
    tenantId: string;
    email: string;
    role?: string;
    message?: string;
    expiryDays?: number;
  };
}

export interface CancelInviteResponse {
  tenant: {
    invite: {
      cancel: {
        success: boolean;
        error?: {
          code: string;
          message: string;
        };
      };
    };
  };
}

export interface CancelInviteVariables {
  id: string;
}

export interface ResendInviteResponse {
  tenant: {
    invite: {
      resend: {
        success: boolean;
        cancelled?: {
          id: string;
          status: string;
        };
        created?: {
          id: string;
          tenantId: string;
          tenantName: string;
          invitedEmail: string;
          role?: string;
          expiresAt: string;
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

export interface ResendInviteVariables {
  id: string;
}

// ===== Tenant Types =====

export interface TenantItem {
  id: string;
  name: string;
  displayName?: string;
  type: string;
  description?: string;
  isActive: boolean;
}

export interface ListTenantsResponse {
  tenant: {
    list: TenantItem[];
  };
}

export interface GetTenantResponse {
  tenant: {
    one: TenantItem | null;
  };
}

export interface GetTenantVariables {
  id: string;
}
