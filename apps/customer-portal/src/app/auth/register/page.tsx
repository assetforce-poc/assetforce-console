'use client';

import { useAuth } from '@assetforce/auth/react';
import { RegisterForm, type RegisterResult } from '@assetforce/authentication/register';
import { Box, CircularProgress, Container, Paper } from '@assetforce/material';
import { useRouter } from 'next/navigation';
import { Suspense, useCallback, useEffect } from 'react';

function RegisterContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSuccess = useCallback(
    (result: RegisterResult) => {
      console.log('Registration successful:', result);
      router.push(`/auth/registration-success?email=${encodeURIComponent(result.email || '')}`);
    },
    [router]
  );

  const handleError = useCallback((message: string) => {
    console.error('Registration error:', message);
  }, []);

  const handleLoginClick = useCallback(() => {
    router.push('/auth/login');
  }, [router]);

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
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4 }}>
          <RegisterForm onSuccess={handleSuccess} onError={handleError} onLoginClick={handleLoginClick} />
        </Paper>
      </Box>
    </Container>
  );
}

function RegisterFallback() {
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

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterContent />
    </Suspense>
  );
}
