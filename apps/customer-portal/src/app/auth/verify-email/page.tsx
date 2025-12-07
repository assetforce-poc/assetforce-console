'use client';

import { VerifyEmailResult } from '@assetforce/authentication/verify-email';
import { Box, Container, Typography, Icons } from '@assetforce/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback } from 'react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSuccess = useCallback(
    (result: { tenantStatus?: { requiresTenantSelection?: boolean } }) => {
      console.log('Email verification successful:', result);
      // If user needs to select tenant, redirect to tenant selection
      if (result.tenantStatus?.requiresTenantSelection) {
        router.push('/auth/select-tenant');
      }
      // Otherwise, stay on success screen - user can click "Sign In"
    },
    [router]
  );

  const handleError = useCallback((message: string) => {
    console.error('Email verification error:', message);
  }, []);

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
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'error.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Icons.ErrorOutline sx={{ fontSize: 48, color: 'error.main' }} />
          </Box>
          <Typography variant="h5" gutterBottom>
            Invalid Verification Link
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The verification link is missing or invalid. Please check your email for the correct link.
          </Typography>
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
          py: 4,
        }}
      >
        <VerifyEmailResult token={token} onSuccess={handleSuccess} onError={handleError} />
      </Box>
    </Container>
  );
}

function VerifyEmailFallback() {
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
        <Typography>Loading...</Typography>
      </Box>
    </Container>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
