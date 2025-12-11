'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@assetforce/material';
import { useState } from 'react';

import { AccountStatusBadge } from '../../list/components/AccountStatusBadge';
import type { AccountDetail } from '../types';

/**
 * Format date for display
 * Uses YYYY/MM/DD HH:mm format
 */
function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date
    .toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(',', '');
}

/**
 * Info field component
 */
interface InfoFieldProps {
  label: string;
  value: React.ReactNode;
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body1" component="div" sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    </Box>
  );
}

export interface AccountInfoCardProps {
  account: AccountDetail;
  onVerifyEmail?: () => Promise<void>;
  verifyLoading?: boolean;
}

/**
 * AccountInfoCard - Display account basic information with verify email button
 *
 * @example
 * ```tsx
 * <AccountInfoCard
 *   account={account}
 *   onVerifyEmail={handleVerify}
 *   verifyLoading={loading}
 * />
 * ```
 */
export function AccountInfoCard({ account, onVerifyEmail, verifyLoading = false }: AccountInfoCardProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!onVerifyEmail) return;

    try {
      setError(null);
      setSuccess(null);
      await onVerifyEmail();
      setSuccess('Email verified successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify email');
    }
  };

  const canVerifyEmail = !account.emailVerified && !!onVerifyEmail;

  return (
    <Card>
      <CardHeader
        title="Account Information"
        action={
          canVerifyEmail && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleVerify}
              disabled={verifyLoading}
              startIcon={verifyLoading ? <CircularProgress size={20} /> : null}
            >
              {verifyLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          )
        }
      />
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Row 1 */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Box sx={{ flex: 1 }}>
              <InfoField
                label="Account ID:"
                value={<Typography sx={{ fontFamily: 'monospace' }}>{account.id}</Typography>}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <InfoField label="Username:" value={account.username} />
            </Box>
          </Stack>

          {/* Row 2 */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Box sx={{ flex: 1 }}>
              <InfoField label="Email:" value={account.email || 'N/A'} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Status:
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <AccountStatusBadge status={account.status as any} />
              </Box>
            </Box>
          </Stack>

          {/* Row 3 */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Email Verified:
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                {account.emailVerified ? (
                  <Chip label="Yes" color="success" size="small" />
                ) : (
                  <Chip label="No" color="warning" size="small" />
                )}
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <InfoField label="Created At:" value={formatDateTime(account.createdAt)} />
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
