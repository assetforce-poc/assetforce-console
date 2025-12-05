'use client';

import { useAuth } from '@assetforce/auth/react';
import { type AuthResult, MultiTenantLoginForm } from '@assetforce/authentication/tenant';
import { Box, CircularProgress, Container, Paper, Typography } from '@assetforce/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, refresh } = useAuth();

  // Get callback URL from query params
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(callbackUrl);
    }
  }, [isAuthenticated, isLoading, callbackUrl, router]);

  const handleSuccess = async (result: AuthResult) => {
    console.log('Login successful:', result);
    // Refresh AuthProvider state before navigation
    await refresh();
    router.push(callbackUrl);
  };

  const handleError = (message: string) => {
    console.error('Login error:', message);
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

  // If authenticated, show nothing (will redirect)
  if (isAuthenticated) {
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
            AssetForce Customer Portal
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Sign in to access your account
          </Typography>
          <MultiTenantLoginForm onSuccess={handleSuccess} onError={handleError} />
        </Paper>
      </Box>
    </Container>
  );
}

function LoginFallback() {
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

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
