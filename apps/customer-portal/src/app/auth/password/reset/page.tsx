'use client';

import type { ResetPasswordData, ResetPasswordResult } from '@assetforce/auth-ui/adapter/types';
import { ResetPasswordForm } from '@assetforce/auth-ui/forms';
import { Alert, Box, CircularProgress, Container, Link as MuiLink, Paper, Typography } from '@assetforce/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleResetPassword = async (data: ResetPasswordData): Promise<ResetPasswordResult> => {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: data.token, newPassword: data.newPassword }),
    });

    const result = await response.json();
    return {
      success: result.success,
      message: result.message,
      error: result.error,
    };
  };

  const handleSuccess = () => {
    // Redirect to login after short delay
    setTimeout(() => {
      router.push('/auth/login?reset=success');
    }, 2000);
  };

  // No token - show error
  if (!token) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              AssetForce Customer Portal
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              Invalid or missing reset token. Please request a new password reset link.
            </Alert>
            <Typography variant="body2" align="center">
              <MuiLink component={Link} href="/auth/password/forgot">
                Request new reset link
              </MuiLink>
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            AssetForce Customer Portal
          </Typography>
          <ResetPasswordForm
            token={token}
            onResetPassword={handleResetPassword}
            onSuccess={handleSuccess}
            signInHref="/auth/login"
          />
        </Paper>
      </Box>
    </Container>
  );
}

function ResetPasswordFallback() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    </Container>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
