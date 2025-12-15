'use client';

import { useAuth } from '@assetforce/auth/react';
import { Box, Button, CircularProgress, Container, Paper, Stack, Typography } from '@assetforce/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, isLoading, tenant } = useAuth();
  const router = useRouter();

  // Redirect logic based on authentication and tenant status
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (tenant) {
        // User has tenant → redirect to dashboard
        router.push('/dashboard');
      } else {
        // User has no tenant → redirect to tenant request page
        router.push('/tenant/request');
      }
    }
  }, [isAuthenticated, isLoading, tenant, router]);

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

  // Show welcome page for non-authenticated users
  if (!isAuthenticated) {
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
              Welcome to AssetForce
            </Typography>

            <Stack spacing={2}>
              <Typography variant="body1" color="text.secondary" align="center">
                Sign in to access your account
              </Typography>
              <Button component={Link} href="/auth/login" variant="contained" fullWidth size="large">
                Sign In
              </Button>
              <Button component={Link} href="/auth/register" variant="outlined" fullWidth size="large">
                Create Account
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Container>
    );
  }

  // While redirecting, show loading
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
