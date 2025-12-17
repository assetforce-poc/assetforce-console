'use client';

import { Chip } from '@assetforce/material';

import type { HealthStatus } from '../types';

const STATUS_CONFIG: Record<string, { label: string; color: 'success' | 'error' | 'warning' | 'default' }> = {
  UP: { label: 'UP', color: 'success' },
  DOWN: { label: 'DOWN', color: 'error' },
  UNKNOWN: { label: 'UNKNOWN', color: 'default' },
};

export interface ServiceStatusBadgeProps {
  /** Health status */
  status: HealthStatus | string;
  /** Size of the badge */
  size?: 'small' | 'medium';
}

/**
 * ServiceStatusBadge - Display health status as a colored chip
 *
 * @example
 * ```tsx
 * <ServiceStatusBadge status="UP" />
 * <ServiceStatusBadge status="DOWN" size="small" />
 * ```
 */
export function ServiceStatusBadge({ status, size = 'small' }: ServiceStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, color: 'default' as const };

  return <Chip label={config.label} color={config.color} size={size} />;
}
