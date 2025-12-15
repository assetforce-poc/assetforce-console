'use client';

import { useCallback, useState } from 'react';

import { useAuthAdapter } from '../adapter/AuthProvider';
import type { ResetPasswordData, ResetPasswordResult } from '../adapter/types';

export interface UseResetPasswordOptions {
  /**
   * Custom reset password function (overrides adapter)
   */
  onResetPassword?: (data: ResetPasswordData) => Promise<ResetPasswordResult>;

  /**
   * Success callback
   */
  onSuccess?: (result: ResetPasswordResult) => void;

  /**
   * Error callback
   */
  onError?: (error: string) => void;
}

export interface UseResetPasswordReturn {
  /**
   * Reset password function
   */
  resetPassword: (data: ResetPasswordData) => Promise<ResetPasswordResult | undefined>;

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
 * useResetPassword - Reset password hook with adapter or callback support
 *
 * Usage with adapter:
 * ```tsx
 * const { resetPassword, isLoading, error } = useResetPassword({
 *   onSuccess: (result) => router.push('/auth/login?reset=success')
 * });
 * ```
 *
 * Usage with callback:
 * ```tsx
 * const { resetPassword, isLoading, error } = useResetPassword({
 *   onResetPassword: async (data) => {
 *     const response = await fetch('/api/reset-password', { ... });
 *     return response.json();
 *   }
 * });
 * ```
 */
export function useResetPassword(options: UseResetPasswordOptions = {}): UseResetPasswordReturn {
  const { onResetPassword, onSuccess, onError } = options;
  const adapter = useAuthAdapter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetPassword = useCallback(
    async (data: ResetPasswordData): Promise<ResetPasswordResult | undefined> => {
      // Validate: must have either adapter or onResetPassword callback
      if (!adapter && !onResetPassword) {
        const errorMsg =
          'No reset password method provided. Either wrap your app with AuthProvider or pass onResetPassword callback to useResetPassword.';
        setError(errorMsg);
        onError?.(errorMsg);
        return undefined;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Use custom callback if provided, otherwise use adapter
        const resetPasswordFn = onResetPassword || adapter!.resetPassword.bind(adapter);
        const result = await resetPasswordFn(data);

        if (result.success) {
          onSuccess?.(result);
        } else {
          const errorMsg = result.error || 'Failed to reset password';
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
    [adapter, onResetPassword, onSuccess, onError]
  );

  return {
    resetPassword,
    isLoading,
    error,
    clearError,
  };
}
