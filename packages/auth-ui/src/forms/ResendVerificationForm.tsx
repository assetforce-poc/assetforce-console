'use client';

import { Alert, Box, Link as MuiLink, Stack, Typography } from '@assetforce/material';
import Link from 'next/link';
import { type FormEvent, useState } from 'react';

import type { ResendVerificationData, ResendVerificationResult } from '../adapter/types';
import { EmailInput } from '../components/EmailInput';
import { FormError } from '../components/FormError';
import { SubmitButton } from '../components/SubmitButton';
import { useResendVerification } from '../hooks/useResendVerification';

export interface ResendVerificationFormProps {
  /**
   * Pre-filled email address (optional)
   */
  defaultEmail?: string;

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

  /**
   * Show "Back to Sign In" link (default: true)
   */
  showBackToSignIn?: boolean;

  /**
   * Sign in link href (default: '/auth/login')
   */
  signInHref?: string;

  /**
   * Title text (default: 'Resend Verification Email')
   */
  title?: string;

  /**
   * Description text
   */
  description?: string;
}

/**
 * ResendVerificationForm - Form for resending email verification
 *
 * Features:
 * - Email input with optional pre-fill
 * - Loading state
 * - Error handling
 * - Success message with cooldown indicator
 * - Rate limiting support
 * - Back to Sign In link
 *
 * @example
 * ```tsx
 * // With adapter (from AuthProvider)
 * <ResendVerificationForm
 *   defaultEmail="user@example.com"
 *   onSuccess={(result) => {
 *     toast.success(`Verification email sent! ${result.cooldownSeconds ? `Wait ${result.cooldownSeconds}s before resending.` : ''}`);
 *   }}
 * />
 *
 * // With custom callback
 * <ResendVerificationForm
 *   onResendVerification={async (data) => {
 *     const response = await fetch('/api/resend-verification', { ... });
 *     return response.json();
 *   }}
 * />
 * ```
 */
export function ResendVerificationForm({
  defaultEmail = '',
  onResendVerification,
  onSuccess,
  onError,
  showBackToSignIn = true,
  signInHref = '/auth/login',
  title = 'Resend Verification Email',
  description = 'Enter your email address and we will send you a new verification link.',
}: ResendVerificationFormProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState<number | null>(null);

  const {
    resendVerification,
    isLoading,
    error: resendError,
    clearError,
  } = useResendVerification({
    onResendVerification,
    onSuccess: (result) => {
      setSuccessMessage(result.message || `Verification email has been sent to ${email}. Please check your inbox.`);
      if (result.cooldownSeconds) {
        setCooldownSeconds(result.cooldownSeconds);
        // Start countdown
        let remaining = result.cooldownSeconds;
        const interval = setInterval(() => {
          remaining -= 1;
          if (remaining <= 0) {
            clearInterval(interval);
            setCooldownSeconds(null);
          } else {
            setCooldownSeconds(remaining);
          }
        }, 1000);
      }
      onSuccess?.(result);
    },
    onError,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setValidationError(null);
    setSuccessMessage(null);

    // Simple validation
    if (!email) {
      setValidationError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setValidationError('Please enter a valid email address');
      return;
    }

    await resendVerification({ email });
  };

  const error = validationError || resendError;

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        {/* Title and description */}
        {(title || description) && (
          <Box>
            {title && (
              <Typography variant="h5" component="h1" gutterBottom>
                {title}
              </Typography>
            )}
            {description && (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            )}
          </Box>
        )}

        {/* Success message */}
        {successMessage && (
          <Alert severity="success" sx={{ textAlign: 'left' }}>
            <Typography variant="body2">{successMessage}</Typography>
            {cooldownSeconds && cooldownSeconds > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                You can resend again in {cooldownSeconds} seconds.
              </Typography>
            )}
          </Alert>
        )}

        {/* Error message */}
        {!successMessage && <FormError error={error} />}

        {/* Email input */}
        <EmailInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          autoFocus
          disabled={isLoading || !!successMessage || (cooldownSeconds !== null && cooldownSeconds > 0)}
        />

        {/* Submit button */}
        <SubmitButton
          loading={isLoading}
          loadingText="Sending..."
          disabled={!!successMessage || (cooldownSeconds !== null && cooldownSeconds > 0)}
        >
          {cooldownSeconds && cooldownSeconds > 0 ? `Resend in ${cooldownSeconds}s` : 'Send Verification Email'}
        </SubmitButton>

        {/* Back to Sign In link */}
        {showBackToSignIn && (
          <Typography variant="body2" align="center">
            <MuiLink component={Link} href={signInHref} underline="hover">
              Back to Sign In
            </MuiLink>
          </Typography>
        )}

        {/* Additional help text */}
        {successMessage && (
          <Alert severity="info" sx={{ textAlign: 'left' }}>
            <Typography variant="body2">
              Didn&apos;t receive the email? Check your spam folder or make sure the email address is correct.
            </Typography>
          </Alert>
        )}
      </Stack>
    </Box>
  );
}
