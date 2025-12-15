'use client';

import { useCallback, useState } from 'react';

import { useAuthAdapter } from '../adapter/AuthProvider';
import type { ResendVerificationData, ResendVerificationResult } from '../adapter/types';

export interface UseResendVerificationOptions {
  /**
   * Custom resend verification function (overrides adapter)
   */
  onResendVerification?: (data: ResendVerificationData) => Promise<ResendVerificationResult>;

  /**
   * Success callback
   */
  onSuccess?: (result: ResendVerificationResult) => void;

  /**
   * Error callback
   */
  onError?: (error: string) => void;
}

export interface UseResendVerificationReturn {
  /**
   * Resend verification function
   */
  resendVerification: (data: ResendVerificationData) => Promise<ResendVerificationResult | undefined>;

  /**
   * Loading state
   */
  isLoading: boolean;

  /**
   * Error message
   */
  error: string | null;

  /**
   * Clear error
   */
  clearError: () => void;
}

/**
 * useResendVerification - Resend verification email hook with adapter or callback support
 *
 * Usage with adapter:
 * ```tsx
 * const { resendVerification, isLoading, error } = useResendVerification({
 *   onSuccess: (result) => toast.success('Verification email sent')
 * });
 * ```
 *
 * Usage with callback:
 * ```tsx
 * const { resendVerification, isLoading, error } = useResendVerification({
 *   onResendVerification: async (data) => {
 *     const response = await fetch('/api/resend-verification', { ... });
 *     return response.json();
 *   }
 * });
 * ```
 */
export function useResendVerification(options: UseResendVerificationOptions = {}): UseResendVerificationReturn {
  const { onResendVerification, onSuccess, onError } = options;
  const adapter = useAuthAdapter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resendVerification = useCallback(
    async (data: ResendVerificationData): Promise<ResendVerificationResult | undefined> => {
      // Validate: must have either adapter or onResendVerification callback
      if (!adapter && !onResendVerification) {
        const errorMsg =
          'No resend verification method provided. Either wrap your app with AuthProvider or pass onResendVerification callback to useResendVerification.';
        setError(errorMsg);
        onError?.(errorMsg);
        return undefined;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Use custom callback if provided, otherwise use adapter
        const resendVerificationFn = onResendVerification || adapter!.resendVerification.bind(adapter);
        const result = await resendVerificationFn(data);

        if (result.success) {
          onSuccess?.(result);
        } else {
          const errorMsg = result.error || 'Failed to resend verification email';
          setError(errorMsg);
          onError?.(errorMsg);
        }

        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMsg);
        onError?.(errorMsg);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [adapter, onResendVerification, onSuccess, onError]
  );

  return {
    resendVerification,
    isLoading,
    error,
    clearError,
  };
}
