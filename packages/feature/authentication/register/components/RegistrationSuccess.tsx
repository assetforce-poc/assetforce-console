'use client';

import { Box, Button, Icons,Paper, Stack, Typography } from '@assetforce/material';
import Link from 'next/link';

export interface RegistrationSuccessProps {
  /** User's email address (for display) */
  email: string;
  /** Resend verification email callback (Phase 2) */
  onResend?: () => void;
}

/**
 * RegistrationSuccess - Success message after registration
 *
 * Displays a success message and prompts user to check their email.
 *
 * @example
 * ```tsx
 * <RegistrationSuccess email="user@example.com" />
 * ```
 */
export function RegistrationSuccess({ email, onResend }: RegistrationSuccessProps) {
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

        {/* Spam Notice */}
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
            {onResend ? (
              <Button variant="text" size="small" onClick={onResend} sx={{ p: 0, minWidth: 0, textTransform: 'none' }}>
                resend verification email
              </Button>
            ) : (
              'wait a few minutes and try again'
            )}
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
