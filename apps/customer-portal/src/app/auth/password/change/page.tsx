'use client';

import { useAuth } from '@assetforce/auth/react';
import type { ChangePasswordData, ChangePasswordResult } from '@assetforce/auth-ui/adapter/types';
import { ChangePasswordForm } from '@assetforce/auth-ui/forms';
import { Alert, Box, CircularProgress, Container, Link as MuiLink, Paper, Typography } from '@assetforce/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ChangePasswordContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login?callbackUrl=/auth/password/change');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleChangePassword = async (data: ChangePasswordData): Promise<ChangePasswordResult> => {
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    });

    const result = await response.json();
    return {
      success: result.success,
      message: result.message,
      error: result.error,
    };
  };

  const handleSuccess = (result: ChangePasswordResult) => {
    setSuccessMessage(result.message || 'Password changed successfully');
  };

  // Show loading while checking auth state
  if (isLoading) {
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

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
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
            Change Password
          </Typography>
          {successMessage ? (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                {successMessage}
              </Alert>
              <Typography variant="body2" align="center">
                <MuiLink component={Link} href="/">
                  Return to Home
                </MuiLink>
              </Typography>
            </Box>
          ) : (
            <ChangePasswordForm onChangePassword={handleChangePassword} onSuccess={handleSuccess} />
          )}
        </Paper>
      </Box>
    </Container>
  );
}

function ChangePasswordFallback() {
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

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<ChangePasswordFallback />}>
      <ChangePasswordContent />
    </Suspense>
  );
}
