'use client';

import { useMutation } from '@assetforce/graphql';
import { useCallback } from 'react';

import { VerifyEmailByAdminDocument as VERIFY_EMAIL_MUTATION } from '../../generated/graphql';
import type { VerifyEmailResult } from '../types';

// Export for testing
export { VERIFY_EMAIL_MUTATION as VERIFY_EMAIL_BY_ADMIN_MUTATION };

export interface UseVerifyEmailReturn {
  /** Execute email verification */
  verifyEmail: (accountId: string) => Promise<VerifyEmailResult>;
  /** Loading state */
  loading: boolean;
  /** Error if any */
  error: Error | undefined;
}

/**
 * useVerifyEmail Hook - Manually verify account email by admin
 *
 * Provides mutation to verify account email in development environment
 * where email verification links are not sent.
 *
 * @example
 * ```tsx
 * const { verifyEmail, loading, error } = useVerifyEmail();
 *
 * const handleVerify = async () => {
 *   try {
 *     const result = await verifyEmail('account-id');
 *     if (result.success) {
 *       showSuccess('Email verified successfully');
 *       refetch(); // Refetch account detail
 *     }
 *   } catch (err) {
 *     showError('Failed to verify email');
 *   }
 * };
 * ```
 */
export function useVerifyEmail(): UseVerifyEmailReturn {
  const [mutate, { loading, error }] = useMutation(VERIFY_EMAIL_MUTATION);

  const verifyEmail = useCallback(
    async (accountId: string): Promise<VerifyEmailResult> => {
      const result = await mutate({
        variables: { accountId },
      });

      if (!result.data?.verifyEmailByAdmin) {
        throw new Error('Verification failed: No response from server');
      }

      return result.data.verifyEmailByAdmin;
    },
    [mutate]
  );

  return {
    verifyEmail,
    loading,
    error,
  };
}
