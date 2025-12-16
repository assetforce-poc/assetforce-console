'use client';

import {
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
  type PaperProps,
} from '@assetforce/material';

import type { Tenant } from '../../hooks/tenant/types';
import { TenantCard } from './TenantCard';

export interface TenantMembershipListProps extends Omit<PaperProps, 'children'> {
  /** Title of the section */
  title?: string;
  /** List of joined tenants */
  tenants: Tenant[];
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string | null;
  /** Leave button label */
  leaveLabel?: string;
  /** Leave handler */
  onLeave?: (tenantId: string) => void;
  /** Whether leave is disabled */
  leaveDisabled?: boolean;
  /** Empty state message */
  emptyMessage?: string;
}

/**
 * TenantMembershipList - Display list of joined tenants with leave option
 *
 * @example
 * <TenantMembershipList
 *   tenants={myTenants}
 *   loading={isLoading}
 *   onLeave={(id) => handleLeave(id)}
 * />
 */
export function TenantMembershipList({
  title = 'My Organizations',
  tenants,
  loading = false,
  error,
  leaveLabel = 'Leave',
  onLeave,
  leaveDisabled = false,
  emptyMessage = 'No organizations yet.',
  sx,
  ...props
}: TenantMembershipListProps) {
  return (
    <Paper variant="outlined" sx={{ p: 3, ...sx }} {...props}>
      <Typography variant="h6">{title}</Typography>
      <Divider sx={{ my: 2 }} />

      {loading && (
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress size={18} />
          <Typography variant="body2" color="text.secondary">
            Loading...
          </Typography>
        </Stack>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      <Stack spacing={1}>
        {tenants.length === 0 && !loading && (
          <Typography variant="body2" color="text.secondary">
            {emptyMessage}
          </Typography>
        )}

        {tenants.map((tenant) => (
          <TenantCard
            key={tenant.id}
            tenant={tenant}
            actionLabel={onLeave ? leaveLabel : undefined}
            actionColor="error"
            onAction={onLeave ? (t) => onLeave(t.id) : undefined}
            actionDisabled={leaveDisabled}
          />
        ))}
      </Stack>
    </Paper>
  );
}
