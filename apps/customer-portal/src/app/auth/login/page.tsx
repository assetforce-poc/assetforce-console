'use client';

import { type AuthResult, MultiTenantLoginForm } from '@assetforce/authentication/tenant';
import { Box, Container, Paper, Typography } from '@assetforce/material';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = (result: AuthResult) => {
    // TODO: Store token and redirect to dashboard
    console.log('Login successful:', result);
    router.push('/');
  };

  const handleError = (message: string) => {
    console.error('Login error:', message);
  };

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
