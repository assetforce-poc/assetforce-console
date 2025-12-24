'use client';

import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Typography,
} from '@assetforce/material';
import { ApplicationList, InviteList, InviteSendDialog, useTenant } from '@assetforce/tenant';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';

const TYPE_COLORS: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  PRODUCTION: 'success',
  TRIAL: 'warning',
  DEMO: 'primary',
  SANDBOX: 'default',
};

/**
 * Tenant Detail Page - Admin Console
 *
 * View tenant details and manage invites.
 */
export default function TenantDetailPage() {
  const params = useParams();
  const tenantId = params.id as string;

  const { tenant, loading, error, refetch } = useTenant(tenantId);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const handleOpenInviteDialog = useCallback(() => {
    setInviteDialogOpen(true);
  }, []);

  const handleCloseInviteDialog = useCallback(() => {
    setInviteDialogOpen(false);
  }, []);

  const handleInviteSuccess = useCallback(() => {
    // Refetch will happen when dialog closes
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">Failed to load tenant: {error.message}</Alert>
        </Box>
      </Container>
    );
  }

  if (!tenant) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="warning">Tenant not found</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/tenants">Tenants</Link>
          <Typography component="span" color="text.primary">
            {tenant.name}
          </Typography>
        </Breadcrumbs>

        {/* Tenant Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {tenant.displayName || tenant.name}
              </Typography>
              <Box display="flex" gap={1} mb={1}>
                <Chip label={tenant.type} color={TYPE_COLORS[tenant.type] || 'default'} size="small" />
                <Chip
                  label={tenant.isActive ? 'Active' : 'Inactive'}
                  color={tenant.isActive ? 'success' : 'default'}
                  size="small"
                />
              </Box>
              {tenant.description && (
                <Typography variant="body1" color="text.secondary">
                  {tenant.description}
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Applications Section */}
        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" component="h2">
              Applications
            </Typography>
          </Box>

          <ApplicationList tenantId={tenantId} />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Invites Section */}
        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" component="h2">
              Invites
            </Typography>
            <Button variant="contained" onClick={handleOpenInviteDialog}>
              Send Invite
            </Button>
          </Box>

          <InviteList tenantId={tenantId} />
        </Box>

        {/* Invite Dialog */}
        <InviteSendDialog
          open={inviteDialogOpen}
          onClose={handleCloseInviteDialog}
          tenantId={tenantId}
          tenantName={tenant.displayName || tenant.name}
          onSuccess={handleInviteSuccess}
        />
      </Box>
    </Container>
  );
}
