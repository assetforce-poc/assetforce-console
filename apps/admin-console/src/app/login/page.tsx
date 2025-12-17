'use client';

import { useAuth } from '@assetforce/auth/react';
import { Alert, Box, Button, Card, CardContent, Container, TextField, Typography } from '@assetforce/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, signIn, pendingTenantSelection, availableTenants, selectTenant } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !pendingTenantSelection) {
      router.push('/');
    }
  }, [isAuthenticated, pendingTenantSelection, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = await signIn({ username, password });
      if (!result.success) {
        setError(result.error || 'Sign in failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectTenant = async (tenantId: string) => {
    setError(null);
    setSubmitting(true);

    try {
      await selectTenant(tenantId);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select tenant');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  // Tenant selection screen
  if (pendingTenantSelection && availableTenants.length > 0) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h1" gutterBottom>
                Select Tenant
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                You have access to multiple tenants. Please select one to continue.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {availableTenants.map((tenant) => (
                  <Button
                    key={tenant.id}
                    variant="outlined"
                    fullWidth
                    disabled={submitting}
                    onClick={() => handleSelectTenant(tenant.id)}
                    sx={{ justifyContent: 'flex-start', py: 2 }}
                  >
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="subtitle1">{tenant.name || tenant.id}</Typography>
                      {tenant.description && (
                        <Typography variant="body2" color="text.secondary">
                          {tenant.description}
                        </Typography>
                      )}
                    </Box>
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  // Login form
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h1" gutterBottom>
              Admin Console Login
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Username"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={submitting}
                autoComplete="username"
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                autoComplete="current-password"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={submitting || !username || !password}
                sx={{ mt: 3 }}
              >
                {submitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
