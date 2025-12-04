'use client';

import { Alert, Box, Button, Fade,Stack, TextField } from '@mui/material';
import { useState } from 'react';

import type { AuthResult } from '../../graphql/generated/graphql';
import { useMultiTenantLogin } from '../../hooks';
import { TenantSelector } from '../TenantSelector';

export interface MultiTenantLoginFormProps {
  /** Callback when login completes successfully */
  onSuccess?: (result: AuthResult) => void;
  /** Callback when an error occurs */
  onError?: (message: string) => void;
}

export const MultiTenantLoginForm = ({ onSuccess, onError }: MultiTenantLoginFormProps) => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');

  const { state, loading, authenticate, selectTenant, reset } = useMultiTenantLogin({
    onSuccess,
    onError,
  });

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authenticate(credential, password);
  };

  // Credentials step
  if (state.step === 'credentials') {
    return (
      <Box component="form" onSubmit={handleCredentialSubmit} noValidate>
        <Stack spacing={3}>
          {state.error && (
            <Alert severity="error" onClose={reset}>
              {state.error}
            </Alert>
          )}

          <TextField
            required
            fullWidth
            id="credential"
            label="Email or Username"
            name="credential"
            autoComplete="username"
            autoFocus
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            disabled={loading}
          />

          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || !credential || !password}
          >
            {loading ? 'Authenticating...' : 'Continue'}
          </Button>
        </Stack>
      </Box>
    );
  }

  // Tenant selection step
  if (state.step === 'tenant-selection' && state.availableRealms) {
    return (
      <Fade in>
        <Box>
          <Stack spacing={3}>
            {state.error && (
              <Alert severity="error" onClose={() => reset()}>
                {state.error}
              </Alert>
            )}

            <TenantSelector
              realms={state.availableRealms}
              selectedRealm={state.selectedRealm}
              loading={loading}
              onSelect={selectTenant}
              error={state.error}
            />

            <Button variant="text" onClick={reset} disabled={loading}>
              ← Back to sign in
            </Button>
          </Stack>
        </Box>
      </Fade>
    );
  }

  // Complete step (should redirect, but show success message as fallback)
  if (state.step === 'complete') {
    return <Alert severity="success">Login successful! Redirecting...</Alert>;
  }

  return null;
};
