'use client';

import { Box, Link as MuiLink, Stack, Typography } from '@assetforce/material';
import Link from 'next/link';
import { type FormEvent, useState } from 'react';

import type { ForgotPasswordData, ForgotPasswordResult } from '../adapter/types';
import { EmailInput } from '../components/EmailInput';
import { FormError } from '../components/FormError';
import { SubmitButton } from '../components/SubmitButton';
import { useForgotPassword } from '../hooks/useForgotPassword';

export interface ForgotPasswordFormProps {
  /**
   * Custom forgot password function (overrides adapter)
   */
  onForgotPassword?: (data: ForgotPasswordData) => Promise<ForgotPasswordResult>;

  /**
   * Success callback
   */
  onSuccess?: (result: ForgotPasswordResult) => void;

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
   * Title text (default: 'Forgot Password?')
   */
  title?: string;

  /**
   * Description text
   */
  description?: string;
}

/**
 * ForgotPasswordForm - Form for requesting password reset email
 *
 * Features:
 * - Email input
 * - Loading state
 * - Error handling
 * - Success message
 * - Back to Sign In link
 *
 * @example
 * ```tsx
 * // With adapter (from AuthProvider)
 * <ForgotPasswordForm
 *   onSuccess={(result) => router.push(`/auth/forgot/password/sent?email=${result.email}`)}
 * />
 *
 * // With custom callback
 * <ForgotPasswordForm
 *   onForgotPassword={async (data) => {
 *     const response = await fetch('/api/forgot-password', { ... });
 *     return response.json();
 *   }}
 *   onSuccess={(result) => toast.success('Password reset email sent')}
 * />
 * ```
 */
export function ForgotPasswordForm({
  onForgotPassword,
  onSuccess,
  onError,
  showBackToSignIn = true,
  signInHref = '/auth/login',
  title = 'Forgot Password?',
  description = 'Enter your email address and we will send you a link to reset your password.',
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    forgotPassword,
    isLoading,
    error: forgotPasswordError,
    clearError,
  } = useForgotPassword({
    onForgotPassword,
    onSuccess: (result) => {
      setSuccessMessage(result.message || `Password reset instructions have been sent to ${email}`);
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

    await forgotPassword({ email });
  };

  const error = validationError || forgotPasswordError;

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
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: 'success.light',
              color: 'success.contrastText',
            }}
          >
            <Typography variant="body2">{successMessage}</Typography>
          </Box>
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
          disabled={isLoading || !!successMessage}
        />

        {/* Submit button */}
        <SubmitButton loading={isLoading} loadingText="Sending..." disabled={!!successMessage}>
          Send Reset Link
        </SubmitButton>

        {/* Back to Sign In link */}
        {showBackToSignIn && (
          <Typography variant="body2" align="center">
            <MuiLink component={Link} href={signInHref} underline="hover">
              Back to Sign In
            </MuiLink>
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
