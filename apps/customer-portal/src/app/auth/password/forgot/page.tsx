'use client';

import type { ForgotPasswordData, ForgotPasswordResult } from '@assetforce/auth-ui/adapter/types';
import { ForgotPasswordForm } from '@assetforce/auth-ui/forms';
import { Box, Container, Paper, Typography } from '@assetforce/material';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

function ForgotPasswordContent() {
  const router = useRouter();

  const handleForgotPassword = async (data: ForgotPasswordData): Promise<ForgotPasswordResult> => {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email }),
    });

    const result = await response.json();
    return {
      success: result.success,
      message: result.message,
      error: result.error,
    };
  };

  const handleSuccess = () => {
    // Stay on page and show success message (handled by form)
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
          <ForgotPasswordForm
            onForgotPassword={handleForgotPassword}
            onSuccess={handleSuccess}
            signInHref="/auth/login"
          />
        </Paper>
      </Box>
    </Container>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
