'use client';

import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useMutation } from '@apollo/client/react';
import { useCallback, useState } from 'react';

import type { InviteErrorCode } from '../types/invite';
import type { CancelInviteResponse, CancelInviteVariables } from './operations';
import { CANCEL_INVITE, LIST_INVITES } from './operations';

export interface CancelInviteResult {
  success: boolean;
  error?: {
    code: InviteErrorCode;
    message: string;
  };
}

export interface UseCancelInviteResult {
  cancel: (id: string) => Promise<CancelInviteResult>;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to cancel a pending invite (admin only).
 *
 * @example
 * ```tsx
 * const { cancel, loading } = useCancelInvite();
 *
 * const handleCancel = async (inviteId: string) => {
 *   const result = await cancel(inviteId);
 *   if (result.success) {
 *     // Show success message, refetch list
 *   }
 * };
 * ```
 */
export function useCancelInvite(): UseCancelInviteResult {
  const [cancelMutation, { loading: mutationLoading }] = useMutation<CancelInviteResponse, CancelInviteVariables>(
    CANCEL_INVITE,
    {
      errorPolicy: 'all',
      refetchQueries: [LIST_INVITES],
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cancel = useCallback(
    async (id: string): Promise<CancelInviteResult> => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await cancelMutation({
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

        const result = data?.tenant?.invite?.cancel;

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
    [cancelMutation]
  );

  return {
    cancel,
    loading: loading || mutationLoading,
    error,
  };
}

export default useCancelInvite;
