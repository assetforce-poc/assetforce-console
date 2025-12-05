'use client';

import { useAuth } from '@assetforce/auth/react';
import { Box, Button, CircularProgress, Container, Divider, Paper, Stack, Typography } from '@assetforce/material';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, isLoading, user, tenant, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
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

          {isAuthenticated ? (
            <Stack spacing={2}>
              <Typography variant="body1" color="text.secondary" align="center">
                Welcome back!
              </Typography>
              <Divider />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  User
                </Typography>
                <Typography variant="body1">{user?.name ?? 'Unknown'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Tenant
                </Typography>
                <Typography variant="body1">{tenant?.name ?? 'Unknown'}</Typography>
              </Box>
              <Divider />
              <Button variant="outlined" color="error" fullWidth onClick={handleSignOut}>
                Sign Out
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Typography variant="body1" color="text.secondary" align="center">
                Sign in to access your account
              </Typography>
              <Button component={Link} href="/auth/login" variant="contained" fullWidth size="large">
                Sign In
              </Button>
            </Stack>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
