'use client';

import { useMutation } from '@assetforce/graphql';
import { useCallback } from 'react';

import type { SendActivationResult } from '../../generated/graphql';
import { ResendActivationDocument as RESEND_ACTIVATION_MUTATION } from '../../generated/graphql';

// Export for testing
export { RESEND_ACTIVATION_MUTATION };

export interface UseResendActivationReturn {
  /** Execute resend activation email */
  resendActivation: (accountId: string) => Promise<SendActivationResult>;
  /** Loading state */
  loading: boolean;
  /** Error if any */
  error: Error | undefined;
}

/**
 * useResendActivation Hook - Resend activation email to pending account
 *
 * Provides mutation to resend activation email to accounts with PENDING_VERIFICATION status.
 * Admin operation - requires admin privileges.
 *
 * @example
 * ```tsx
 * const { resendActivation, loading, error } = useResendActivation();
 *
 * const handleResend = async () => {
 *   try {
 *     const result = await resendActivation('account-id');
 *     if (result.success) {
 *       showSuccess('Activation email sent successfully');
 *     } else {
 *       showError(result.error?.message || 'Failed to send activation email');
 *     }
 *   } catch (err) {
 *     showError('Failed to send activation email');
 *   }
 * };
 * ```
 */
export function useResendActivation(): UseResendActivationReturn {
  const [mutate, { loading, error }] = useMutation(RESEND_ACTIVATION_MUTATION);

  const resendActivation = useCallback(
    async (accountId: string): Promise<SendActivationResult> => {
      const result = await mutate({
        variables: { accountId },
      });

      if (!result.data?.account?.activation?.resend) {
        throw new Error('Resend activation failed: No response from server');
      }

      return result.data.account.activation.resend;
    },
    [mutate]
  );

  return {
    resendActivation,
    loading,
    error,
  };
}
