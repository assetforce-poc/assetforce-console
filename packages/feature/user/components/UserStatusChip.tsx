'use client';

import { Chip, type ChipProps } from '@assetforce/material';

import type { UserStatus } from '../types';

interface UserStatusChipProps {
  status: UserStatus;
  size?: ChipProps['size'];
}

const statusConfig: Record<UserStatus, { label: string; color: ChipProps['color'] }> = {
  ACTIVE: { label: 'Active', color: 'success' },
  INACTIVE: { label: 'Inactive', color: 'default' },
  SUSPENDED: { label: 'Suspended', color: 'warning' },
  ARCHIVED: { label: 'Archived', color: 'error' },
};

export const UserStatusChip = ({ status, size = 'small' }: UserStatusChipProps) => {
  const config = statusConfig[status] ?? { label: status, color: 'default' as const };
  return <Chip label={config.label} color={config.color} size={size} />;
};
