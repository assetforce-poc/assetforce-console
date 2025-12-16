/**
 * Tenant Membership Types
 */

export type Tenant = {
  id: string;
  name: string;
  displayName?: string | null;
};

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export type TenantApplication = {
  id: string;
  tenant: Tenant;
  status: ApplicationStatus;
  message?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TenantConnection = {
  items: Tenant[];
  total: number;
  hasMore: boolean;
};

export type CooldownStatus = {
  canApply: boolean;
  until?: string | null;
  reason?: string | null;
};

export type ApplyResult = {
  success: boolean;
  message?: string | null;
  application?: TenantApplication | null;
};

export type MutationResult = {
  success: boolean;
  message?: string | null;
};
