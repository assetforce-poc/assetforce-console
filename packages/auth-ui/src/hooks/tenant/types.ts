/**
 * Tenant Membership Types
 */

export interface Tenant {
  id: string;
  name: string;
  displayName?: string | null;
}

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface TenantApplication {
  id: string;
  tenant: Tenant;
  status: ApplicationStatus;
  message?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TenantConnection {
  items: Tenant[];
  total: number;
  hasMore: boolean;
}

export interface CooldownStatus {
  canApply: boolean;
  until?: string | null;
  reason?: string | null;
}

export interface ApplyResult {
  success: boolean;
  message?: string | null;
  application?: TenantApplication | null;
}

export interface MutationResult {
  success: boolean;
  message?: string | null;
}
