'use client';

import { Box, Button, CircularProgress, Icons, Paper, Stack, Typography } from '@assetforce/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useVerifyEmail } from '../hooks';
import type { EmailVerificationResult } from '../types';
import { VerificationErrorCodes } from '../types';

export interface VerifyEmailResultProps {
  /** Verification token from URL */
  token: string;
  /** Called when verification is successful */
  onSuccess?: (result: EmailVerificationResult) => void;
  /** Called when verification fails */
  onError?: (message: string) => void;
}

type VerificationState =
  | { status: 'loading' }
  | { status: 'success'; result: EmailVerificationResult }
  | { status: 'error'; message: string; code?: string };

/**
 * VerifyEmailResult - Email verification result display
 *
 * Automatically verifies the email token on mount and displays the result.
 *
 * @example
 * ```tsx
 * const token = searchParams.get('token');
 * if (!token) {
 *   return <ErrorMessage>Invalid verification link</ErrorMessage>;
 * }
 * return <VerifyEmailResult token={token} />;
 * ```
 */
export function VerifyEmailResult({ token, onSuccess, onError }: VerifyEmailResultProps) {
  const { verify } = useVerifyEmail();
  const [state, setState] = useState<VerificationState>({ status: 'loading' });

  useEffect(() => {
    let mounted = true;

    const doVerify = async () => {
      const result = await verify(token);

      if (!mounted) return;

      if (result.success) {
        setState({ status: 'success', result });
        onSuccess?.(result);
      } else {
        const message = result.message || 'Verification failed';
        setState({ status: 'error', message, code: result.message ?? undefined });
        onError?.(message);
      }
    };

    doVerify();

    return () => {
      mounted = false;
    };
  }, [token, verify, onSuccess, onError]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: 'center',
        maxWidth: 480,
        mx: 'auto',
      }}
    >
      {state.status === 'loading' && <LoadingState />}
      {state.status === 'success' && <SuccessState result={state.result} />}
      {state.status === 'error' && <ErrorState message={state.message} code={state.code} />}
    </Paper>
  );
}

// ============ Sub-components ============

function LoadingState() {
  return (
    <Stack spacing={3} alignItems="center">
      <CircularProgress size={60} />
      <Typography variant="h6">Verifying your email...</Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait while we verify your email address.
      </Typography>
    </Stack>
  );
}

function SuccessState({ result }: { result: EmailVerificationResult }) {
  const isAlreadyVerified = result.message === VerificationErrorCodes.ALREADY_VERIFIED;

  return (
    <Stack spacing={3} alignItems="center">
      {/* Success Icon */}
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'success.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icons.CheckCircleOutline sx={{ fontSize: 48, color: 'success.main' }} />
      </Box>

      {/* Title */}
      <Typography variant="h4" component="h1">
        {isAlreadyVerified ? 'Already Verified' : 'Email Verified!'}
      </Typography>

      {/* Description */}
      <Typography variant="body1" color="text.secondary">
        {isAlreadyVerified
          ? 'Your email has already been verified. You can sign in now.'
          : 'Your email has been successfully verified. You can now sign in to your account.'}
      </Typography>

      {/* Tenant Status Info */}
      {result.tenantStatus && !result.tenantStatus.hasTenants && (
        <Box
          sx={{
            p: 2,
            bgcolor: 'info.light',
            borderRadius: 1,
            width: '100%',
          }}
        >
          <Typography variant="body2">
            <strong>Note:</strong> You don&apos;t belong to any organization yet. You may need to be invited or apply to
            join one.
          </Typography>
        </Box>
      )}

      {/* Sign In Button */}
      <Button component={Link} href="/auth/login" variant="contained" size="large" fullWidth>
        Sign In
      </Button>
    </Stack>
  );
}

function ErrorState({ message, code }: { message: string; code?: string }) {
  const isExpired = code === VerificationErrorCodes.TOKEN_EXPIRED;
  const isNotFound = code === VerificationErrorCodes.TOKEN_NOT_FOUND;

  return (
    <Stack spacing={3} alignItems="center">
      {/* Error Icon */}
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'error.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icons.ErrorOutline sx={{ fontSize: 48, color: 'error.main' }} />
      </Box>

      {/* Title */}
      <Typography variant="h4" component="h1">
        {isExpired ? 'Link Expired' : isNotFound ? 'Invalid Link' : 'Verification Failed'}
      </Typography>

      {/* Description */}
      <Typography variant="body1" color="text.secondary">
        {isExpired
          ? 'This verification link has expired. Please request a new one.'
          : isNotFound
            ? 'This verification link is invalid. Please check your email for the correct link.'
            : message}
      </Typography>

      {/* Actions */}
      <Stack direction="row" spacing={2} width="100%">
        <Button component={Link} href="/auth/register" variant="outlined" fullWidth>
          Register Again
        </Button>
        <Button component={Link} href="/auth/login" variant="contained" fullWidth>
          Sign In
        </Button>
      </Stack>
    </Stack>
  );
}
