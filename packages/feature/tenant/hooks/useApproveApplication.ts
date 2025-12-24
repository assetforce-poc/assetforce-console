'use client';

import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';

import type { ApplicationActionVariables, ApproveApplicationResponse } from './operations';
import { APPROVE_APPLICATION } from './operations';

export interface ApproveResult {
  success: boolean;
  message?: string;
}

export interface UseApproveApplicationResult {
  approve: (applicationId: string) => Promise<ApproveResult>;
  loading: boolean;
  error: Error | undefined;
}

/**
 * Hook to approve a pending application (admin only).
 *
 * @example
 * ```tsx
 * const { approve, loading, error } = useApproveApplication();
 *
 * const handleApprove = async (applicationId: string) => {
 *   const result = await approve(applicationId);
 *   if (result.success) {
 *     refetch();
 *   } else {
 *     showError(result.message);
 *   }
 * };
 * ```
 */
export function useApproveApplication(): UseApproveApplicationResult {
  const [approveMutation, { loading, error }] = useMutation<
    ApproveApplicationResponse,
    ApplicationActionVariables
  >(APPROVE_APPLICATION);

  const approve = useCallback(
    async (applicationId: string): Promise<ApproveResult> => {
      try {
        const { data } = await approveMutation({
          variables: {
            input: { applicationId },
          },
        });

        if (data?.tenant?.application?.approve) {
          return {
            success: data.tenant.application.approve.success,
            message: data.tenant.application.approve.message,
          };
        }

        return { success: false, message: 'Unexpected response' };
      } catch (err) {
        return {
          success: false,
          message: err instanceof Error ? err.message : 'Unknown error',
        };
      }
    },
    [approveMutation]
  );

  return {
    approve,
    loading,
    error,
  };
}

export default useApproveApplication;
