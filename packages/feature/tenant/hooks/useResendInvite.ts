'use client';

import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useMutation } from '@apollo/client/react';
import { useCallback, useState } from 'react';

import type { InviteErrorCode } from '../types/invite';
import type { ResendInviteResponse, ResendInviteVariables } from './operations';
import { LIST_INVITES, RESEND_INVITE } from './operations';

export interface ResendInviteResult {
  success: boolean;
  created?: {
    id: string;
    tenantId: string;
    tenantName: string;
    invitedEmail: string;
    role?: string;
    expiresAt: string;
    createdAt: string;
  };
  error?: {
    code: InviteErrorCode;
    message: string;
  };
}

export interface UseResendInviteResult {
  resend: (id: string) => Promise<ResendInviteResult>;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to resend an invite (admin only).
 * Cancels the old invite and creates a new one with a fresh token.
 *
 * @example
 * ```tsx
 * const { resend, loading } = useResendInvite();
 *
 * const handleResend = async (inviteId: string) => {
 *   const result = await resend(inviteId);
 *   if (result.success) {
 *     // Show success message with new invite details
 *   }
 * };
 * ```
 */
export function useResendInvite(): UseResendInviteResult {
  const [resendMutation, { loading: mutationLoading }] = useMutation<ResendInviteResponse, ResendInviteVariables>(
    RESEND_INVITE,
    {
      errorPolicy: 'all',
      refetchQueries: [LIST_INVITES],
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resend = useCallback(
    async (id: string): Promise<ResendInviteResult> => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await resendMutation({
          variables: { id },
        });

        if (error) {
          let errorMessage = error.message;
          if (CombinedGraphQLErrors.is(error)) {
            errorMessage = error.errors.map((e) => e.message).join(', ');
          }
          setError(new Error(errorMessage));
          return {
            success: false,
            error: {
              code: 'UNAUTHORIZED' as InviteErrorCode,
              message: errorMessage,
            },
          };
        }

        const result = data?.tenant?.invite?.resend;

        if (!result) {
          const err = new Error('No response from server');
          setError(err);
          return {
            success: false,
            error: {
              code: 'INVITE_NOT_FOUND' as InviteErrorCode,
              message: 'No response from server',
            },
          };
        }

        return {
          success: result.success,
          created: result.created || undefined,
          error: result.error
            ? {
                code: result.error.code as InviteErrorCode,
                message: result.error.message,
              }
            : undefined,
        };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED' as InviteErrorCode,
            message: error.message,
          },
        };
      } finally {
        setLoading(false);
      }
    },
    [resendMutation]
  );

  return {
    resend,
    loading: loading || mutationLoading,
    error,
  };
}

export default useResendInvite;
