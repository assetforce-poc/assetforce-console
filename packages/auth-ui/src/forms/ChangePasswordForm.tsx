'use client';

import { Box, Stack, Typography } from '@assetforce/material';
import { type FormEvent, useState } from 'react';

import type { ChangePasswordData, ChangePasswordResult } from '../adapter/types';
import { FormError } from '../components/FormError';
import { PasswordInput } from '../components/PasswordInput';
import { SubmitButton } from '../components/SubmitButton';
import { useChangePassword } from '../hooks/useChangePassword';

export interface ChangePasswordFormProps {
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

  /**
   * Title text (default: 'Change Password')
   */
  title?: string;

  /**
   * Description text
   */
  description?: string;
}

/**
 * ChangePasswordForm - Form for changing password for authenticated users
 *
 * Features:
 * - Current password input
 * - New password input with validation
 * - Confirm password input
 * - Password strength indicator
 * - Loading state
 * - Error handling
 * - Success message
 *
 * Note: This is different from ResetPasswordForm. ChangePassword requires
 * the user's current password (for authenticated users), while ResetPassword
 * uses a token from email.
 *
 * @example
 * ```tsx
 * // With adapter (from AuthProvider)
 * <ChangePasswordForm
 *   onSuccess={(result) => toast.success('Password changed successfully')}
 * />
 *
 * // With custom callback
 * <ChangePasswordForm
 *   onChangePassword={async (data) => {
 *     const response = await fetch('/api/change-password', { ... });
 *     return response.json();
 *   }}
 * />
 * ```
 */
export function ChangePasswordForm({
  onChangePassword,
  onSuccess,
  onError,
  title = 'Change Password',
  description = 'Enter your current password and choose a new one.',
}: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    changePassword,
    isLoading,
    error: changePasswordError,
    clearError,
  } = useChangePassword({
    onChangePassword,
    onSuccess: (result) => {
      setSuccessMessage(result.message || 'Password changed successfully');
      // Clear form on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
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
    if (!currentPassword || !newPassword || !confirmPassword) {
      setValidationError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      setValidationError('New password must be at least 8 characters');
      return;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      setValidationError(
        'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError('New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setValidationError('New password must be different from current password');
      return;
    }

    await changePassword({ currentPassword, newPassword });
  };

  const error = validationError || changePasswordError;

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

        {/* Current Password input */}
        <PasswordInput
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          fullWidth
          autoFocus
          disabled={isLoading}
        />

        {/* New Password input */}
        <PasswordInput
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          fullWidth
          disabled={isLoading}
          helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
        />

        {/* Confirm Password input */}
        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          fullWidth
          disabled={isLoading}
        />

        {/* Submit button */}
        <SubmitButton loading={isLoading} loadingText="Changing...">
          Change Password
        </SubmitButton>
      </Stack>
    </Box>
  );
}
