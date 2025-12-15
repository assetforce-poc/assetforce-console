'use client';

import { useCallback, useState } from 'react';

import { useAuthAdapter } from '../adapter/AuthProvider';
import type { VerifyEmailData, VerifyEmailResult } from '../adapter/types';

export interface UseVerifyEmailOptions {
  /**
   * Custom verify email function (overrides adapter)
   */
  onVerifyEmail?: (data: VerifyEmailData) => Promise<VerifyEmailResult>;

  /**
   * Success callback
   */
  onSuccess?: (result: VerifyEmailResult) => void;

  /**
   * Error callback
   */
  onError?: (error: string) => void;
}

export interface UseVerifyEmailReturn {
  /**
   * Verify email function
   */
  verifyEmail: (data: VerifyEmailData) => Promise<VerifyEmailResult | undefined>;

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
 * useVerifyEmail - Email verification hook with adapter or callback support
 *
 * Usage with adapter:
 * ```tsx
 * const { verifyEmail, isLoading, error } = useVerifyEmail({
 *   onSuccess: (result) => router.push('/auth/login?verified=true')
 * });
 * ```
 *
 * Usage with callback:
 * ```tsx
 * const { verifyEmail, isLoading, error } = useVerifyEmail({
 *   onVerifyEmail: async (data) => {
 *     const response = await fetch('/api/verify-email', { ... });
 *     return response.json();
 *   }
 * });
 * ```
 */
export function useVerifyEmail(options: UseVerifyEmailOptions = {}): UseVerifyEmailReturn {
  const { onVerifyEmail, onSuccess, onError } = options;
  const adapter = useAuthAdapter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const verifyEmail = useCallback(
    async (data: VerifyEmailData): Promise<VerifyEmailResult | undefined> => {
      // Validate: must have either adapter or onVerifyEmail callback
      if (!adapter && !onVerifyEmail) {
        const errorMsg =
          'No verify email method provided. Either wrap your app with AuthProvider or pass onVerifyEmail callback to useVerifyEmail.';
        setError(errorMsg);
        onError?.(errorMsg);
        return undefined;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Use custom callback if provided, otherwise use adapter
        const verifyEmailFn = onVerifyEmail || adapter!.verifyEmail.bind(adapter);
        const result = await verifyEmailFn(data);

        if (result.success) {
          onSuccess?.(result);
        } else {
          const errorMsg = result.error || 'Failed to verify email';
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
    [adapter, onVerifyEmail, onSuccess, onError]
  );

  return {
    verifyEmail,
    isLoading,
    error,
    clearError,
  };
}
