'use client';

import { Box, Checkbox, FormControlLabel, Link as MuiLink, Stack, TextField, Typography } from '@assetforce/material';
import Link from 'next/link';
import { type FormEvent, useState } from 'react';

import type { RegisterData, RegisterResult } from '../adapter/types';
import { EmailInput } from '../components/EmailInput';
import { FormError } from '../components/FormError';
import { PasswordInput } from '../components/PasswordInput';
import { SubmitButton } from '../components/SubmitButton';
import { useRegister } from '../hooks/useRegister';

export interface RegisterFormProps {
  /**
   * Custom register function (overrides adapter)
   */
  onRegister?: (data: RegisterData) => Promise<RegisterResult>;

  /**
   * Success callback
   */
  onSuccess?: (result: RegisterResult) => void;

  /**
   * Error callback
   */
  onError?: (error: string) => void;

  /**
   * Show first name field (default: true)
   */
  showFirstName?: boolean;

  /**
   * Show last name field (default: true)
   */
  showLastName?: boolean;

  /**
   * Show "Sign In" link (default: true)
   */
  showSignIn?: boolean;

  /**
   * Sign in link href (default: '/auth/login')
   */
  signInHref?: string;

  /**
   * Terms and conditions link href (required if terms shown)
   */
  termsHref?: string;

  /**
   * Privacy policy link href (optional)
   */
  privacyHref?: string;
}

/**
 * RegisterForm - Complete registration form with email, password, and optional fields
 *
 * Features:
 * - Email and password inputs
 * - Optional first name and last name fields
 * - Required terms acceptance checkbox
 * - Sign In link
 * - Loading state
 * - Error handling
 * - Client-side validation
 *
 * @example
 * ```tsx
 * // With adapter (from AuthProvider)
 * <RegisterForm
 *   onSuccess={(result) => router.push(`/auth/register/success?email=${result.email}`)}
 *   termsHref="/terms"
 *   privacyHref="/privacy"
 * />
 *
 * // With custom callback
 * <RegisterForm
 *   onRegister={async (data) => {
 *     const response = await fetch('/api/register', { ... });
 *     return response.json();
 *   }}
 *   onSuccess={(result) => router.push('/auth/register/success')}
 *   termsHref="/terms"
 * />
 * ```
 */
export function RegisterForm({
  onRegister,
  onSuccess,
  onError,
  showFirstName = true,
  showLastName = true,
  showSignIn = true,
  signInHref = '/auth/login',
  termsHref = '/terms',
  privacyHref,
}: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    register,
    isLoading,
    error: registerError,
    clearError,
  } = useRegister({
    onRegister,
    onSuccess,
    onError,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setValidationError(null);

    // Simple validation
    if (!email || !password) {
      setValidationError('Please enter both email and password');
      return;
    }

    if (!email.includes('@')) {
      setValidationError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      setValidationError(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      );
      return;
    }

    if (!acceptTerms) {
      setValidationError('You must accept the terms and conditions to register');
      return;
    }

    await register({
      email,
      password,
      firstName: showFirstName && firstName ? firstName : undefined,
      lastName: showLastName && lastName ? lastName : undefined,
      acceptTerms,
    });
  };

  const error = validationError || registerError;

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        {/* Error message */}
        <FormError error={error} />

        {/* First Name and Last Name (optional) */}
        {(showFirstName || showLastName) && (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {showFirstName && (
              <TextField
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                autoFocus
                disabled={isLoading}
                inputProps={{
                  autoComplete: 'given-name',
                }}
              />
            )}

            {showLastName && (
              <TextField
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                autoFocus={!showFirstName}
                disabled={isLoading}
                inputProps={{
                  autoComplete: 'family-name',
                }}
              />
            )}
          </Stack>
        )}

        {/* Email input */}
        <EmailInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          autoFocus={!showFirstName && !showLastName}
          disabled={isLoading}
        />

        {/* Password input */}
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          disabled={isLoading}
          helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
        />

        {/* Terms acceptance */}
        <FormControlLabel
          control={
            <Checkbox
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              disabled={isLoading}
              required
            />
          }
          label={
            <Typography variant="body2">
              I accept the{' '}
              <MuiLink component={Link} href={termsHref} underline="hover" target="_blank">
                Terms and Conditions
              </MuiLink>
              {privacyHref && (
                <>
                  {' '}
                  and{' '}
                  <MuiLink component={Link} href={privacyHref} underline="hover" target="_blank">
                    Privacy Policy
                  </MuiLink>
                </>
              )}
            </Typography>
          }
        />

        {/* Submit button */}
        <SubmitButton loading={isLoading} loadingText="Creating account...">
          Sign Up
        </SubmitButton>

        {/* Sign In link */}
        {showSignIn && (
          <Typography variant="body2" align="center">
            Already have an account?{' '}
            <MuiLink component={Link} href={signInHref} underline="hover">
              Sign in
            </MuiLink>
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
