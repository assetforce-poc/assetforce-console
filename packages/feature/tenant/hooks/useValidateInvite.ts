'use client';

import { useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import type {
  InviteValidationResult,
  UseValidateInviteOptions,
  UseValidateInviteResult,
  InviteStatus,
  InviteErrorCode,
} from '../types/invite';
import {
  VALIDATE_INVITE,
  ValidateInviteResponse,
  ValidateInviteVariables,
} from './operations';

/**
 * Hook to validate a tenant invite token.
 *
 * This hook calls the IMC backend to validate the invite token and returns
 * the validation result including invite details, auth requirements, and email matching info.
 *
 * @example
 * ```tsx
 * const { loading, data, error, refetch } = useValidateInvite({ token });
 *
 * if (loading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 * if (!data?.valid) return <ExpiredCard error={data?.error} />;
 * if (data.auth.required) return <LoginRequired />;
 * if (!data.email?.match) return <EmailMismatch email={data.email} />;
 * return <AcceptCard invite={data.invite} />;
 * ```
 */
export function useValidateInvite(options: UseValidateInviteOptions): UseValidateInviteResult {
  const { token, skip = false } = options;

  const { data, loading, error, refetch: apolloRefetch } = useQuery<
    ValidateInviteResponse,
    ValidateInviteVariables
  >(VALIDATE_INVITE, {
    variables: { token: token || '' },
    skip: skip || !token,
    fetchPolicy: 'network-only', // Always fetch fresh data for validation
    errorPolicy: 'all',
  });

  // Transform the response to our domain type
  const validationResult = useMemo((): InviteValidationResult | null => {
    if (!data?.tenant?.invite) return null;

    const { invite: result } = data.tenant;

    return {
      valid: result.valid,
      invite: result.invite
        ? {
            id: result.invite.id,
            tenantId: result.invite.tenantId,
            tenantName: result.invite.tenantName,
            invitedEmail: result.invite.invitedEmail,
            inviterEmail: result.invite.inviterEmail,
            role: result.invite.role,
            message: result.invite.message,
            status: result.invite.status as InviteStatus,
            expiresAt: result.invite.expiresAt,
            createdAt: result.invite.createdAt,
            updatedAt: result.invite.updatedAt,
          }
        : undefined,
      error: result.error
        ? {
            code: result.error.code as InviteErrorCode,
            message: result.error.message,
          }
        : undefined,
      auth: {
        required: result.auth.required,
      },
      email: result.email
        ? {
            match: result.email.match,
            invited: result.email.invited,
            current: result.email.current,
          }
        : undefined,
    };
  }, [data]);

  const refetch = useCallback(async () => {
    if (token) {
      await apolloRefetch({ token });
    }
  }, [apolloRefetch, token]);

  return {
    loading,
    error: error || null,
    data: validationResult,
    refetch,
  };
}

export default useValidateInvite;
