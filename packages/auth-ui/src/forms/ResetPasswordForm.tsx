'use client';

import { Box, Link as MuiLink, Stack, Typography } from '@assetforce/material';
import Link from 'next/link';
import { type FormEvent, useState } from 'react';

import type { ResetPasswordData, ResetPasswordResult } from '../adapter/types';
import { FormError } from '../components/FormError';
import { PasswordInput } from '../components/PasswordInput';
import { SubmitButton } from '../components/SubmitButton';
import { useResetPassword } from '../hooks/useResetPassword';

export interface ResetPasswordFormProps {
  /**
   * Reset token from URL/email
   */
  token: string;

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

  /**
   * Show "Back to Sign In" link (default: true)
   */
  showBackToSignIn?: boolean;

  /**
   * Sign in link href (default: '/auth/login')
   */
  signInHref?: string;

  /**
   * Title text (default: 'Reset Password')
   */
  title?: string;

  /**
   * Description text
   */
  description?: string;
}

/**
 * ResetPasswordForm - Form for resetting password with token
 *
 * Features:
 * - New password input with validation
 * - Confirm password input
 * - Password strength indicator
 * - Loading state
 * - Error handling
 * - Success message
 * - Back to Sign In link
 *
 * @example
 * ```tsx
 * // Get token from URL
 * const token = searchParams.get('token');
 *
 * // With adapter (from AuthProvider)
 * <ResetPasswordForm
 *   token={token}
 *   onSuccess={(result) => router.push('/auth/login?reset=success')}
 * />
 *
 * // With custom callback
 * <ResetPasswordForm
 *   token={token}
 *   onResetPassword={async (data) => {
 *     const response = await fetch('/api/reset-password', { ... });
 *     return response.json();
 *   }}
 * />
 * ```
 */
export function ResetPasswordForm({
  token,
  onResetPassword,
  onSuccess,
  onError,
  showBackToSignIn = true,
  signInHref = '/auth/login',
  title = 'Reset Password',
  description = 'Enter your new password below.',
}: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    resetPassword,
    isLoading,
    error: resetPasswordError,
    clearError,
  } = useResetPassword({
    onResetPassword,
    onSuccess: (result) => {
      setSuccessMessage(result.message || 'Password reset successfully');
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
    if (!newPassword || !confirmPassword) {
      setValidationError('Please enter and confirm your new password');
      return;
    }

    if (newPassword.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      setValidationError(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    await resetPassword({ token, newPassword });
  };

  const error = validationError || resetPasswordError;

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

        {/* New Password input */}
        <PasswordInput
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          fullWidth
          autoFocus
          disabled={isLoading || !!successMessage}
          helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
        />

        {/* Confirm Password input */}
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          fullWidth
          disabled={isLoading || !!successMessage}
        />

        {/* Submit button */}
        <SubmitButton loading={isLoading} loadingText="Resetting..." disabled={!!successMessage}>
          Reset Password
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
