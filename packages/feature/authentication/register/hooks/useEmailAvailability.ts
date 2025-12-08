'use client';

import { useLazyQuery } from '@assetforce/graphql';
import { useCallback, useEffect, useRef, useState } from 'react';

import { CHECK_EMAIL_AVAILABILITY } from '../graphql';
import type { EmailAvailability } from '../types';

export interface UseEmailAvailabilityOptions {
  /** Debounce delay in milliseconds (default: 500) */
  debounceMs?: number;
}

export interface UseEmailAvailabilityReturn {
  /** Check email availability (debounced) */
  checkEmail: (email: string) => void;
  /** Whether email is available (null = not checked yet) */
  available: boolean | null;
  /** Reason if not available */
  reason: string | null;
  /** Loading state */
  loading: boolean;
  /** Reset state */
  reset: () => void;
}

/**
 * useEmailAvailability Hook - Check if email is available for registration
 *
 * Automatically debounces requests to avoid excessive API calls.
 *
 * @example
 * ```tsx
 * const { checkEmail, available, reason, loading } = useEmailAvailability();
 *
 * <TextField
 *   name="email"
 *   onChange={(e) => {
 *     setEmail(e.target.value);
 *     checkEmail(e.target.value);
 *   }}
 *   error={available === false}
 *   helperText={available === false ? reason : undefined}
 *   InputProps={{
 *     endAdornment: loading ? <CircularProgress size={20} /> : null,
 *   }}
 * />
 * ```
 */
export function useEmailAvailability(options?: UseEmailAvailabilityOptions): UseEmailAvailabilityReturn {
  const debounceMs = options?.debounceMs ?? 500;

  const [available, setAvailable] = useState<boolean | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [executeQuery, { loading, data, error }] = useLazyQuery<
    { checkEmailAvailability: EmailAvailability },
    { email: string }
  >(CHECK_EMAIL_AVAILABILITY, {
    fetchPolicy: 'network-only',
  });

  // Handle query result
  useEffect(() => {
    if (data?.checkEmailAvailability) {
      setAvailable(data.checkEmailAvailability.available);
      setReason(data.checkEmailAvailability.reason ?? null);
    }
  }, [data]);

  // Handle query error
  useEffect(() => {
    if (error) {
      // Don't block registration on check failure - silently ignore
      setAvailable(null);
      setReason(null);
    }
  }, [error]);

  const checkEmail = useCallback(
    (email: string) => {
      // Clear previous timeout
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Reset state for new input
      setAvailable(null);
      setReason(null);

      // Skip check if email is empty or too short
      if (!email || email.length < 3) {
        return;
      }

      // Basic email format check before API call
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return;
      }

      // Debounced API call
      debounceRef.current = setTimeout(() => {
        executeQuery({ variables: { email } });
      }, debounceMs);
    },
    [debounceMs, executeQuery]
  );

  const reset = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    setAvailable(null);
    setReason(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    checkEmail,
    available,
    reason,
    loading,
    reset,
  };
}
