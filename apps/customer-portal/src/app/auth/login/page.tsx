'use client';

import { useRouter } from 'next/navigation';
import { Container, Typography, Box, Paper } from '@assetforce/material';
import { LoginForm, type LoginResult } from '@assetforce/authentication/login';

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = (result: Extract<LoginResult, { type: 'success' }>) => {
    // TODO: Store token and redirect to dashboard
    console.log('Login successful:', result);
    router.push('/');
  };

  const handleMFARequired = (result: Extract<LoginResult, { type: 'mfa_required' }>) => {
    // TODO: Redirect to MFA verification page
    console.log('MFA required:', result);
    router.push('/auth/mfa');
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
          <LoginForm onSuccess={handleSuccess} onMFARequired={handleMFARequired} />
        </Paper>
      </Box>
    </Container>
  );
}
