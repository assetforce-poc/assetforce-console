'use client';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
  type PaperProps,
} from '@assetforce/material';

import type { TenantApplication } from '../../hooks/tenant/types';

export interface TenantApplicationListProps extends Omit<PaperProps, 'children'> {
  /** Title of the section */
  title?: string;
  /** List of pending applications */
  applications: TenantApplication[];
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string | null;
  /** Cancel button label */
  cancelLabel?: string;
  /** Cancel handler */
  onCancel?: (applicationId: string) => void;
  /** Whether cancel is disabled */
  cancelDisabled?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Date formatter */
  formatDate?: (date: string) => string;
}

/**
 * TenantApplicationList - Display list of pending tenant applications
 *
 * @example
 * <TenantApplicationList
 *   applications={pendingApplications}
 *   loading={isLoading}
 *   onCancel={(id) => handleCancel(id)}
 * />
 */
export function TenantApplicationList({
  title = 'Pending Applications',
  applications,
  loading = false,
  error,
  cancelLabel = 'Cancel',
  onCancel,
  cancelDisabled = false,
  emptyMessage = 'No pending applications.',
  formatDate,
  sx,
  ...props
}: TenantApplicationListProps) {
  const formatDateFn = formatDate || ((date: string) => date);

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
        {applications.length === 0 && !loading && (
          <Typography variant="body2" color="text.secondary">
            {emptyMessage}
          </Typography>
        )}

        {applications.map((application) => (
          <Paper key={application.id} variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="subtitle1" noWrap>
                  {application.tenant.displayName || application.tenant.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Submitted at {formatDateFn(application.createdAt)}
                </Typography>
                {application.message && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Message: {application.message}
                  </Typography>
                )}
              </Box>
              {onCancel && (
                <Button
                  variant="outlined"
                  onClick={() => onCancel(application.id)}
                  disabled={cancelDisabled}
                  sx={{ flexShrink: 0 }}
                >
                  {cancelLabel}
                </Button>
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}
