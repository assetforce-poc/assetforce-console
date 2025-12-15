'use client';

import { Alert, Box, Button, Icons, Paper, Stack, Typography } from '@assetforce/material';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { useResendVerificationEmail } from '../../verify-email/hooks';

export interface RegistrationSuccessProps {
  /** User's email address (for display) */
  email: string;
  /** Resend verification email callback (deprecated - using built-in hook now) */
  onResend?: () => void;
}

/**
 * RegistrationSuccess - Success message after registration
 *
 * Displays a success message and prompts user to check their email.
 * Includes resend verification email functionality with 60s cooldown.
 *
 * @example
 * ```tsx
 * <RegistrationSuccess email="user@example.com" />
 * ```
 */
export function RegistrationSuccess({ email }: RegistrationSuccessProps) {
  const { resend, loading } = useResendVerificationEmail();
  const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(60); // Start with 60s initial cooldown

  // Handle resend
  const handleResend = useCallback(async () => {
    setResendMessage(null);
    const result = await resend(email);

    if (result.success) {
      setResendMessage({ type: 'success', text: 'Verification email has been resent. Please check your inbox.' });
      // Restart 60-second cooldown
      setCooldownRemaining(60);
    } else {
      const errorText =
        result.message === 'EMAIL_ALREADY_VERIFIED'
          ? 'This email is already verified. Please sign in.'
          : 'Failed to resend verification email. Please try again later.';
      setResendMessage({ type: 'error', text: errorText });
    }
  }, [email, resend]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => {
        setCooldownRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownRemaining]);

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
          Registration Successful!
        </Typography>

        {/* Description */}
        <Typography variant="body1" color="text.secondary">
          We&apos;ve sent a verification email to:
        </Typography>

        <Typography variant="h6" sx={{ wordBreak: 'break-all' }}>
          {email}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Please check your inbox and click the verification link to activate your account.
        </Typography>

        {/* Resend Message */}
        {resendMessage && (
          <Alert severity={resendMessage.type} onClose={() => setResendMessage(null)} sx={{ width: '100%' }}>
            {resendMessage.text}
          </Alert>
        )}

        {/* Spam Notice with Resend Button */}
        <Box
          sx={{
            p: 2,
            bgcolor: 'grey.100',
            borderRadius: 1,
            width: '100%',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <strong>Didn&apos;t receive the email?</strong>
            <br />
            Check your spam folder or{' '}
            <Button
              variant="text"
              size="small"
              onClick={handleResend}
              disabled={loading || cooldownRemaining > 0}
              sx={{ p: 0, minWidth: 0, textTransform: 'none' }}
            >
              {loading
                ? 'sending...'
                : cooldownRemaining > 0
                  ? `resend in ${cooldownRemaining}s`
                  : 'resend verification email'}
            </Button>
          </Typography>
        </Box>

        {/* Back to Login */}
        <Button component={Link} href="/auth/login" variant="outlined" fullWidth>
          Back to Sign In
        </Button>
      </Stack>
    </Paper>
  );
}
