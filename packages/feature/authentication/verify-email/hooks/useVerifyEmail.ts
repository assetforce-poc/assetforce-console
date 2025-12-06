'use client';

import { useMutation } from '@assetforce/graphql';
import { useCallback } from 'react';

import { VERIFY_EMAIL_MUTATION } from '../../register/graphql';
import type { EmailVerificationResult } from '../types';

export interface UseVerifyEmailReturn {
  /** Execute email verification */
  verify: (token: string) => Promise<EmailVerificationResult>;
  /** Loading state */
  loading: boolean;
}

/**
 * useVerifyEmail Hook - Verify email using token from verification email
 *
 * @example
 * ```tsx
 * const { verify, loading } = useVerifyEmail();
 *
 * useEffect(() => {
 *   const token = searchParams.get('token');
 *   if (token) {
 *     verify(token).then((result) => {
 *       if (result.success) {
 *         if (result.tenantStatus?.requiresTenantSelection) {
 *           router.push('/auth/select-tenant');
 *         } else {
 *           router.push('/auth/login?verified=true');
 *         }
 *       } else {
 *         setError(result.message || 'Verification failed');
 *       }
 *     });
 *   }
 * }, []);
 * ```
 */
export function useVerifyEmail(): UseVerifyEmailReturn {
  const [verifyMutation, { loading }] = useMutation<
    { verifyEmailForRegistration: EmailVerificationResult },
    { token: string }
  >(VERIFY_EMAIL_MUTATION);

  const verify = useCallback(
    async (token: string): Promise<EmailVerificationResult> => {
      try {
        const { data } = await verifyMutation({
          variables: { token },
        });

        if (!data?.verifyEmailForRegistration) {
          return {
            success: false,
            message: 'No response from server',
          };
        }

        return data.verifyEmailForRegistration;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Verification failed';
        return {
          success: false,
          message,
        };
      }
    },
    [verifyMutation]
  );

  return {
    verify,
    loading,
  };
}
