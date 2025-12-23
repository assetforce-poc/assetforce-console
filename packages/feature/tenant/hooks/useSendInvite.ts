'use client';

import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useMutation } from '@apollo/client/react';
import { useCallback, useState } from 'react';

import type { InviteErrorCode } from '../types/invite';
import type { SendInviteResponse, SendInviteVariables } from './operations';
import { SEND_INVITE } from './operations';

export interface SendInviteInput {
  tenantId: string;
  email: string;
  role?: string;
  message?: string;
  expiryDays?: number;
}

export interface InviteSendResult {
  success: boolean;
  invite?: {
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

export interface UseSendInviteResult {
  send: (input: SendInviteInput) => Promise<InviteSendResult>;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to send a tenant invite (admin only).
 *
 * @example
 * ```tsx
 * const { send, loading, error } = useSendInvite();
 *
 * const handleSend = async () => {
 *   const result = await send({
 *     tenantId: 'earth',
 *     email: 'user@example.com',
 *     role: 'member',
 *   });
 *   if (result.success) {
 *     // Show success message
 *   }
 * };
 * ```
 */
export function useSendInvite(): UseSendInviteResult {
  const [sendMutation, { loading: mutationLoading }] = useMutation<SendInviteResponse, SendInviteVariables>(
    SEND_INVITE,
    {
      errorPolicy: 'all',
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const send = useCallback(
    async (input: SendInviteInput): Promise<InviteSendResult> => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await sendMutation({
          variables: { input },
        });

        // Handle GraphQL errors
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

        const result = data?.tenant?.invite?.send;

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
          invite: result.invite || undefined,
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
    [sendMutation]
  );

  return {
    send,
    loading: loading || mutationLoading,
    error,
  };
}

export default useSendInvite;
