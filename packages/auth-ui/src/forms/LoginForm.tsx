'use client';

import { Box, Checkbox, FormControlLabel, Link as MuiLink, Stack, Typography } from '@assetforce/material';
import Link from 'next/link';
import { type FormEvent, useState } from 'react';

import type { LoginCredentials, LoginResult } from '../adapter/types';
import { EmailInput } from '../components/EmailInput';
import { FormError } from '../components/FormError';
import { PasswordInput } from '../components/PasswordInput';
import { SubmitButton } from '../components/SubmitButton';
import { useLogin } from '../hooks/useLogin';

export interface LoginFormProps {
  /**
   * Custom login function (overrides adapter)
   */
  onLogin?: (credentials: LoginCredentials) => Promise<LoginResult>;

  /**
   * Success callback
   */
  onSuccess?: (result: LoginResult) => void;

  /**
   * Error callback
   */
  onError?: (error: string) => void;

  /**
   * Show "Remember Me" checkbox (default: true)
   */
  showRememberMe?: boolean;

  /**
   * Show "Forgot Password" link (default: true)
   */
  showForgotPassword?: boolean;

  /**
   * Forgot password link href (default: '/auth/forgot/password')
   */
  forgotPasswordHref?: string;

  /**
   * Show "Sign Up" link (default: true)
   */
  showSignUp?: boolean;

  /**
   * Sign up link href (default: '/auth/register')
   */
  signUpHref?: string;
}

/**
 * LoginForm - Complete login form with email and password
 *
 * Features:
 * - Email and password inputs
 * - Remember Me checkbox
 * - Forgot Password link
 * - Sign Up link
 * - Loading state
 * - Error handling
 *
 * @example
 * ```tsx
 * // With adapter (from AuthProvider)
 * <LoginForm
 *   onSuccess={(result) => router.push('/dashboard')}
 * />
 *
 * // With custom callback
 * <LoginForm
 *   onLogin={async (credentials) => {
 *     const response = await fetch('/api/login', { ... });
 *     return response.json();
 *   }}
 *   onSuccess={(result) => router.push('/dashboard')}
 * />
 * ```
 */
export function LoginForm({
  onLogin,
  onSuccess,
  onError,
  showRememberMe = true,
  showForgotPassword = true,
  forgotPasswordHref = '/auth/forgot/password',
  showSignUp = true,
  signUpHref = '/auth/register',
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    login,
    isLoading,
    error: loginError,
    clearError,
  } = useLogin({
    onLogin,
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

    await login({
      email,
      password,
      rememberMe,
    });
  };

  const error = validationError || loginError;

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        {/* Error message */}
        <FormError error={error} />

        {/* Email input */}
        <EmailInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          autoFocus
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
        />

        {/* Remember Me + Forgot Password */}
        {(showRememberMe || showForgotPassword) && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {showRememberMe ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                }
                label="Remember me"
              />
            ) : (
              <Box />
            )}

            {showForgotPassword && (
              <MuiLink component={Link} href={forgotPasswordHref} variant="body2" underline="hover">
                Forgot password?
              </MuiLink>
            )}
          </Box>
        )}

        {/* Submit button */}
        <SubmitButton loading={isLoading} loadingText="Signing in...">
          Sign In
        </SubmitButton>

        {/* Sign Up link */}
        {showSignUp && (
          <Typography variant="body2" align="center">
            Don&apos;t have an account?{' '}
            <MuiLink component={Link} href={signUpHref} underline="hover">
              Sign up
            </MuiLink>
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
