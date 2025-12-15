'use client';

import { useCallback, useState } from 'react';

import { useAuthAdapter } from '../adapter/AuthProvider';
import type { ChangePasswordData, ChangePasswordResult } from '../adapter/types';

export interface UseChangePasswordOptions {
  /**
   * Custom change password function (overrides adapter)
   */
  onChangePassword?: (data: ChangePasswordData) => Promise<ChangePasswordResult>;

  /**
   * Success callback
   */
  onSuccess?: (result: ChangePasswordResult) => void;

  /**
   * Error callback
   */
  onError?: (error: string) => void;
}

export interface UseChangePasswordReturn {
  /**
   * Change password function
   */
  changePassword: (data: ChangePasswordData) => Promise<ChangePasswordResult | undefined>;

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
 * useChangePassword - Change password hook with adapter or callback support
 *
 * Usage with adapter:
 * ```tsx
 * const { changePassword, isLoading, error } = useChangePassword({
 *   onSuccess: (result) => toast.success('Password changed successfully')
 * });
 * ```
 *
 * Usage with callback:
 * ```tsx
 * const { changePassword, isLoading, error } = useChangePassword({
 *   onChangePassword: async (data) => {
 *     const response = await fetch('/api/change-password', { ... });
 *     return response.json();
 *   }
 * });
 * ```
 */
export function useChangePassword(options: UseChangePasswordOptions = {}): UseChangePasswordReturn {
  const { onChangePassword, onSuccess, onError } = options;
  const adapter = useAuthAdapter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const changePassword = useCallback(
    async (data: ChangePasswordData): Promise<ChangePasswordResult | undefined> => {
      // Validate: must have either adapter or onChangePassword callback
      if (!adapter && !onChangePassword) {
        const errorMsg =
          'No change password method provided. Either wrap your app with AuthProvider or pass onChangePassword callback to useChangePassword.';
        setError(errorMsg);
        onError?.(errorMsg);
        return undefined;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Use custom callback if provided, otherwise use adapter
        const changePasswordFn = onChangePassword || adapter!.changePassword.bind(adapter);
        const result = await changePasswordFn(data);

        if (result.success) {
          onSuccess?.(result);
        } else {
          const errorMsg = result.error || 'Failed to change password';
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
    [adapter, onChangePassword, onSuccess, onError]
  );

  return {
    changePassword,
    isLoading,
    error,
    clearError,
  };
}
