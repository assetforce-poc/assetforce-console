'use client';

import { Alert, Box, CircularProgress, Stack, Typography } from '@assetforce/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import type { VerifyEmailData, VerifyEmailResult } from '../adapter/types';
import { useVerifyEmail } from '../hooks/useVerifyEmail';

export interface VerifyEmailPageProps {
  /**
   * Verification token from URL
   */
  token: string;

  /**
   * Custom verify email function (overrides adapter)
   */
  onVerifyEmail?: (data: VerifyEmailData) => Promise<VerifyEmailResult>;

  /**
   * Success callback - called after successful verification
   */
  onSuccess?: (result: VerifyEmailResult) => void;

  /**
   * Error callback
   */
  onError?: (error: string) => void;

  /**
   * Sign in link href (default: '/auth/login')
   */
  signInHref?: string;

  /**
   * Resend verification link href (default: '/auth/resend-verification')
   */
  resendHref?: string;

  /**
   * Auto-verify on mount (default: true)
   */
  autoVerify?: boolean;
}

/**
 * VerifyEmailPage - Complete email verification page with status display
 *
 * Features:
 * - Auto-verification on mount
 * - Loading state display
 * - Success/error messages
 * - Links to sign in or resend verification
 * - Customizable messages and behavior
 *
 * States:
 * - Verifying: Shows loading spinner
 * - Success: Shows success message with sign in link
 * - Error: Shows error message with resend link
 *
 * @example
 * ```tsx
 * // Get token from URL search params
 * const searchParams = useSearchParams();
 * const token = searchParams.get('token') || '';
 *
 * // With adapter (from AuthProvider)
 * <VerifyEmailPage
 *   token={token}
 *   onSuccess={(result) => {
 *     if (result.redirectUrl) {
 *       router.push(result.redirectUrl);
 *     } else {
 *       router.push('/auth/login?verified=true');
 *     }
 *   }}
 * />
 *
 * // With custom callback
 * <VerifyEmailPage
 *   token={token}
 *   onVerifyEmail={async (data) => {
 *     const response = await fetch('/api/verify-email', { ... });
 *     return response.json();
 *   }}
 * />
 * ```
 */
export function VerifyEmailPage({
  token,
  onVerifyEmail,
  onSuccess,
  onError,
  signInHref = '/auth/login',
  resendHref = '/auth/resend-verification',
  autoVerify = true,
}: VerifyEmailPageProps) {
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>(
    autoVerify ? 'verifying' : 'idle'
  );

  const { verifyEmail, isLoading, error, clearError } = useVerifyEmail({
    onVerifyEmail,
    onSuccess: (result) => {
      setVerificationStatus('success');
      onSuccess?.(result);
    },
    onError: (errorMsg) => {
      setVerificationStatus('error');
      onError?.(errorMsg);
    },
  });

  useEffect(() => {
    if (autoVerify && token && verificationStatus === 'verifying') {
      // Verify email on mount
      verifyEmail({ token });
    }
  }, [token, autoVerify, verificationStatus, verifyEmail]);

  const handleRetry = () => {
    clearError();
    setVerificationStatus('verifying');
    verifyEmail({ token });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
      <Stack spacing={4} sx={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>
        {/* Verifying state */}
        {(verificationStatus === 'verifying' || isLoading) && (
          <>
            <CircularProgress size={60} sx={{ mx: 'auto' }} />
            <Typography variant="h5" component="h1">
              Verifying your email...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we verify your email address.
            </Typography>
          </>
        )}

        {/* Success state */}
        {verificationStatus === 'success' && !isLoading && (
          <>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'success.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
              }}
            >
              <Typography variant="h2" sx={{ color: 'success.contrastText' }}>
                ✓
              </Typography>
            </Box>

            <Typography variant="h5" component="h1">
              Email Verified Successfully!
            </Typography>

            <Typography variant="body1" color="text.secondary">
              Your email address has been verified. You can now sign in to your account.
            </Typography>

            <Box>
              <Link href={signInHref} passHref legacyBehavior>
                <Typography
                  component="a"
                  variant="button"
                  sx={{
                    display: 'inline-block',
                    px: 4,
                    py: 1.5,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: 1,
                    textDecoration: 'none',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  Sign In
                </Typography>
              </Link>
            </Box>
          </>
        )}

        {/* Error state */}
        {verificationStatus === 'error' && !isLoading && (
          <>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'error.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
              }}
            >
              <Typography variant="h2" sx={{ color: 'error.contrastText' }}>
                ✕
              </Typography>
            </Box>

            <Typography variant="h5" component="h1">
              Verification Failed
            </Typography>

            <Alert severity="error" sx={{ textAlign: 'left' }}>
              {error || 'Unable to verify your email address. The link may be invalid or expired.'}
            </Alert>

            <Typography variant="body2" color="text.secondary">
              Please try verifying again or request a new verification email.
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Typography
                component="button"
                variant="button"
                onClick={handleRetry}
                sx={{
                  px: 3,
                  py: 1.5,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  borderRadius: 1,
                  border: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Try Again
              </Typography>

              <Link href={resendHref} passHref legacyBehavior>
                <Typography
                  component="a"
                  variant="button"
                  sx={{
                    display: 'inline-block',
                    px: 3,
                    py: 1.5,
                    bgcolor: 'transparent',
                    color: 'primary.main',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  Resend Email
                </Typography>
              </Link>
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  );
}
