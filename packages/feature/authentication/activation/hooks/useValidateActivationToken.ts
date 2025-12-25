'use client';

import { useQuery } from '@assetforce/graphql';
import { useCallback } from 'react';

import type { ActivationValidationResult } from '../../generated/graphql';
import { ValidateActivationTokenDocument as VALIDATE_ACTIVATION_TOKEN_MUTATION } from '../../generated/graphql';

// Re-export GraphQL types for external consumption
export type { ActivationValidationResult };

export interface UseValidateActivationTokenReturn {
  /** Execute token validation */
  validate: (token: string) => Promise<void>;
  /** Loading state */
  loading: boolean;
  /** Error if any */
  error: Error | undefined;
  /** Validation result */
  result?: ActivationValidationResult;
}

/**
 * useValidateActivationToken Hook - Validate activation token
 *
 * Validates an activation token from email link (anonymous access).
 *
 * @example
 * ```tsx
 * const { validate, loading, result, error } = useValidateActivationToken();
 *
 * useEffect(() => {
 *   if (token) {
 *     validate(token);
 *   }
 * }, [token, validate]);
 *
 * if (result?.valid) {
 *   // Show activation form
 * }
 * ```
 */
export function useValidateActivationToken(token?: string): UseValidateActivationTokenReturn {
  const { data, loading, error, refetch } = useQuery(VALIDATE_ACTIVATION_TOKEN_MUTATION, {
    variables: { token: token || '' },
    skip: !token,
  });

  const validate = useCallback(
    async (newToken: string): Promise<void> => {
      await refetch({ token: newToken });
    },
    [refetch]
  );

  const result = data?.account?.activation?.validate;

  return {
    validate,
    loading,
    error,
    result,
  };
}
