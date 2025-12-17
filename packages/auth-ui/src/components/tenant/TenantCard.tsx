'use client';

import { Box, Button, Paper, type PaperProps, Stack, Typography } from '@assetforce/material';
import type { ReactNode } from 'react';

import type { Tenant } from '../../hooks/tenant/types';

export interface TenantCardProps extends Omit<PaperProps, 'children'> {
  /** Tenant data */
  tenant: Tenant;
  /** Action button label */
  actionLabel?: string;
  /** Action button variant */
  actionVariant?: 'text' | 'outlined' | 'contained';
  /** Action button color */
  actionColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  /** Action click handler */
  onAction?: (tenant: Tenant) => void;
  /** Whether action is disabled */
  actionDisabled?: boolean;
  /** Additional content below tenant name */
  subtitle?: ReactNode;
  /** Additional content at the bottom */
  footer?: ReactNode;
}

/**
 * TenantCard - Display a single tenant with optional action button
 *
 * @example
 * <TenantCard
 *   tenant={tenant}
 *   actionLabel="Leave"
 *   actionColor="error"
 *   onAction={(t) => handleLeave(t.id)}
 * />
 */
export function TenantCard({
  tenant,
  actionLabel,
  actionVariant = 'outlined',
  actionColor = 'primary',
  onAction,
  actionDisabled = false,
  subtitle,
  footer,
  sx,
  ...props
}: TenantCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, ...sx }} {...props}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="subtitle1" noWrap>
            {tenant.displayName || tenant.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {tenant.id}
          </Typography>
          {subtitle}
        </Box>
        {actionLabel && onAction && (
          <Button
            variant={actionVariant}
            color={actionColor}
            onClick={() => onAction(tenant)}
            disabled={actionDisabled}
            sx={{ flexShrink: 0 }}
          >
            {actionLabel}
          </Button>
        )}
      </Stack>
      {footer}
    </Paper>
  );
}
