'use client';

import { Chip } from '@assetforce/material';

import { AccountStatus } from '../types';

export interface AccountStatusBadgeProps {
  status: AccountStatus;
}

const STATUS_CONFIG: Record<AccountStatus, { label: string; color: 'success' | 'warning' | 'error' | 'default' }> = {
  [AccountStatus.ACTIVE]: {
    label: 'Active',
    color: 'success',
  },
  [AccountStatus.PENDING_VERIFICATION]: {
    label: 'Pending Verification',
    color: 'warning',
  },
  [AccountStatus.LOCKED]: {
    label: 'Locked',
    color: 'error',
  },
  [AccountStatus.SUSPENDED]: {
    label: 'Suspended',
    color: 'default',
  },
};

/**
 * AccountStatusBadge - Display account status as a colored badge
 *
 * @example
 * ```tsx
 * <AccountStatusBadge status={AccountStatus.ACTIVE} />
 * ```
 */
export function AccountStatusBadge({ status }: AccountStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      data-testid={`account-status-${status.toLowerCase()}`}
    />
  );
}
