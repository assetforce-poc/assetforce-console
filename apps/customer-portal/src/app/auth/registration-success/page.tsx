'use client';

import { RegistrationSuccess } from '@assetforce/authentication/register';
import { Box, Container, Typography } from '@assetforce/material';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RegistrationSuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  if (!email) {
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
          <Typography variant="h5" color="error">
            Invalid registration session
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please try registering again.
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
        <RegistrationSuccess email={email} />
      </Box>
    </Container>
  );
}

function RegistrationSuccessFallback() {
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

export default function RegistrationSuccessPage() {
  return (
    <Suspense fallback={<RegistrationSuccessFallback />}>
      <RegistrationSuccessContent />
    </Suspense>
  );
}
