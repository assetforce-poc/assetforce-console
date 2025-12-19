'use client';

import { useMutation } from '@apollo/client/react';
import { useCallback, useState } from 'react';

import type { InviteAcceptResult, InviteErrorCode, UseAcceptInviteResult } from '../types/invite';
import type { AcceptInviteResponse, AcceptInviteVariables } from './operations';
import { ACCEPT_INVITE } from './operations';

/**
 * Hook to accept a tenant invite.
 *
 * This hook calls the IMC backend to accept the invite and join the tenant.
 * The user must be authenticated and their email must match the invited email.
 *
 * @example
 * ```tsx
 * const { accept, loading, error } = useAcceptInvite();
 *
 * const handleAccept = async () => {
 *   const result = await accept(token);
 *   if (result.success) {
 *     // Redirect to tenant home or show success message
 *     router.push(`/`);
 *   } else {
 *     // Handle error
 *     console.error(result.error);
 *   }
 * };
 * ```
 */
export function useAcceptInvite(): UseAcceptInviteResult {
  const [acceptMutation, { loading: mutationLoading }] = useMutation<AcceptInviteResponse, AcceptInviteVariables>(
    ACCEPT_INVITE,
    {
      errorPolicy: 'all',
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const accept = useCallback(
    async (token: string): Promise<InviteAcceptResult> => {
      setLoading(true);
      setError(null);

      try {
        const { data, errors } = await acceptMutation({
          variables: { token },
        });

        // Handle GraphQL errors
        if (errors && errors.length > 0) {
          const errorMessage = errors.map((e) => e.message).join(', ');
          setError(new Error(errorMessage));
          return {
            success: false,
            error: {
              code: 'UNAUTHORIZED' as InviteErrorCode,
              message: errorMessage,
            },
          };
        }

        const result = data?.tenant?.invite?.accept;

        if (!result) {
          const err = new Error('No response from server');
          setError(err);
          return {
            success: false,
            error: {
              code: 'INVALID_TOKEN' as InviteErrorCode,
              message: 'No response from server',
            },
          };
        }

        if (!result.success && result.error) {
          return {
            success: false,
            error: {
              code: result.error.code as InviteErrorCode,
              message: result.error.message,
            },
          };
        }

        return {
          success: result.success,
          membership: result.membership
            ? {
                tenant: {
                  id: result.membership.tenant.id,
                  name: result.membership.tenant.name,
                },
                role: result.membership.role,
                createdAt: result.membership.createdAt,
              }
            : undefined,
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
    [acceptMutation]
  );

  return {
    accept,
    loading: loading || mutationLoading,
    error,
  };
}

export default useAcceptInvite;
