'use client';

import { useMutation } from '@assetforce/graphql';
import { useCallback } from 'react';

import { REGISTER_MUTATION } from '../graphql';
import type { RegisterInput, RegisterResult } from '../types';

export interface UseRegisterReturn {
  /** Execute registration */
  register: (input: RegisterInput) => Promise<RegisterResult>;
  /** Loading state */
  loading: boolean;
}

/**
 * useRegister Hook - Register a new user account
 *
 * Uses direct GraphQL mutation to AAC (no session needed for registration).
 *
 * @example
 * ```tsx
 * const { register, loading } = useRegister();
 *
 * const handleSubmit = async (values: RegisterFormValues) => {
 *   const result = await register({
 *     email: values.email,
 *     password: values.password,
 *     firstName: values.firstName,
 *     lastName: values.lastName,
 *     acceptTerms: values.acceptTerms,
 *   });
 *
 *   if (result.success) {
 *     router.push(`/auth/registration-success?email=${encodeURIComponent(values.email)}`);
 *   } else {
 *     setError(result.message || 'Registration failed');
 *   }
 * };
 * ```
 */
export function useRegister(): UseRegisterReturn {
  const [registerMutation, { loading }] = useMutation<{ register: RegisterResult }, { input: RegisterInput }>(
    REGISTER_MUTATION
  );

  const register = useCallback(
    async (input: RegisterInput): Promise<RegisterResult> => {
      try {
        const { data } = await registerMutation({
          variables: { input },
        });

        if (!data?.register) {
          return {
            success: false,
            message: 'No response from server',
            requiresVerification: false,
            email: input.email,
          };
        }

        // Include email in result for convenience
        return { ...data.register, email: input.email };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        return {
          success: false,
          message,
          requiresVerification: false,
          email: input.email,
        };
      }
    },
    [registerMutation]
  );

  return {
    register,
    loading,
  };
}
