'use client';

import { useMutation } from '@assetforce/graphql';
import { useCallback } from 'react';

import { ResendVerificationEmailInRegistrationDocument as RESEND_VERIFICATION_EMAIL_MUTATION } from '../../generated/graphql';

export interface ResendVerificationEmailResult {
  success: boolean;
  message: string;
}

export interface UseResendVerificationEmailReturn {
  /** Execute resend verification email */
  resend: (email: string) => Promise<ResendVerificationEmailResult>;
  /** Loading state */
  loading: boolean;
}

/**
 * useResendVerificationEmail Hook - Resend verification email to unverified account
 *
 * @example
 * ```tsx
 * const { resend, loading } = useResendVerificationEmail();
 *
 * const handleResend = async () => {
 *   const result = await resend(email);
 *   if (result.success) {
 *     alert('Verification email resent!');
 *   } else {
 *     alert(result.message);
 *   }
 * };
 * ```
 */
export function useResendVerificationEmail(): UseResendVerificationEmailReturn {
  const [resendMutation, { loading }] = useMutation<
    { registration: { resendVerificationEmail: ResendVerificationEmailResult } },
    { email: string }
  >(RESEND_VERIFICATION_EMAIL_MUTATION);

  const resend = useCallback(
    async (email: string): Promise<ResendVerificationEmailResult> => {
      try {
        const { data } = await resendMutation({
          variables: { email },
        });

        if (!data?.registration?.resendVerificationEmail) {
          return {
            success: false,
            message: 'No response from server',
          };
        }

        return data.registration.resendVerificationEmail;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to resend verification email';
        return {
          success: false,
          message,
        };
      }
    },
    [resendMutation]
  );

  return {
    resend,
    loading,
  };
}
