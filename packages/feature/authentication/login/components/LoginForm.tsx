'use client';

import { Alert, Box, Button, Stack, TextField } from '@assetforce/material';
import { useState } from 'react';

import { type LoginResult, useLogin, type UseLoginInput } from '../hooks';

export interface LoginFormProps {
  onSuccess?: (result: Extract<LoginResult, { type: 'success' }>) => void;
  onMFARequired?: (result: Extract<LoginResult, { type: 'mfa_required' }>) => void;
  onError?: (message: string) => void;
}

export function LoginForm({ onSuccess, onMFARequired, onError }: LoginFormProps) {
  const { login, loading } = useLogin();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const input: UseLoginInput = {
      credential,
      password,
    };

    const result = await login(input);

    switch (result.type) {
      case 'success':
        onSuccess?.(result);
        break;
      case 'mfa_required':
        onMFARequired?.(result);
        break;
      case 'error':
        setError(result.message);
        onError?.(result.message);
        break;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
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

        <Button type="submit" fullWidth variant="contained" size="large" disabled={loading || !credential || !password}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </Stack>
    </Box>
  );
}
