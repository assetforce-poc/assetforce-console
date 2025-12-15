'use client';

import { Box, Button, Container, Icons, Paper, Stack, Typography } from '@assetforce/material';
import Link from 'next/link';

/**
 * Tenant Selection Page (Placeholder)
 *
 * TODO: Implement actual tenant selection logic
 * - Display available tenants
 * - Allow user to select/apply to join tenant
 * - Handle tenant membership flow
 */
export default function SelectTenantPage() {
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
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
          }}
        >
          <Stack spacing={3} alignItems="center">
            {/* Icon */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'info.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icons.Business sx={{ fontSize: 48, color: 'info.main' }} />
            </Box>

            {/* Title */}
            <Typography variant="h4" component="h1">
              Select Organization
            </Typography>

            {/* Description */}
            <Typography variant="body1" color="text.secondary">
              Your email has been verified successfully! However, you don&apos;t belong to any organization yet.
            </Typography>

            {/* Info Box */}
            <Box
              sx={{
                p: 2,
                bgcolor: 'warning.light',
                borderRadius: 1,
                width: '100%',
              }}
            >
              <Typography variant="body2">
                <strong>Next Steps:</strong>
                <br />
                • Contact your administrator to be invited to an organization
                <br />
                • Or apply to join an existing organization
                <br />• Once approved, you&apos;ll be able to sign in
              </Typography>
            </Box>

            {/* Actions */}
            <Stack direction="column" spacing={2} width="100%">
              <Button variant="contained" size="large" fullWidth disabled>
                Apply to Join Organization (Coming Soon)
              </Button>
              <Button component={Link} href="/auth/login" variant="outlined" size="large" fullWidth>
                Go to Sign In
              </Button>
            </Stack>

            {/* Footer Note */}
            <Typography variant="caption" color="text.secondary">
              This feature is under development. For now, please contact your administrator to be added to an
              organization.
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}
