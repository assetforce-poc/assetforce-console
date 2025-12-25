'use client';

import { Alert, Box, CircularProgress, Stack } from '@assetforce/material';

import { useAccountDetail, useResendActivation, useVerifyEmail } from '../hooks';
import { AccountAttributesCard } from './AccountAttributesCard';
import { AccountInfoCard } from './AccountInfoCard';
import { SessionHistoryCard } from './SessionHistoryCard';

export interface AccountDetailPageProps {
  accountId: string;
}

/**
 * AccountDetailPage - Complete account detail page component
 *
 * This is the main component for displaying account details.
 * It uses React hooks and must be a client component.
 */
export function AccountDetailPage({ accountId }: AccountDetailPageProps) {
  const { account, loading, error, refetch } = useAccountDetail(accountId);
  const { verifyEmail, loading: verifyLoading } = useVerifyEmail();
  const { resendActivation, loading: resendLoading } = useResendActivation();

  const handleVerifyEmail = async () => {
    const result = await verifyEmail(accountId);
    if (result.success) {
      await refetch(); // Refresh account data
    }
  };

  const handleResendActivation = async () => {
    const result = await resendActivation(accountId);
    if (result.success) {
      await refetch(); // Refresh account data
    }
    return result;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error.message || 'Failed to load account details'}</Alert>;
  }

  if (!account) {
    return <Alert severity="warning">Account not found</Alert>;
  }

  return (
    <Stack spacing={3}>
      {/* Account Information Card */}
      <AccountInfoCard
        account={account}
        onVerifyEmail={handleVerifyEmail}
        verifyLoading={verifyLoading}
        onResendActivation={handleResendActivation}
        resendLoading={resendLoading}
      />

      {/* Account Attributes Card */}
      <AccountAttributesCard attributes={account.attributes || []} />

      {/* Session History Card */}
      <SessionHistoryCard sessions={account.sessions || []} />
    </Stack>
  );
}
