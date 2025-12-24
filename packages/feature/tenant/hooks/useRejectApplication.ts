'use client';

import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';

import type { ApplicationActionVariables, RejectApplicationResponse } from './operations';
import { REJECT_APPLICATION } from './operations';

export interface RejectResult {
  success: boolean;
  message?: string;
}

export interface UseRejectApplicationResult {
  reject: (applicationId: string, message?: string) => Promise<RejectResult>;
  loading: boolean;
  error: Error | undefined;
}

/**
 * Hook to reject a pending application (admin only).
 *
 * @example
 * ```tsx
 * const { reject, loading, error } = useRejectApplication();
 *
 * const handleReject = async (applicationId: string) => {
 *   const result = await reject(applicationId, 'Application rejected');
 *   if (result.success) {
 *     refetch();
 *   } else {
 *     showError(result.message);
 *   }
 * };
 * ```
 */
export function useRejectApplication(): UseRejectApplicationResult {
  const [rejectMutation, { loading, error }] = useMutation<RejectApplicationResponse, ApplicationActionVariables>(
    REJECT_APPLICATION
  );

  const reject = useCallback(
    async (applicationId: string, message?: string): Promise<RejectResult> => {
      try {
        const { data } = await rejectMutation({
          variables: {
            input: { applicationId, message },
          },
        });

        if (data?.tenant?.application?.reject) {
          return {
            success: data.tenant.application.reject.success,
            message: data.tenant.application.reject.message,
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
    [rejectMutation]
  );

  return {
    reject,
    loading,
    error,
  };
}

export default useRejectApplication;
